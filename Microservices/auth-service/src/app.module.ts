import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import  {Transport} from '@nestjs/microservices';
import { HealthController } from './health.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://vijayguhan10:TN30e4230!@cluster0.swhz00z.mongodb.net/auth-service',
    ),
    AuthModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
