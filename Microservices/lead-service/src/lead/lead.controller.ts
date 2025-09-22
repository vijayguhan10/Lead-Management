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
  Res,
  HttpStatus,
  Req,
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

  // Export leads to XLSX.
  @Get('export')
  async exportLeads(@Query() query: any, @Res() res: any) {
    // Require organizationId to be supplied by the frontend
    if (!query || !query.organizationId) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'organizationId query parameter is required' });
    }
    const buffer = await this.leadService.exportLeads(query);
    const filename = `leads_export_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(HttpStatus.OK).send(buffer);
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
    @Body('tags') tags: string[],
    @Body('interestedIn') interestedIn: string[],
    @Body('nextFollowUp') nextFollowUp?: Date | string,
    @Body('lastContacted') lastContacted?: Date | string,
  ): Promise<Lead> {
    return this.leadService.updateNotesTagsInterested(id, notes, tags, interestedIn, nextFollowUp, lastContacted);
  }
}
