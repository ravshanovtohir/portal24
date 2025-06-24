import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  name_uz?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  name_ru?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  name_en?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
