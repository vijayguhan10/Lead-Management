import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, GetObjectCommand, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME') || 'acs-lead-management-files';
    
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const region = this.configService.get<string>('AWS_REGION') || 'us-east-1';
    
    this.s3Client = new S3Client({
      region,
      credentials: accessKeyId && secretAccessKey ? {
        accessKeyId,
        secretAccessKey,
      } : undefined,
    });
  }

  async generatePresignedUploadUrl(fileName: string, fileType: string, leadId: string, organizationId: string): Promise<{
    uploadUrl: string;
    key: string;
    bucket: string;
  }> {
    try {
      // Generate unique key for the file with organization-id/lead-id structure
      const fileExtension = fileName.split('.').pop();
      const uniqueFileName = `${uuidv4()}.${fileExtension}`;
      const key = `${organizationId}/${leadId}/${uniqueFileName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: fileType,
        Metadata: {
          'original-name': fileName,
          'lead-id': leadId,
          'organization-id': organizationId,
          'uploaded-at': new Date().toISOString(),
        },
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, { 
        expiresIn: 3600
      }); // 1 hour expiry

      this.logger.log(`Generated presigned upload URL for file: ${fileName}, key: ${key}`);

      return {
        uploadUrl,
        key,
        bucket: this.bucketName,
      };
    } catch (error) {
      this.logger.error(`Failed to generate presigned upload URL: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to generate upload URL');
    }
  }

  async generatePresignedDownloadUrl(key: string, originalFileName?: string): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ResponseContentDisposition: originalFileName 
          ? `attachment; filename="${originalFileName}"`
          : 'attachment',
      });

      const downloadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // 1 hour expiry

      this.logger.log(`Generated presigned download URL for key: ${key}`);
      return downloadUrl;
    } catch (error) {
      this.logger.error(`Failed to generate presigned download URL: ${error.message}`, error.stack);
      throw new NotFoundException('File not found or access denied');
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      this.logger.log(`Successfully deleted file with key: ${key}`);
    } catch (error) {
      this.logger.error(`Failed to delete file: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to delete file from storage');
    }
  }

  async getFileInfo(key: string): Promise<{
    size: number;
    lastModified: Date;
    contentType: string;
  }> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.s3Client.send(command);
      
      return {
        size: response.ContentLength || 0,
        lastModified: response.LastModified || new Date(),
        contentType: response.ContentType || 'application/octet-stream',
      };
    } catch (error) {
      this.logger.error(`Failed to get file info: ${error.message}`, error.stack);
      throw new NotFoundException('File not found');
    }
  }
}
