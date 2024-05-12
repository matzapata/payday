import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateEarningDto {
  @IsEmail()
  for: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;
}
