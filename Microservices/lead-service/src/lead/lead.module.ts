import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { Lead, LeadSchema } from './schema/lead.schema';
import { TelecallerClient } from '../telecaller/telecaller.client';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
  ],
  controllers: [LeadController],
  providers: [LeadService, TelecallerClient],
})
export class LeadModule {}
