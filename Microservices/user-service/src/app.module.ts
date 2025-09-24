import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationModule } from './organization/organization.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://vijayguhan10:TN30e4230!@cluster0.swhz00z.mongodb.net/user'),
    OrganizationModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
