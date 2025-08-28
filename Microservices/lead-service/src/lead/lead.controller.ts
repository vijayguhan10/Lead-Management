import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { LeadService } from './lead.service';
import { LeadDto } from './dto/lead.dto';
import { Lead, LeadStatus } from './schema/lead.schema';
import { RolesGuard, AdminRoleGuard } from '../auth/roles.guard';

@Controller('leads')
@UseGuards(RolesGuard)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  create(@Body() leadDto: LeadDto): Promise<Lead> {
    return this.leadService.create(leadDto);
  }

  @Get('/getOrganizationLeads/:organizationId')
  findAllOrganizationLeads(@Query() query, @Param() param): Promise<Lead[]> {
    return this.leadService.findAllOrganizationLeads(query, param);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Lead> {
    return this.leadService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() leadDto: Partial<LeadDto>,
  ): Promise<Lead> {
    return this.leadService.update(id, leadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Lead> {
    return this.leadService.remove(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: LeadStatus,
  ): Promise<Lead> {
    return this.leadService.updateStatus(id, status);
  }

  @Patch(':id/assign/:telecallerId')
  @UseGuards(AdminRoleGuard)
  assignLead(
    @Param('id') id: string,
    @Param('telecallerId') telecallerId: string,
  ): Promise<Lead> {
    return this.leadService.assignLead(id, telecallerId);
  }

  @Patch(':id/follow-up')
  scheduleFollowUp(
    @Param('id') id: string,
    @Body('followUpDate') followUpDate: Date,
  ): Promise<Lead> {
    return this.leadService.scheduleFollowUp(id, followUpDate);
  }

  @Patch(':id/tags/add')
  addTags(
    @Param('id') id: string,
    @Body('tags') tags: string[],
  ): Promise<Lead> {
    return this.leadService.addTags(id, tags);
  }

  @Patch(':id/tags/remove')
  removeTags(
    @Param('id') id: string,
    @Body('tags') tags: string[],
  ): Promise<Lead> {
    return this.leadService.removeTags(id, tags);
  }

  @Get('telecaller/:telecallerId')
  getLeadsByTelecaller(
    @Param('telecallerId') telecallerId: string,
  ): Promise<Lead[]> {
    return this.leadService.getLeadsByTelecaller(telecallerId);
  }

  @Get('status/:status')
  getLeadsByStatus(@Param('status') status: LeadStatus): Promise<Lead[]> {
    return this.leadService.getLeadsByStatus(status);
  }

  @Post('smart-assign')
  @UseGuards(AdminRoleGuard)
  smartBulkAssign(@Body() data: { leadIds: string[]; organizationId?: string }): Promise<any> {
    return this.leadService.smartBulkAssign(data.leadIds, data.organizationId);
  }

  @Patch(':id/notes')
  updateNotes(
    @Param('id') id: string,
    @Body('notes') notes: string,
  ): Promise<Lead> {
    return this.leadService.updateNotes(id, notes);
  }
}
