import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@config';
import { PrismaModule } from '@modules';
// import { WinstonLoggerService } from '@logger';
// import { LoggingInterceptor } from '@interceptors';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
