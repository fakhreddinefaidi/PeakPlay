import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { AcademyModule } from './academy/academy.module';
import { TeamsModule } from './teams/teams.module';
import { JoinRequestsModule } from './join-requests/join-requests.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { RefereesModule } from './referees/referees.module';

const DEFAULT_JWT_SECRET = 'default_jwt_secret_key_1234567890';

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 20) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be at least 20 characters long in production.');
  }

  process.env.JWT_SECRET = DEFAULT_JWT_SECRET;
}

@Module({
  imports: [
    // Load environment variables from .env (if present). Make ConfigModule global so any module
    // can inject ConfigService. Validate important vars with Joi to fail early on misconfiguration.
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(3001),
        MONGODB_URI: Joi.string().default('mongodb://localhost:27017/dam_backend'),
        // Require a JWT secret in non-demo environments to avoid insecure defaults.
        JWT_SECRET: Joi.when('NODE_ENV', {
          is: 'production',
          then: Joi.string().min(20).required(),
          otherwise: Joi.string().min(20).default(DEFAULT_JWT_SECRET),
        }),

        // OAuth vars: required in production, optional otherwise
        GOOGLE_CLIENT_ID: Joi.string().when('NODE_ENV', { is: 'production', then: Joi.required(), otherwise: Joi.allow('', null) }),
        GOOGLE_CLIENT_SECRET: Joi.string().when('NODE_ENV', { is: 'production', then: Joi.required(), otherwise: Joi.allow('', null) }),
        GOOGLE_CALLBACK_URL: Joi.string().when('NODE_ENV', { is: 'production', then: Joi.required(), otherwise: Joi.allow('', null) }),

        FACEBOOK_APP_ID: Joi.string().when('NODE_ENV', { is: 'production', then: Joi.required(), otherwise: Joi.allow('', null) }),
        FACEBOOK_APP_SECRET: Joi.string().when('NODE_ENV', { is: 'production', then: Joi.required(), otherwise: Joi.allow('', null) }),
        FACEBOOK_CALLBACK_URL: Joi.string().when('NODE_ENV', { is: 'production', then: Joi.required(), otherwise: Joi.allow('', null) }),

        // Email configuration (Brevo API uniquement - pas de SMTP)
        BREVO_API_KEY: Joi.string().when('NODE_ENV', { is: 'production', then: Joi.required(), otherwise: Joi.allow('', null) }),
        MAIL_FROM_EMAIL: Joi.string().email().default('faidifakhri9@gmail.com'),
        MAIL_FROM_NAME: Joi.string().default('PeakPlay'),
        BACKEND_URL: Joi.string().default('http://localhost:3001'),
        FRONTEND_URL: Joi.string().allow('', null),
      }).unknown(true),
      validationOptions: {
        abortEarly: false,
      },
    }),

    UsersModule,

    // Configure Mongoose using ConfigService so the connection string can come from env.
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/dam_backend',
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    AcademyModule,
    TeamsModule,
    JoinRequestsModule,
    TournamentsModule,
    RefereesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
