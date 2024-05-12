import { Module, ValidationPipe } from '@nestjs/common';
import { CashoutsModule } from './cashouts/cashouts.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { APP_PIPE } from '@nestjs/core';
import { EarningsModule } from './earnings/earnings.module';

@Module({
  imports: [
    CashoutsModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV == 'production'
          ? '.env.production'
          : '.env.development',
      validationSchema: Joi.object({
        // general
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('production'),
        PORT: Joi.number().default(3000),

        // auth
        AUTH_JWKS_URI: Joi.string().required(),
        ADMIN_SECRET: Joi.string().required(),

        // database
        DATABASE_URL: Joi.string().required(),
      }),
    }),
    EarningsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {}
