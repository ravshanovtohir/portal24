import { Injectable } from '@nestjs/common';
import { CreateUtilitiesDatumDto } from './dto/create-utilities-datum.dto';
import { UpdateUtilitiesDatumDto } from './dto/update-utilities-datum.dto';

@Injectable()
export class UtilitiesDataService {
  create(createUtilitiesDatumDto: CreateUtilitiesDatumDto) {
    return 'This action adds a new utilitiesDatum';
  }

  findAll() {
    return `This action returns all utilitiesData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} utilitiesDatum`;
  }

  update(id: number, updateUtilitiesDatumDto: UpdateUtilitiesDatumDto) {
    return `This action updates a #${id} utilitiesDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} utilitiesDatum`;
  }
}
