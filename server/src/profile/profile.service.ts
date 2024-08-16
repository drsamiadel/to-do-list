import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Builder, until, WebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';

@Injectable()
export class ProfileService {
  private driver: WebDriver;

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {
    const chromeOptions = new chrome.Options();
    chromeOptions.addArguments('--headless');
    chromeOptions.addArguments('--disable-gpu');
    chromeOptions.addArguments('--no-sandbox');

    this.driver = new Builder()
      .forBrowser('chrome')
      .setChromeOptions(chromeOptions)
      .build();
  }

  async getProfile(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    const hidePassword = user.toObject();
    delete hidePassword.password;

    return hidePassword;
  }

  async scrapeLinkedInProfile(url: string): Promise<any> {
    try {
      await this.driver.get(url);

      await this.driver.wait(until.elementLocated({ css: 'h1' }), 10000);

      const name = await this.driver
        .findElement({ css: 'h1.text-heading-xlarge' })
        .getText();

      const location = await this.driver
        .findElement({ css: 'span.text-body-small.inline' })
        .getText();

      const image = await this.driver
        .findElement({ css: 'img.pv-top-card-profile-picture__image--show' })
        .getAttribute('src');

      return { name, location, image, url };
    } catch (error) {
      console.error(`Error scraping LinkedIn profile: ${error}`);
    }
  }

  async loginToLinkedIn(email: string, password: string): Promise<void> {
    try {
      await this.driver.get('https://www.linkedin.com/login');

      await this.driver.wait(until.elementLocated({ id: 'username' }), 10000);

      await this.driver.findElement({ id: 'username' }).sendKeys(email);

      await this.driver.findElement({ id: 'password' }).sendKeys(password);

      await this.driver.findElement({ css: 'button[type=submit]' }).click();
    } catch (error) {
      console.error(`Error logging in to LinkedIn: ${error}`);
    }
  }
}
