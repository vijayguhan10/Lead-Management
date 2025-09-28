import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the HTTP application
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, // Allow all origins
    credentials: true,
  });

  // Create the microservice for inter-service communication
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      // Bind to all interfaces inside the container/host. Use env to override in different envs.
      host: 'localhost',
      port: Number(process.env.TCP_PORT) || 8001, // Port for microservice communication
    },
  });

  // Start both the HTTP app and microservice
  await app.startAllMicroservices();
  await app.listen(3001, '0.0.0.0');

  const url = await app.getUrl();
  console.log(`Auth service running on ${url}`);
  console.log(`Auth microservice running on TCP ${process.env.TCP_HOST || '0.0.0.0'}:${process.env.TCP_PORT || 8001}`);
}
bootstrap();
