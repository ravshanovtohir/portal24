import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUtilitiesDatumDto } from './dto/create-utilities-datum.dto';
import { UpdateUtilitiesDatumDto } from './dto/update-utilities-datum.dto';
import { HttpService } from '@nestjs/axios';
import { WEATHER_API_KEY } from '@config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UtilitiesDataService {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.openweathermap.org/data/2.5/weather';
  private readonly oneCallUrl: string = 'https://api.openweathermap.org/data/3.0/onecall';
  constructor(private readonly httpService: HttpService) {
    this.apiKey = WEATHER_API_KEY;
  }
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

  async getCoordinates(city: string): Promise<{ lat: number; lon: number }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.baseUrl, {
          params: { q: city, appid: this.apiKey },
        }),
      );
      return {
        lat: response.data.coord.lat,
        lon: response.data.coord.lon,
      };
    } catch (error) {
      throw new BadRequestException('Shahar topilmadi');
    }
  }

  async getWeeklyWeatherByLang(city: string, lang: string): Promise<any[]> {
    try {
      const { lat, lon } = await this.getCoordinates(city);
      const response = await firstValueFrom(
        this.httpService.get(this.oneCallUrl, {
          params: {
            lat,
            lon,
            appid: this.apiKey,
            units: 'metric',
            lang,
          },
        }),
      );
      return response.data.daily.slice(0, 7).map((day: any) => ({
        date: new Date(day.dt * 1000).toISOString().split('T')[0],
        temperature: day.temp.day,
        description: day.weather[0].description,
        humidity: day.humidity,
        windSpeed: day.wind_speed,
      }));
    } catch (error) {
      throw new InternalServerErrorException("Haftalik ma'lumotlar olishda xatolik");
    }
  }

  async getMultiLangWeeklyWeather(city: string = 'uzbekistan'): Promise<any> {
    try {
      const [uz, en, ru] = await Promise.all([
        this.getWeeklyWeatherByLang(city, 'uz'),
        this.getWeeklyWeatherByLang(city, 'en'),
        this.getWeeklyWeatherByLang(city, 'ru'),
      ]);
      console.log({ uz, en, ru });

      return { uz, en, ru };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Ma'lumotlar olishda xatolik");
    }
  }
}
