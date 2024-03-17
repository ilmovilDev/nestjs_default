import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AllExceptionsFilter } from './common/filter/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true }),
    CommonModule,
    DatabaseModule
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_FILTER',
      useClass: AllExceptionsFilter
    }
  ],
})
export class AppModule {}
