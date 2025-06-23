import { config } from './validate.config';

const APP_PORT = config.get<string>('APP_PORT') ?? 1722;
const DATABASE_URL = config.get<string>('DATABASE_URL') ?? '';

export { APP_PORT, DATABASE_URL };
