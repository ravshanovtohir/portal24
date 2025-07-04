import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OperatorTypes, PaginationOptionalDto } from '@enums';
import { prisma } from '@helpers';

const categoryFields = Object.keys(prisma.staff.fields);

class NewsFilter {
  @IsIn(categoryFields)
  @ApiProperty({ enum: categoryFields })
  column: string;

  @IsEnum(OperatorTypes)
  @ApiProperty({ enum: OperatorTypes })
  operator: OperatorTypes;

  @IsString()
  @ApiProperty({ type: String })
  value: string;
}

class NewsSort {
  @ApiProperty({ enum: categoryFields })
  @IsIn(categoryFields)
  column: string;

  @IsEnum(Prisma.SortOrder)
  @ApiProperty({ enum: Prisma.SortOrder })
  value: Prisma.SortOrder;
}

export class GetNewsDto extends PaginationOptionalDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NewsFilter)
  @ApiProperty({ type: NewsFilter, isArray: true, required: false })
  filters?: NewsFilter[];

  @IsOptional()
  @ValidateNested()
  @Type(() => NewsSort)
  @ApiProperty({ type: NewsSort, required: false })
  sort?: NewsSort;

  @ApiProperty({
    type: String,
    required: false,
    description:
      "popular | hot | hech narsa jo'natilmasa hammasini tarib bilan oxirgi yaratilganlariga qarab ob keladi",
  })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'video | photo | article',
  })
  @IsNumber()
  @IsOptional()
  category_id?: number;

  @ApiProperty({
    type: String,
    required: false,
    description: 'video | photo | article',
  })
  @IsString()
  @IsOptional()
  content_type?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'nimadirda',
  })
  @IsOptional()
  search?: string;
}
