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
  Req,
} from '@nestjs/common';
import { TelecallerService } from './telecaller.service';
import { TelecallerDto } from './DTO/telecaller.dto';
import { Telecaller } from './schema/telecaller.schema';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AuthClient } from '../auth/auth.client';
import { TelecallerRoleGuard, AdminAccessRoleGuard } from '../auth/Role.guard';

@Controller('telecallers')
export class TelecallerController {
  constructor(
    private readonly telecallerService: TelecallerService,
    private readonly authClient: AuthClient,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, AdminAccessRoleGuard)
  async findAll(@Req() req): Promise<Telecaller[]> {
    return this.telecallerService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, AdminAccessRoleGuard)
  async findById(@Param('id') id: string): Promise<Telecaller> {
    return this.telecallerService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, AdminAccessRoleGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() telecallerDto: TelecallerDto,
    @Req() req,
  ): Promise<Telecaller> {
    return this.telecallerService.create(telecallerDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, TelecallerRoleGuard)
  async update(
    @Param('id') id: string,
    @Body() telecallerDto: Partial<TelecallerDto>,
  ): Promise<Telecaller> {
    return this.telecallerService.update(id, telecallerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, TelecallerRoleGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.telecallerService.remove(id);
  }

  @Get(':id/leads')
  @UseGuards(JwtAuthGuard, TelecallerRoleGuard)
  async getAssignedLeads(@Param('id') id: string): Promise<string[]> {
    return this.telecallerService.getAssignedLeads(id);
  }

  @Get(':id/summary')
  @UseGuards(JwtAuthGuard, TelecallerRoleGuard)
  async getDailySummary(@Param('id') id: string): Promise<any> {
    return this.telecallerService.getDailySummary(id);
  }

  @Put('assign/:leadId/:telecallerId')
  @UseGuards(JwtAuthGuard, TelecallerRoleGuard)
  async assignLead(
    @Param('leadId') leadId: string,
    @Param('telecallerId') telecallerId: string,
  ): Promise<Telecaller> {
    return this.telecallerService.assignLead(leadId, telecallerId);
  }
}
