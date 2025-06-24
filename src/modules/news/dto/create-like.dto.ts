import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsInt } from 'class-validator';

export class CreateLikeDto {
  @ApiProperty({
    description: 'user id',
    example: 1,
    type: Number,
    required: true,
  })
  @IsNotEmpty()
  @IsInt()
  user_id: number;

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
