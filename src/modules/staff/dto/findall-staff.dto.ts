import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OperatorTypes, PaginationOptionalDto } from '@enums';
import { prisma } from '@helpers';

const categoryFields = Object.keys(prisma.staff.fields);

class StaffFilter {
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

class StaffSort {
  @ApiProperty({ enum: categoryFields })
  @IsIn(categoryFields)
  column: string;

  @IsEnum(Prisma.SortOrder)
  @ApiProperty({ enum: Prisma.SortOrder })
  value: Prisma.SortOrder;
}

export class GetStaffDto extends PaginationOptionalDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StaffFilter)
  @ApiProperty({ type: StaffFilter, isArray: true, required: false })
  filters?: StaffFilter[];

  @IsOptional()
  @ValidateNested()
  @Type(() => StaffSort)
  @ApiProperty({ type: StaffSort, required: false })
  sort?: StaffSort;
}
