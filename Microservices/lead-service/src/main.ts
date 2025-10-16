import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for HTTP
  app.enableCors({
    origin: true, // Allow all origins
    credentials: true,
  });

  // Connect TCP microservice for inter-service communication
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: Number(process.env.LEAD_SERVICE_TCP_PORT) || 8003,
    },
  });

  // Start all microservices
  await app.startAllMicroservices();
  console.log('Lead Service TCP microservice started on port 8003');

  // Start HTTP server
  await app.listen(process.env.PORT ?? 3003, '0.0.0.0');
  console.log('Lead Service HTTP server started on port 3003');
}
bootstrap();
