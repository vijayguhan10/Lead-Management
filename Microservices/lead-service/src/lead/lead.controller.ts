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

@Controller('leads')
// @UseGuards(JwtAuthGuard)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  create(@Body() leadDto: LeadDto): Promise<Lead> {
    return this.leadService.create(leadDto);
  }

  @Get()
  findAll(@Query() query): Promise<Lead[]> {
    return this.leadService.findAll(query);
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
  assignLead(
    @Param('id') id: string,
    @Param('telecallerId') telecallerId: string,
  ): Promise<Lead> {
    return this.leadService.assignLead(id, telecallerId);
  }

  @Post('bulk-assign')
  bulkAssign(
    @Body() data: { leadIds: string[]; telecallerId: string },
  ): Promise<number> {
    return this.leadService.bulkAssign(data.leadIds, data.telecallerId);
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

  @Get('follow-ups/today')
  getFollowUpsForToday(): Promise<Lead[]> {
    return this.leadService.getFollowUpsForToday();
  }

  @Get('search/:query')
  searchLeads(@Param('query') query: string): Promise<Lead[]> {
    return this.leadService.searchLeads(query);
  }

  @Get('stats')
  getLeadStats(): Promise<any> {
    return this.leadService.getLeadStats();
  }

  @Get('phone/:phone')
  findByPhone(@Param('phone') phone: string): Promise<Lead[]> {
    return this.leadService.findByPhone(phone);
  }
}
