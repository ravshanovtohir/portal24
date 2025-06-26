import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateStaffDto {
  @ApiProperty({ type: String, required: false })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ type: String, required: false })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: String, required: false })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: false })
  @IsNotEmpty()
  @IsString()
  role: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  status: string;
}
