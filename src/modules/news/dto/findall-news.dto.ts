import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OperatorTypes, PaginationOptionalDto } from '@enums';
import { prisma } from '@helpers';

const depositFields = Object.keys(prisma.news.fields);

class NewsFilter {
  @IsIn(depositFields)
  @ApiProperty({ enum: depositFields })
  column: string;

  @IsEnum(OperatorTypes)
  @ApiProperty({ enum: OperatorTypes })
  operator: OperatorTypes;

  @IsString()
  @ApiProperty({ type: String })
  value: string;
}

class NewsSort {
  @ApiProperty({ enum: depositFields })
  @IsIn(depositFields)
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
  @ApiProperty({ type: NewsFilter, isArray: true })
  filters?: NewsFilter[];

  @IsOptional()
  @ValidateNested()
  @Type(() => NewsSort)
  @ApiProperty({ type: NewsSort })
  sort?: NewsSort;
}
