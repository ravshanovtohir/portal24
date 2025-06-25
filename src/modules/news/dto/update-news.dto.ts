import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsInt } from 'class-validator';

export class UpdateNewsDto {
  @ApiProperty({
    description: "Yangilikning o'zbekcha sarlavhasi",
    example: 'Toshkentda metro stansiyasi modernizatsiya qilindi',
    required: false,
  })
  @IsOptional()
  @IsString()
  title_uz?: string;

  @ApiProperty({
    description: 'Yangilikning ruscha sarlavhasi',
    example: 'Станция метро в Ташкенте модернизирована',
    required: false,
  })
  @IsOptional()
  @IsString()
  title_ru?: string;

  @ApiProperty({
    description: 'Yangilikning inglizcha sarlavhasi',
    example: 'Tashkent metro station modernized',
    required: false,
  })
  @IsOptional()
  @IsString()
  title_en?: string;

  @ApiProperty({
    description: "O'zbekcha qisqacha mazmun",
    example: "Toshkentdagi metro stansiyasi yangilandi va yangi xizmatlar qo'shildi.",
    required: false,
  })
  @IsOptional()
  @IsString()
  summary_uz?: string;

  @ApiProperty({
    description: 'Ruscha qisqacha mazmun',
    example: 'Станция метро в Ташкенте обновлена с новыми услугами.',
    required: false,
  })
  @IsOptional()
  @IsString()
  summary_ru?: string;

  @ApiProperty({
    description: 'Inglizcha qisqacha mazmun',
    example: 'The metro station in Tashkent has been upgraded with new services.',
    required: false,
  })
  @IsOptional()
  @IsString()
  summary_en?: string;

  @ApiProperty({
    description: "O'zbekcha to'liq matn",
    example: 'Toshkentdagi metro stansiyasi modernizatsiya qilindi. Yangi xizmatlar va texnologiyalar joriy etildi...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content_uz?: string;

  @ApiProperty({
    description: "Ruscha to'liq matn",
    example: 'Станция метро в Ташкенте модернизирована с внедрением новых технологий...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content_ru?: string;

  @ApiProperty({
    description: "Inglizcha to'liq matn",
    example: 'The Tashkent metro station has been modernized with new technologies introduced...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content_en?: string;

  @ApiProperty({
    description: 'Rasm URL manzili',
    example: 'https://example.com/images/updated-metro.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({
    description: "Teglar ro'yxati",
    example: ['metro', 'modernizatsiya', 'Toshkent'],
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Kategoriya ID',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsInt()
  category_id?: number;
}
