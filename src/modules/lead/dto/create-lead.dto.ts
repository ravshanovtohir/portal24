import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLeadDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  sender_name: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  message: string;
}
