import { Body, Controller, Post, Get, Param, Put, Delete, Patch, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { IOrganization, ITelecaller } from './organization.schema';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AdminRoleGuard } from '../auth/admin-role.guard';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async create(@Body() body: Partial<IOrganization>) {
    return this.orgService.createOrganization(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async findAll() {
    return this.orgService.getAllOrganizations();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async findOne(@Param('id') id: string) {
    return this.orgService.getOrganizationById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async update(@Param('id') id: string, @Body() update: Partial<IOrganization>) {
    return this.orgService.updateOrganization(id, update);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async remove(@Param('id') id: string) {
    return this.orgService.deleteOrganization(id);
  }

  // Update status of a telecaller in an organization
  @Patch(':orgId/telecallers/:telecallerUserId/status')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async updateTelecallerStatus(
    @Param('orgId') orgId: string,
    @Param('telecallerUserId') telecallerUserId: string,
    @Body('status') status: 'available' | 'not available',
  ) {
    return this.orgService.updateTelecallerStatus(orgId, telecallerUserId, status);
  }

  @Get(':id/telecallers')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  async getTelecallers(@Param('id') id: string) {
    return this.orgService.getTelecallers(id);
  }
}
