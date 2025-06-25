import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'comment text',
    example: 'this news is very interesting! we look forward to more such news.',
    type: String,
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'news id',
    example: 1,
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  news_id: number;
}
