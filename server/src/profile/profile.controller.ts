import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { User } from 'src/auth/schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';

@Controller('profile')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  @UseGuards(AuthGuard())
  async getAllTasks(@Req() req): Promise<User> {
    return await this.profileService.getProfile(req.user._id);
  }

  @Get('/linkedin')
  @UseGuards(AuthGuard())
  async scrapeLinkedInProfile(@Req() req): Promise<{
    name: string;
    location: string;
    url: string;
    image: string;
  }> {
    await this.profileService.loginToLinkedIn(
      process.env.LINKEDIN_EMAIL,
      process.env.LINKEDIN_PASSWORD,
    );
    return await this.profileService.scrapeLinkedInProfile(req.user.linkedin);
  }
}
