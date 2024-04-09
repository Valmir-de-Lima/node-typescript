import { Module } from '@nestjs/common';
import { BackofficeModule } from './backoffice/backoffice.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://balta:e296cd9f@localhost:27017/admin'),
    BackofficeModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
