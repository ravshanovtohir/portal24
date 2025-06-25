import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateNewsDto {
  @ApiProperty({
    description: 'news title in uzbek',
    example: 'toshkentda yangi metro stansiyasi ochildi',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  title_uz?: string;

  @ApiProperty({
    description: 'news title in russian',
    example: 'в ташкенте открыта новая станция метро',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  title_ru?: string;

  @ApiProperty({
    description: 'news title in english',
    example: 'new metro station opened in tashkent',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title_en: string;

  @ApiProperty({
    description: 'news summary in uzbek',
    example: 'toshkent shahrida yangi metro stansiyasi foydalanishga topshirildi.',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  summary_uz?: string;

  @ApiProperty({
    description: 'news summary in russian',
    example: 'в ташкенте введена в эксплуатацию новая станция метро.',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  summary_ru?: string;

  @ApiProperty({
    description: 'news summary in english',
    example: 'a new metro station has been commissioned in tashkent.',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  summary_en?: string;

  @ApiProperty({
    description: 'news content in uzbek (html format)',
    example:
      '<p>toshkent shahrida yangi metro stansiyasi ochildi. bu stansiya zamonaviy dizayn va texnologiyalar bilan jihozlangan...</p>',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  content_uz?: string;

  @ApiProperty({
    description: 'news content in russian (html format)',
    example: '<p>в ташкенте открыта новая станция метро, оснащенная современным дизайном и технологиями...</p>',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  content_ru?: string;

  @ApiProperty({
    description: 'news content in english (html format)',
    example: '<p>a new metro station has been opened in tashkent, equipped with modern design and technologies...</p>',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content_en: string;

  @ApiProperty({
    description: 'if true will be on top. defoult will be false',
    type: Boolean,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_hot?: boolean;

  @ApiProperty({
    description: 'list of tags for the news',
    example: ['metro', 'tashkent', 'infrastructure'],
    type: [String],
    required: true,
  })
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({
    description: 'category id',
    example: 2,
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  category_id: number;
}
