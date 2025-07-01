export interface DailyWeatherDto {
  dayName: string;
  date: string;
  maxTemp: number;
  minTemp: number;
  windSpeed: number;
  humidity: number;
}

export interface MultiLangDailyWeatherDto {
  uz: DailyWeatherDto[];
  en: DailyWeatherDto[];
  ru: DailyWeatherDto[];
}
