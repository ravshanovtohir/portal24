import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OperatorTypes, PaginationOptionalDto } from '@enums';
import { prisma } from '@helpers';

const categoryFields = Object.keys(prisma.category.fields);

class CategoryFilter {
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

class CategorySort {
  @ApiProperty({ enum: categoryFields })
  @IsIn(categoryFields)
  column: string;

  @IsEnum(Prisma.SortOrder)
  @ApiProperty({ enum: Prisma.SortOrder })
  value: Prisma.SortOrder;
}

export class GetCategoryDto extends PaginationOptionalDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryFilter)
  @ApiProperty({ type: CategoryFilter, isArray: true, required: false })
  filters?: CategoryFilter[];

  @IsOptional()
  @ValidateNested()
  @Type(() => CategorySort)
  @ApiProperty({ type: CategorySort, required: false })
  sort?: CategorySort;
}
