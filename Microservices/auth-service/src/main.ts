import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  // Create the HTTP application
  const app = await NestFactory.create(AppModule);

  // Create the microservice for inter-service communication
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 8000, // Choose a port for microservice communication
    },
  });

  // Start both the HTTP app and microservice
  await app.startAllMicroservices();
  await app.listen(3000);

  console.log(`Auth service running on ${await app.getUrl()}`);
  console.log(`Auth microservice running on TCP port 8000`);
}
bootstrap();
