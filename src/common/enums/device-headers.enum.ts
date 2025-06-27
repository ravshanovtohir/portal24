import { ApiProperty } from '@nestjs/swagger';
import { ParameterObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { IsEnum, IsString } from 'class-validator';

enum Lang {
  uz = 'uz',
  ru = 'ru',
  en = 'en',
}

export class DeviceHeadersDto {
  // @IsEnum(Lang)
  'lang': Lang;
}

export const globalHeaderParametrs: ParameterObject[] = [
  {
    in: 'header',
    name: 'lang',
    required: true,
    schema: {
      enum: ['uz', 'ru', 'en'],
      type: 'string',
      default: 'uz',
    },
  },
];
