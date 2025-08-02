import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './Dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async create(@Body() authDto: AuthDto) {
    return this.authService.create(authDto);
  }

  @Get()
  async findAll() {
    return this.authService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDto: Partial<AuthDto>) {
    return this.authService.update(id, updateDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.authService.delete(id);
  }

  @Patch(':id/toggle-active')
  async toggleIsActive(@Param('id') id: string) {
    return this.authService.toggleIsActive(id);
  }

  @Post('login')
  async login(@Body() body: { identifier: string; password: string }) {
    return this.authService.login(body.identifier, body.password);
  }
}
