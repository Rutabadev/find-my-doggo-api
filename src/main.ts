import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // Setup global features
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const port = process.env.PORT || 3001;

  // Setup auto generated Swagger
  const config = new DocumentBuilder()
    .addServer(`http://localhost:${port}`)
    .addServer('https://find-my-doggo-api.herokuapp.com')
    .setTitle('Find My Doggo API')
    .setDescription('The API to find my doggo')
    .setVersion(process.env.npm_package_version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`Server started at http://localhost:${port}`);
  console.log(`Swagger at        http://localhost:${port}/api`);
}
bootstrap();
