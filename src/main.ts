import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation and transformation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Enable CORS for frontend links and cookies
  const frontend = process.env.FRONTEND_URL;
  const corsOptions = {
    origin: frontend || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
  };

  console.log(`[CORS] Configuration: origin=${corsOptions.origin}, credentials=${corsOptions.credentials}`);
  app.enableCors(corsOptions);

  // Redirect root '/' → '/api/v1'
  app.use((req, res, next) => {
    try {
      if (req.method === 'GET' && (req.path === '/' || req.path === '')) {
        return res.redirect('/api/v1');
      }
    } catch (e) {}
    return next();
  });

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Projet DAM API')
    .setDescription('API pour l’application DAM')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // === IMPORTANT POUR RENDER ===
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
  const host = '0.0.0.0'; // Render requires this

  try {
    await app.listen(port, host);
    console.log(`🚀 Application is running on: http://${host}:${port}`);
  } catch (err) {
    if ((err as any)?.code === 'EADDRINUSE') {
      console.error(`❌ Port ${port} is already in use.`);
      process.exit(1);
    }
    throw err;
  }
}

bootstrap();
