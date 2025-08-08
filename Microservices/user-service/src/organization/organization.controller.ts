import { Body, Controller, Post, Get, Param, Put, Delete, Patch } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { IOrganization, ITelecaller } from './organization.schema';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post()
  async create(@Body() body: Partial<IOrganization>) {
    return this.orgService.createOrganization(body);
  }

  @Get()
  async findAll() {
    return this.orgService.getAllOrganizations();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.orgService.getOrganizationById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() update: Partial<IOrganization>) {
    return this.orgService.updateOrganization(id, update);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.orgService.deleteOrganization(id);
  }

  // Update status of a telecaller in an organization
  @Patch(':orgId/telecallers/:telecallerUserId/status')
  async updateTelecallerStatus(
    @Param('orgId') orgId: string,
    @Param('telecallerUserId') telecallerUserId: string,
    @Body('status') status: 'available' | 'not available',
  ) {
    return this.orgService.updateTelecallerStatus(orgId, telecallerUserId, status);
  }
  
  @Get(':id/telecallers')
  async getTelecallers(@Param('id') id: string) {
    return this.orgService.getTelecallers(id);
  }
}
