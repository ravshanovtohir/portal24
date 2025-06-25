import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateLikeDto {
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
