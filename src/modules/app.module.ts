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
import { AuthModule } from './auth/auth.module';
import { StaffModule } from './staff/staff.module';
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
    AuthModule,
    StaffModule,
  ],
  controllers: [],
  providers: [WinstonLoggerService, LoggingInterceptor],
  exports: [WinstonLoggerService],
})
export class AppModule {}
