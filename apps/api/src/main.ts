import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType, RequestMethod } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // versioning
  app.setGlobalPrefix('api', {
    exclude: [
      { path: '', method: RequestMethod.GET },
      { path: 'docs', method: RequestMethod.GET },
      { path: 'health', method: RequestMethod.GET },
    ],
  });
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // swagger setup
  const config = new DocumentBuilder()
    .setTitle('Portl API')
    .setDescription('The Portl API description')
    .setVersion('1.0')
    .addServer(process.env.API_SERVER!)
    .addTag('users')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Bearer',
        description: 'Enter accessToken',
        in: 'header',
      },
      'JWT-auth', // This name here is important for reference in your controllers!
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    'docs',
    app,
    documentFactory,
    // remove comment for custom css and js
    // {
    //   customCssUrl:
    //     'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
    //   customJs: [
    //     'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
    //     'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js',
    //   ],
    // }
  );

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
