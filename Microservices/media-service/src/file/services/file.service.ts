import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from '../schemas/file.schema';
import { UpdateFileDto, GetSignedUrlDto } from '../dto/file.dto';
import { S3Service } from './s3.service';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<FileDocument>,
    private readonly s3Service: S3Service,
  ) {}

  async generateUploadUrl(getSignedUrlDto: GetSignedUrlDto, userId: string): Promise<{
    uploadUrl: string;
    key: string;
    bucket: string;
    fileId: string;
  }> {
    try {
      const { uploadUrl, key, bucket } = await this.s3Service.generatePresignedUploadUrl(
        getSignedUrlDto.fileName,
        getSignedUrlDto.fileType,
        getSignedUrlDto.leadId,
        getSignedUrlDto.organizationId,
      );

      // Pre-create file record (will be updated when upload is confirmed)
      const file = new this.fileModel({
        fileName: key,
        originalName: getSignedUrlDto.fileName,
        mimeType: getSignedUrlDto.fileType,
        size: 0, // Will be updated later
        leadId: getSignedUrlDto.leadId,
        organizationId: getSignedUrlDto.organizationId,
        uploadedBy: userId,
        s3Key: key,
        s3Bucket: bucket,
        isActive: false, // Will be activated when upload is confirmed
      });

      const savedFile = await file.save();

      this.logger.log(`Generated upload URL for file: ${getSignedUrlDto.fileName}, leadId: ${getSignedUrlDto.leadId}`);

      return {
        uploadUrl,
        key,
        bucket,
        fileId: String(savedFile._id),
      };
    } catch (error) {
      this.logger.error(`Failed to generate upload URL: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to generate upload URL');
    }
  }

  async confirmUpload(fileId: string, userId: string): Promise<FileDocument> {
    try {
      const file = await this.fileModel.findById(fileId);
      
      if (!file) {
        throw new NotFoundException('File record not found');
      }

      if (file.uploadedBy !== userId) {
        throw new ForbiddenException('Not authorized to confirm this upload');
      }

      // Get file info from S3 to update size and other metadata
      const fileInfo = await this.s3Service.getFileInfo(file.s3Key);
      
      file.size = fileInfo.size;
      file.isActive = true;
      
      const updatedFile = await file.save();
      
      this.logger.log(`Upload confirmed for file: ${file.originalName}, size: ${fileInfo.size}`);
      
      return updatedFile;
    } catch (error) {
      this.logger.error(`Failed to confirm upload: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getFilesByLead(leadId: string): Promise<FileDocument[]> {
    try {
      const files = await this.fileModel
        .find({ leadId, isActive: true })
        .sort({ createdAt: -1 })
        .exec();

      this.logger.log(`Retrieved ${files.length} files for lead: ${leadId}`);
      return files;
    } catch (error) {
      this.logger.error(`Failed to get files for lead: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve files');
    }
  }

  async getFileById(fileId: string): Promise<FileDocument> {
    try {
      const file = await this.fileModel.findById(fileId).exec();
      
      if (!file) {
        throw new NotFoundException('File not found');
      }

      return file;
    } catch (error) {
      this.logger.error(`Failed to get file by ID: ${error.message}`, error.stack);
      throw error;
    }
  }

  async generateDownloadUrl(fileId: string, userId: string): Promise<{ downloadUrl: string; fileName: string }> {
    try {
      const file = await this.getFileById(fileId);
      
      if (!file.isActive) {
        throw new NotFoundException('File not available');
      }

      const downloadUrl = await this.s3Service.generatePresignedDownloadUrl(file.s3Key, file.originalName);
      
      this.logger.log(`Generated download URL for file: ${file.originalName}, user: ${userId}`);
      
      return {
        downloadUrl,
        fileName: file.originalName,
      };
    } catch (error) {
      this.logger.error(`Failed to generate download URL: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateFile(fileId: string, updateFileDto: UpdateFileDto, userId: string): Promise<FileDocument> {
    try {
      const file = await this.getFileById(fileId);
      
      if (file.uploadedBy !== userId) {
        throw new ForbiddenException('Not authorized to update this file');
      }

      Object.assign(file, updateFileDto);
      const updatedFile = await file.save();
      
      this.logger.log(`Updated file: ${file.originalName}, user: ${userId}`);
      
      return updatedFile;
    } catch (error) {
      this.logger.error(`Failed to update file: ${error.message}`, error.stack);
      throw error;
    }
  }

  async deleteFile(fileId: string, userId: string): Promise<void> {
    try {
      const file = await this.getFileById(fileId);
      
      if (file.uploadedBy !== userId) {
        throw new ForbiddenException('Not authorized to delete this file');
      }

      // Delete from S3
      await this.s3Service.deleteFile(file.s3Key);
      
      // Soft delete from database
      file.isActive = false;
      await file.save();
      
      // Or hard delete if preferred
      // await this.fileModel.findByIdAndDelete(fileId);
      
      this.logger.log(`Deleted file: ${file.originalName}, user: ${userId}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getFileStats(leadId?: string): Promise<{
    totalFiles: number;
    totalSize: number;
    filesByType: Record<string, number>;
  }> {
    try {
      const query = leadId ? { leadId, isActive: true } : { isActive: true };
      const files = await this.fileModel.find(query).exec();
      
      const totalFiles = files.length;
      const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
      
      const filesByType = files.reduce((acc, file) => {
        const type = file.mimeType.split('/')[0] || 'other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        totalFiles,
        totalSize,
        filesByType,
      };
    } catch (error) {
      this.logger.error(`Failed to get file stats: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to retrieve file statistics');
    }
  }
}
