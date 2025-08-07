import { Body, Controller, Post } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { IOrganization } from './organization.schema';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post()
  async create(@Body() body: Partial<IOrganization>) {
    // Optionally add validation here
    return this.orgService.createOrganization(body);
  }
}
