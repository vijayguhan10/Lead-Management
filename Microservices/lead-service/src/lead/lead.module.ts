import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { AuthClient } from '../auth/auth.client';
import { RolesGuard , AdminRoleGuard } from '../auth/roles.guard';
import { Lead, LeadSchema } from './schema/lead.schema';
import { TelecallerClient } from '../telecaller/telecaller.client'; // Adjust path if needed

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lead.name, schema: LeadSchema }]),
  ],
  controllers: [LeadController],
  providers: [
    LeadService,
    AuthClient,
    TelecallerClient,
    RolesGuard,
    AdminRoleGuard,
  ],
})
export class LeadModule {}
