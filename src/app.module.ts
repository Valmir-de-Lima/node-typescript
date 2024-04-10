import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BackofficeModule } from './modules/backoffice/backoffice.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://balta:e296cd9f@localhost:27017/admin'),
    BackofficeModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
