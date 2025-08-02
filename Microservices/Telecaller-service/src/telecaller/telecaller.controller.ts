import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { TelecallerService } from './telecaller.service';
import { TelecallerDto } from './DTO/telecaller.dto';
import { Telecaller } from './schema/telecaller.schema';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('telecallers')
@UseGuards(JwtAuthGuard, RolesGuard) // Apply both guards to all routes
export class TelecallerController {
  constructor(private readonly telecallerService: TelecallerService) {}

  // GET /telecallers - List all telecallers
  @Get()
  async findAll(): Promise<Telecaller[]> {
    return this.telecallerService.findAll();
  }

  // GET /telecallers/:id - Get telecaller by ID
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Telecaller> {
    return this.telecallerService.findById(id);
  }

  // POST /telecallers - Create new telecaller
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() telecallerDto: TelecallerDto): Promise<Telecaller> {
    return this.telecallerService.create(telecallerDto);
  }

  // PUT /telecallers/:id - Update telecaller details
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() telecallerDto: Partial<TelecallerDto>,
  ): Promise<Telecaller> {
    return this.telecallerService.update(id, telecallerDto);
  }

  // DELETE /telecallers/:id - Delete telecaller
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.telecallerService.remove(id);
  }

  // GET /telecallers/:id/leads - Get leads assigned to a telecaller
  @Get(':id/leads')
  async getAssignedLeads(@Param('id') id: string): Promise<string[]> {
    return this.telecallerService.getAssignedLeads(id);
  }

  // GET /telecallers/:id/summary - Daily summary: calls, leads contacted
  @Get(':id/summary')
  async getDailySummary(@Param('id') id: string): Promise<any> {
    return this.telecallerService.getDailySummary(id);
  }

  // PUT /telecallers/assign/:leadId/:telecallerId - Assign a lead to telecaller
  @Put('assign/:leadId/:telecallerId')
  async assignLead(
    @Param('leadId') leadId: string,
    @Param('telecallerId') telecallerId: string,
  ): Promise<Telecaller> {
    return this.telecallerService.assignLead(leadId, telecallerId);
  }
}
