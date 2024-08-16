import {
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from 'src/auth/schemas/user.schema';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsBoolean()
  readonly completed: boolean;

  @IsOptional()
  @IsString()
  readonly category: string;

  @IsEmpty({ message: 'User is not allowed to be set.' })
  readonly author: User;

  @IsOptional()
  @IsNumber()
  readonly color: number;
}
