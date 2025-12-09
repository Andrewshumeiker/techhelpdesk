import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Validate automatically DTOs and discard properties not allowed
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  // Interceptor to standardize responses
  app.useGlobalInterceptors(new TransformInterceptor());
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('TechHelpDesk API')
    .setDescription('API for ticket management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(process.env.PORT || 3000);
  console.log(`🚀  Application is running on: ${await app.getUrl()}`);
}

bootstrap();