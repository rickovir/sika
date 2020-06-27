import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpErrorFilter } from './shared/http-error.filter';
import { LoggingInterceptor } from './shared/logging.interceptor';
import { MulterModule } from '@nestjs/platform-express';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PemasukanModule } from './pemasukan/pemasukan.module';
import { JenisModule } from './jenis/jenis.module';
import { TransaksiModule } from './transaksi/transaksi.module';
import { PengeluaranModule } from './pengeluaran/pengeluaran.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot(),
    MulterModule.register({
      dest:'./upload'
    }),
    AuthModule,
    UsersModule,
    PemasukanModule,
    JenisModule,
    TransaksiModule,
    PengeluaranModule
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    {
      provide: APP_FILTER,
      useClass:HttpErrorFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    }
  ],
})
export class AppModule { }
