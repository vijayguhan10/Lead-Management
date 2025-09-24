import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadModule } from './lead/lead.module';
import { HealthController } from './health.controller';


@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://vijayguhan10:TN30e4230!@cluster0.swhz00z.mongodb.net/lead-service',
    
    ),
    LeadModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
