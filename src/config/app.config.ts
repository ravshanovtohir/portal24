import { config } from './validate.config';

const APP_PORT = config.get<string>('APP_PORT') ?? 1722;
const DATABASE_URL = config.get<string>('DATABASE_URL') ?? '';
const WEATHER_API_KEY = config.get<string>('OPENWEATHER_API_KEY') ?? '';
const JWT_SECRET_KEY = config.get<string>('JWT_SECRET_KEY') ?? '';

export { APP_PORT, DATABASE_URL, WEATHER_API_KEY, JWT_SECRET_KEY };
