import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelecallerModule } from './telecaller/telecaller.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://vijayguhan10:TN30e4230!@cluster0.swhz00z.mongodb.net/telecaller-service',
     
    ),
    TelecallerModule,
  ],
  controllers: [HealthController],
  providers: []   ,
})
export class AppModule {}
