import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty({ message: 'Указание номера категории обязательно!' })
  @IsNumber()
  order_number: number;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name_uz: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name_ru: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name_en: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  title_uz: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  title_ru: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  title_en: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  seo_title_uz: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  seo_title_ru: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  seo_title_en: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  seo_description_uz: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  seo_description_ru: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  seo_description_en: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
