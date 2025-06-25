import { IsNotEmpty, IsNumber } from 'class-validator';

export class ViewDto {
  @IsNotEmpty()
  @IsNumber()
  news_id: number;
}
