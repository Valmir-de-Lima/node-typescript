import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as compression from 'compression';

async function bootstrap() {
  //const app = await NestFactory.create(AppModule, { logger: new CustomLogger() });
  const app = await NestFactory.create(AppModule);
  app.use(compression());

  const config = new DocumentBuilder()
    .setTitle('Petshop API')
    .setDescription('The Petshop API description')
    .setVersion('0.0.1')
    .addTag('petshop')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  await app.listen(3000);
}
bootstrap();
