import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173'
  }); 
   app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,               
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
 if (process.env.NODE_ENV !== 'production') { 
  const config = new DocumentBuilder()
    .setTitle('API Example')       
    .setDescription('API description') 
    .setVersion('0.0.1')        
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); 
 }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
