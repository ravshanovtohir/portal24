import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  status: string;
}
