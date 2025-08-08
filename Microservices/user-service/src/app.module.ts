import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationModule } from './organization/organization.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://vijayguhan10:TN30e4230!@cluster0.swhz00z.mongodb.net/user'),
    OrganizationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
