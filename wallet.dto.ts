import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DepositDto {
  @ApiProperty({ example: 500 })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentReference?: string;
}

export class WithdrawDto {
  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  amount: number;
}
