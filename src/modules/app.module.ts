import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '@config';
import { WinstonLoggerService } from '@logger';
import { LoggingInterceptor } from '@interceptors';
import {
  UserModule,
  PostModule,
  // CommentModule,
  PrismaModule,
  GatewayModule,
  NewsModule,
  CategoryModule,
  LidModule,
  UtilitiesDataModule,
} from '@modules';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    LidModule,
    UserModule,
    PostModule,
    // CommentModule,
    PrismaModule,
    GatewayModule,
    NewsModule,
    CategoryModule,
    UtilitiesDataModule,
  ],
  controllers: [],
  providers: [WinstonLoggerService, LoggingInterceptor],
  exports: [WinstonLoggerService],
})
export class AppModule {}
