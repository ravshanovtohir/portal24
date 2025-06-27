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
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false, // index.html qidirilmasin
      },
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
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [WinstonLoggerService, LoggingInterceptor],
  exports: [WinstonLoggerService],
})
export class AppModule {}
