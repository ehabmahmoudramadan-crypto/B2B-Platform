import {
  IsString,
  IsArray,
  ValidateNested,
  IsNumber,
  IsOptional,
  IsBoolean,
  Min,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty()
  @IsNumber()
  unitPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sparePartId?: string;
}

class DeliveryAddressDto {
  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  zipCode: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  deliveryFee?: number;

  @ApiProperty()
  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress: DeliveryAddressDto;

  @ApiPropertyOptional()
  @IsOptional()
  expectedDeliveryDate?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isRush?: boolean;
}

export class SubmitOfferDto {
  @ApiProperty()
  @IsNumber()
  totalPrice: number;

  @ApiProperty()
  @IsNumber()
  deliveryFee: number;

  @ApiProperty()
  @IsNumber()
  vatAmount: number;

  @ApiProperty()
  @IsNumber()
  estimatedDeliveryDays: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: [Object] })
  @IsOptional()
  @IsArray()
  items?: any[];
}

export class AcceptOfferDto {
  @ApiProperty()
  @IsString()
  offerId: string;
}
