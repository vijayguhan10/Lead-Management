import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrganizationModel, IOrganization } from './organization.schema';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { AuthClient } from '../auth/auth.client';
import { TelecallerClient } from '../telecaller/telecaller.client';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Organization', schema: OrganizationModel.schema },
    ]),
  ],
  providers: [OrganizationService, AuthClient, TelecallerClient],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
