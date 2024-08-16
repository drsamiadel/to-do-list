import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(
    signUpDto: SignUpDto,
  ): Promise<{ token: string; user: Partial<User> }> {
    const { name, email, password, linkedin } = signUpDto;

    const userExists = await this.userModel.findOne({ email });

    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      linkedin,
    });

    const token = this.jwtService.sign({
      id: user._id,
      email: user.email,
      name: user.name,
      linkedin: user.linkedin,
    });

    return {
      token,
      user: { email: user.email, name: user.name, linkedin: user.linkedin },
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ token: string; user: Partial<User> }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.jwtService.sign({
      id: user._id,
      email: user.email,
      name: user.name,
      linkedin: user.linkedin,
    });

    return {
      token,
      user: { email: user.email, name: user.name, linkedin: user.linkedin },
    };
  }
}
