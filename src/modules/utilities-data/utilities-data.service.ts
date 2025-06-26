import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUtilitiesDatumDto } from './dto/create-utilities-datum.dto';
import { UpdateUtilitiesDatumDto } from './dto/update-utilities-datum.dto';
import { HttpService } from '@nestjs/axios';
import { WEATHER_API_KEY } from '@config';
import { firstValueFrom } from 'rxjs';
import { prisma } from '@helpers';
import { DailyWeatherDto, MultiLangDailyWeatherDto } from '@interfaces';
@Injectable()
export class UtilitiesDataService {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.openweathermap.org/data/2.5/weather';
  private readonly oneCallUrl: string = 'https://api.openweathermap.org/data/3.0/onecall';
  constructor(private readonly httpService: HttpService) {
    this.apiKey = WEATHER_API_KEY;
  }

  async getWeather(lang: 'uz' | 'ru' | 'en') {
    const weather = await prisma.weather.findFirst({
      select: {
        [`weather_${lang}`]: true,
      },
    });

    ['USD', 'EUR', 'RUB', 'GBP', 'JPY', 'CAD', 'CNY', 'KGS', 'KZT', 'AED'];
    return {
      name: JSON.parse(weather[`weather_${lang}`]),
    };
  }

  async kursValyut() {
    try {
      const currecyCodes = ['USD', 'EUR', 'RUB', 'GBP', 'JPY', 'CAD', 'CNY', 'KGS', 'KZT', 'AED'];

      let date = new Date();
      date.toISOString().split('T')[0];
      const response = await firstValueFrom(
        this.httpService.get(`https://cbu.uz/ru/arkhiv-kursov-valyut/json/all/${date}`),
      );
      const result = [];
      response.data.filter((el: any) => {
        if (currecyCodes.includes(el.Ccy)) {
          result.push(el);
        }
      });

      return result;
    } catch (error) {
      throw new InternalServerErrorException("Kunlik ma'lumotlar olishda xatolik");
    }
  }

  async getCoordinates(city: string): Promise<{ lat: number; lon: number }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.baseUrl, { params: { q: city, appid: this.apiKey } }),
      );
      return { lat: response.data.coord.lat, lon: response.data.coord.lon };
    } catch (error) {
      throw new BadRequestException('Shahar topilmadi');
    }
  }

  private getDayName(date: Date, lang: string): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long' };
    return date.toLocaleDateString(lang === 'uz' ? 'uz-UZ' : lang === 'en' ? 'en-US' : 'ru-RU', options);
  }

  async getDailyWeatherByLang(city: string, lang: string): Promise<any[]> {
    try {
      const { lat, lon } = await this.getCoordinates(city);
      const response = await firstValueFrom(
        this.httpService.get(this.oneCallUrl, {
          params: { lat, lon, appid: this.apiKey, units: 'metric', lang },
        }),
      );

      const current = response.data.current;
      const daily = response.data.daily.slice(0, 7).map((day: any, index: number) => {
        const date = new Date(day.dt * 1000);
        return {
          dayName: this.getDayName(date, lang),
          date: date.toISOString().split('T')[0],
          maxTemp: Math.round(day.temp.max),
          minTemp: Math.round(day.temp.min),
          windSpeed: index === 0 ? current.wind_speed : day.wind_speed,
          humidity: index === 0 ? current.humidity : day.humidity,
        };
      });
      return daily;
    } catch (error) {
      throw new InternalServerErrorException("Kunlik ma'lumotlar olishda xatolik");
    }
  }

  async getMultiLangDailyWeather(city: string): Promise<MultiLangDailyWeatherDto> {
    try {
      const [uz, en, ru] = await Promise.all([
        this.getDailyWeatherByLang(city, 'uz'),
        this.getDailyWeatherByLang(city, 'en'),
        this.getDailyWeatherByLang(city, 'ru'),
      ]);
      return { uz, en, ru };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException("Ma'lumotlar olishda xatolik");
    }
  }

  async weatheroDb() {
    const weatherInfo = await this.getMultiLangDailyWeather('Uzbekistan');
    await prisma.weather.create({
      data: {
        weather_uz: JSON.stringify(weatherInfo.uz),
        weather_ru: JSON.stringify(weatherInfo.ru),
        weather_en: JSON.stringify(weatherInfo.en),
      },
    });
  }
}
