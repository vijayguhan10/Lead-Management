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
import { MessagePattern } from '@nestjs/microservices';
import { TelecallerService } from './telecaller.service';
import { TelecallerDto } from './DTO/telecaller.dto';
import { Telecaller } from './schema/telecaller.schema';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AuthClient } from '../auth/auth.client';
import {
  TelecallerRoleGuard,
  AdminAccessRoleGuard,
  TelecallerOrAdminGuard,
} from '../auth/Role.guard';

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
  @UseGuards(JwtAuthGuard, AdminAccessRoleGuard)
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

  @Get(':userId/leads')
  @UseGuards(JwtAuthGuard, TelecallerOrAdminGuard)
  async getAssignedLeads(@Param('userId') userId: string): Promise<string[]> {
    return this.telecallerService.getAssignedLeadsByUserId(userId);
  }

  @Get(':id/summary')
  @UseGuards(JwtAuthGuard, TelecallerOrAdminGuard)
  async getDailySummary(@Param('id') id: string): Promise<any> {
    return this.telecallerService.getDailySummary(id);
  }

  @Get('organization/:orgId')
  @UseGuards(JwtAuthGuard, AdminAccessRoleGuard)
  async getByOrganization(@Param('orgId') orgId: string): Promise<Telecaller[]> {
    return this.telecallerService.findByOrganization(orgId);
  }

  @Get('organization/:orgId/top3')
  @UseGuards(JwtAuthGuard, TelecallerOrAdminGuard)
  async getTopThree(@Param('orgId') orgId: string): Promise<Telecaller[]> {
    return this.telecallerService.getTopThreeByOrganization(orgId);
  }

  @Get('byUser/:userId')
  @UseGuards(JwtAuthGuard, TelecallerOrAdminGuard)
  async getByUserId(@Param('userId') userId: string): Promise<Telecaller> {
    return this.telecallerService.findByUserId(userId);
  }

  // ============================================================
  // TCP Microservice Message Patterns (for inter-service communication)
  // ============================================================

  /**
   * Get telecaller by ID via TCP
   * Used by media-service for email notifications
   */
  @MessagePattern({ cmd: 'get_telecaller_by_id' })
  async getTelecallerByIdTcp(telecallerId: string): Promise<Telecaller> {
    return this.telecallerService.findById(telecallerId);
  }

  /**
   * Get telecaller by user ID via TCP
   */
  @MessagePattern({ cmd: 'get_telecaller_by_user_id' })
  async getTelecallerByUserIdTcp(userId: string): Promise<Telecaller> {
    return this.telecallerService.findByUserId(userId);
  }

  /**
   * Get all telecallers via TCP
   */
  @MessagePattern({ cmd: 'get_all_telecallers' })
  async getAllTelecallersTcp(): Promise<Telecaller[]> {
    return this.telecallerService.findAll();
  }

  /**
   * Get telecallers by organization via TCP
   */
  @MessagePattern({ cmd: 'get_telecallers_by_organization' })
  async getTelecallersByOrganizationTcp(organizationId: string): Promise<Telecaller[]> {
    return this.telecallerService.findByOrganization(organizationId);
  }

  /**
   * Health check via TCP
   */
  @MessagePattern({ cmd: 'health_check' })
  async healthCheckTcp(): Promise<{ status: string }> {
    return { status: 'ok' };
  }

  
}
