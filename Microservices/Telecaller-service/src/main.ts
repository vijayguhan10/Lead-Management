import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: 'localhost',
      port: 8001,
    },
  });

  await app.startAllMicroservices();
  await app.listen(3002); 

  console.log(`Telecaller service running on http://localhost:3002`);
  console.log(`Telecaller microservice running on TCP port 8001`);
}
bootstrap();
