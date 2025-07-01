import { PartialType } from '@nestjs/swagger';
import { CreateUtilitiesDatumDto } from './create-utilities-datum.dto';

export class UpdateUtilitiesDatumDto extends PartialType(CreateUtilitiesDatumDto) {}
