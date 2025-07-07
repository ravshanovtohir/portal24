import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsIn, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OperatorTypes, PaginationOptionalDto } from '@enums';
import { prisma } from '@helpers';

const categoryFields = Object.keys(prisma.lead.fields);

class LidFilter {
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

class LidSort {
  @ApiProperty({ enum: categoryFields })
  @IsIn(categoryFields)
  column: string;

  @IsEnum(Prisma.SortOrder)
  @ApiProperty({ enum: Prisma.SortOrder })
  value: Prisma.SortOrder;
}

export class GetLeadDto extends PaginationOptionalDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LidFilter)
  @ApiProperty({ type: LidFilter, isArray: true, required: false })
  filters?: LidFilter[];

  @IsOptional()
  @ValidateNested()
  @Type(() => LidSort)
  @ApiProperty({ type: LidSort, required: false })
  sort?: LidSort;

  @ApiProperty({ type: String, required: false, example: 'ACTIVE', description: 'status' })
  @IsOptional()
  @IsString()
  status?: string;
}
