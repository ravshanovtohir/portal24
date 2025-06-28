import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { WEATHER_API_KEY } from '@config';
import { firstValueFrom } from 'rxjs';
import { MultiLangDailyWeatherDto } from '@interfaces';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WinstonLoggerService } from '@logger';
import { PrismaService } from '@prisma';
@Injectable()
export class UtilitiesDataService {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.openweathermap.org/data/2.5/weather';
  private readonly oneCallUrl: string = 'https://api.openweathermap.org/data/3.0/onecall';
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: WinstonLoggerService,
    private readonly prisma: PrismaService,
  ) {
    this.apiKey = WEATHER_API_KEY;
  }

  async getWeather(lang: 'uz' | 'ru' | 'en') {
    const weather = await this.prisma.weather.findFirst({
      select: {
        [`weather_${lang}`]: true,
      },
    });
    return JSON.parse(weather[`weather_${lang}`]);
  }

  async kursValyut(lang: string) {
    try {
      const currecyCodes = ['USD', 'EUR', 'RUB', 'GBP', 'JPY', 'CAD', 'CNY', 'KGS', 'KZT', 'AED'];
      lang = lang.toUpperCase();

      let date = new Date();
      date.toISOString().split('T')[0];
      const response = await firstValueFrom(
        this.httpService.get(`https://cbu.uz/ru/arkhiv-kursov-valyut/json/all/${date}`),
      );
      const result = [];
      response.data.filter((el: any) => {
        if (currecyCodes.includes(el.Ccy)) {
          result.push({
            id: el?.id,
            code: el?.Code,
            ccy: el?.Ccy,
            cyyname: el[`CcyNm_${lang}`],
            nominal: el?.Nominal,
            rate: el?.Rate,
            diff: el?.Diff,
            date: el?.Date,
          });
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
          day_name: this.getDayName(date, lang),
          date: date.toISOString().split('T')[0],
          day: Math.round(day.temp.day),
          night: Math.round(day.temp.night),
          wind_speed: index === 0 ? current.wind_speed : day.wind_speed,
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
    await this.prisma.weather.create({
      data: {
        weather_uz: JSON.stringify(weatherInfo.uz),
        weather_ru: JSON.stringify(weatherInfo.ru),
        weather_en: JSON.stringify(weatherInfo.en),
      },
    });
  }

  @Cron(CronExpression.EVERY_4_HOURS)
  async updateWeather() {
    this.logger.log('Weather Updated!');
    const weather = await this.prisma.weather.findFirst();
    const weatherInfo = await this.getMultiLangDailyWeather('Uzbekistan');

    if (!weatherInfo) {
      console.log('error getting weather infos');
      process.exit(1);
    }

    if (weather) {
      await this.prisma.weather.update({
        where: {
          id: weather.id,
        },
        data: {
          weather_uz: JSON.stringify(weatherInfo.uz),
          weather_ru: JSON.stringify(weatherInfo.ru),
          weather_en: JSON.stringify(weatherInfo.en),
          updated_at: new Date(),
        },
      });
    } else {
      await this.prisma.weather.create({
        data: {
          weather_uz: JSON.stringify(weatherInfo.uz),
          weather_ru: JSON.stringify(weatherInfo.ru),
          weather_en: JSON.stringify(weatherInfo.en),
          updated_at: new Date(),
        },
      });
    }
  }
}
