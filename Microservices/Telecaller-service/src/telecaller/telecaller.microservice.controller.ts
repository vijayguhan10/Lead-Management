import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TelecallerService } from './telecaller.service';

@Controller()
export class TelecallerMicroserviceController {
  constructor(private readonly telecallerService: TelecallerService) {}

  @MessagePattern({ cmd: 'validate_telecaller' })
  async validateTelecaller(@Payload() telecallerId: string) {
    try {
      const telecaller = await this.telecallerService.findById(telecallerId);
      return {
        isValid: true,
        telecaller,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
      };
    }
  }

  @MessagePattern({ cmd: 'assign_lead' })
  async assignLead(@Payload() data: { leadId: string; telecallerId: string }) {
    try {
      const telecaller = await this.telecallerService.findById(
        data.telecallerId,
      );

      if (!telecaller) {
        return { success: false, error: 'Telecaller not found' };
      }

      // Add the lead ID to the telecaller's assigned leads
      const updated = await this.telecallerService.update(data.telecallerId, {
        assignedLeads: [...telecaller.assignedLeads, data.leadId],
      });

      return {
        success: true,
        telecaller: updated,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @MessagePattern({ cmd: 'get_telecaller_leads' })
  async getTelecallerLeads(@Payload() telecallerId: string) {
    try {
      const telecaller = await this.telecallerService.findById(telecallerId);

      if (!telecaller) {
        return { success: false, error: 'Telecaller not found' };
      }

      return {
        success: true,
        leads: telecaller.assignedLeads,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
