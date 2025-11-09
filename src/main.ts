import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation and transformation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatically transform payloads to DTO instances
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
    }),
  );

  // Enable CORS for frontend so cookies (httpOnly) can be included in requests.
  const frontend = process.env.FRONTEND_URL;
  const isProd = process.env.PORT || process.env.NODE_ENV === 'production';
  
  // CORS configuration
  const corsOptions = {
    origin: frontend || (isProd ? false : true), // In production, require FRONTEND_URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Set-Cookie'],
  };
  
  console.log(`[CORS] Configuration: origin=${corsOptions.origin}, credentials=${corsOptions.credentials}`);
  app.enableCors(corsOptions);

  // Redirect root '/' to the API prefix so GET / doesn't return 404
  // (This runs before the global prefix is applied.)
  app.use((req, res, next) => {
    try {
      if (req.method === 'GET' && (req.path === '/' || req.path === '')) {
        return res.redirect('/api/v1');
      }
    } catch (e) {
      // ignore and continue
    }
    return next();
  });

  // Optional: prefix global
  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('Projet DAM API')
    .setDescription('API pour l’application DAM')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token', // nom du security scheme
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3002;
  // Listen on 0.0.0.0 in production, localhost in development
  const host = (process.env.NODE_ENV === 'production' && process.env.PORT) ? '0.0.0.0' : 'localhost';
  try {
    await app.listen(port, host);
    console.log(`Application is running on: http://${host}:${port}`);
  } catch (err) {
    if ((err as any)?.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Choose another PORT or stop the process that is using it.`);
      process.exit(1);
    }
    // rethrow unknown errors
    throw err;
  }
}
bootstrap();
