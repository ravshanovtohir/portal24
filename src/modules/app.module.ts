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
  LeadModule,
  UtilitiesDataModule,
} from '@modules';
import { AuthModule } from './auth/auth.module';
import { StaffModule } from './staff/staff.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DashboardModule } from './dashboard/dashboard.module';
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

    LeadModule,
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
    DashboardModule,
  ],
  controllers: [],
  providers: [WinstonLoggerService, LoggingInterceptor],
  exports: [WinstonLoggerService],
})
export class AppModule {}
