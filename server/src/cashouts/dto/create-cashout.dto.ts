import { IsNumber, IsString } from 'class-validator';

export class CreateCashoutDto {
  @IsNumber()
  amount: number;

  @IsString()
  currency: string;
}
