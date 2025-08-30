import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { FileService } from '../services/file.service';
import { CreateFileDto, UpdateFileDto, GetSignedUrlDto } from '../dto/file.dto';
import { File } from '../schemas/file.schema';
import { JwtAuthGuard } from '../../auth/jwt.guard';
import { TelecallerOrAdminGuard } from '../../auth/role.guard';

@Controller('files')
@UseGuards(JwtAuthGuard, TelecallerOrAdminGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('signed-url')
  @HttpCode(HttpStatus.OK)
  async getSignedUploadUrl(@Body() getSignedUrlDto: GetSignedUrlDto, @Req() req: any) {
    const user = req.user;
    const userId = user?.userId || user?.id || 'system-user';
    
    if (!getSignedUrlDto.fileName || !getSignedUrlDto.fileType || !getSignedUrlDto.leadId) {
      throw new BadRequestException('fileName, fileType, and leadId are required');
    }

    return this.fileService.generateUploadUrl(getSignedUrlDto, userId);
  }

  @Post(':fileId/confirm')
  @HttpCode(HttpStatus.OK)
  async confirmUpload(@Param('fileId') fileId: string, @Req() req: any) {
    const user = req.user;
    const userId = user?.userId || user?.id || 'system-user';
    
    return this.fileService.confirmUpload(fileId, userId);
  }

  @Get('lead/:leadId')
  async getFilesByLead(@Param('leadId') leadId: string): Promise<File[]> {
    return this.fileService.getFilesByLead(leadId);
  }

  @Get(':fileId')
  async getFileById(@Param('fileId') fileId: string): Promise<File> {
    return this.fileService.getFileById(fileId);
  }

  @Get(':fileId/download')
  async getDownloadUrl(@Param('fileId') fileId: string, @Req() req: any) {
    const user = req.user;
    const userId = user?.userId || user?.id || 'system-user';
    
    return this.fileService.generateDownloadUrl(fileId, userId);
  }

  @Put(':fileId')
  async updateFile(
    @Param('fileId') fileId: string,
    @Body() updateFileDto: UpdateFileDto,
    @Req() req: any,
  ): Promise<File> {
    const user = req.user;
    const userId = user?.userId || user?.id || 'system-user';
    
    return this.fileService.updateFile(fileId, updateFileDto, userId);
  }

  @Delete(':fileId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteFile(@Param('fileId') fileId: string, @Req() req: any): Promise<void> {
    const user = req.user;
    const userId = user?.userId || user?.id || 'system-user';
    
    return this.fileService.deleteFile(fileId, userId);
  }

  @Get('stats/summary')
  async getFileStats(@Query('leadId') leadId?: string) {
    return this.fileService.getFileStats(leadId);
  }
}
