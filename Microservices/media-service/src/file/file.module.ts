import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { FileController } from './controllers/file.controller';
import { FileService } from './services/file.service';
import { S3Service } from './services/s3.service';
import { File, FileSchema } from './schemas/file.schema';
import { AuthClient } from '../auth/auth.client';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { TelecallerOrAdminGuard, AdminAccessRoleGuard } from '../auth/role.guard';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  controllers: [FileController],
  providers: [
    FileService, 
    S3Service, 
    AuthClient, 
    JwtAuthGuard, 
    TelecallerOrAdminGuard, 
    AdminAccessRoleGuard
  ],
  exports: [FileService, S3Service],
})
export class FileModule {}
