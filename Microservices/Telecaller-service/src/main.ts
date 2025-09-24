import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true, // Allow all origins
    credentials: true,
  });

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: process.env.TCP_HOST || '0.0.0.0',
      port: Number(process.env.TCP_PORT) || 8006,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3006); 

  console.log(`Telecaller service running on http://localhost:3006`);
  console.log(`Telecaller microservice running on TCP ${process.env.TCP_HOST || '0.0.0.0'}:${process.env.TCP_PORT || 8006}`);
}
bootstrap();
