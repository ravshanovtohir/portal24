import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ type: Number, required: true })
  @IsOptional()
  @IsNumber()
  order_number: number;

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
  title_uz: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  title_ru: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  title_en: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  seo_title_uz: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  seo_title_ru: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  seo_title_en: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  seo_description_uz: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  seo_description_ru: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  seo_description_en: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
