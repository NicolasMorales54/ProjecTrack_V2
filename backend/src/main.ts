import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import * as passport from 'passport';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Configuración de CORS con variables de entorno
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
  const allowedOrigins = [
    'http://localhost:4200',
    frontendUrl,
  ];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,POST,PUT,DELETE, PATCH, OPTIONS',
    credentials: true,
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'supersecret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();
