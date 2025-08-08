import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthMicroserviceController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'create_user' })
  async createUser(@Payload() user: any) {
    try {
      const created = await this.authService.create(user);
      return { success: true, user: created };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  @MessagePattern({ cmd: 'validate_token' })
  async validateToken(@Payload() token: string) {
    try {
      const payload = await this.authService.verifyToken(token);
      return {
        isValid: true,
        user: payload,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
      };
    }
  }

  @MessagePattern({ cmd: 'check_role' })
  async checkRole(
    @Payload() data: { userId: string; requiredRoles: string[] },
  ) {
    try {
      const { userId, requiredRoles } = data;
      const user = await this.authService.findById(userId);

      if (!user) {
        return { hasRole: false, error: 'User not found' };
      }

      const hasRole = requiredRoles.includes(user.role);

      return { hasRole, role: user.role };
    } catch (error) {
      return {
        hasRole: false,
        error: error.message,
      };
    }
  }

  @MessagePattern({ cmd: 'validate_user' })
  async validateUser(@Payload() userId: string) {
    try {
      const user = await this.authService.findById(userId);
      if (!user) {
        return { isValid: false, error: 'User not found' };
      }

      return {
        isValid: true,
        isActive: user.isActive,
        role: user.role,
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
      };
    }
  }
}
