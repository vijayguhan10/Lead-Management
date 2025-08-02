import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TelecallerController } from './telecaller.controller';
import { TelecallerMicroserviceController } from './telecaller.microservice.controller';
import { TelecallerService } from './telecaller.service';
import { Telecaller, TelecallerSchema } from './schema/telecaller.schema';
import { AuthClient } from '../auth/auth.client';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Telecaller.name, schema: TelecallerSchema },
    ]),
  ],
  controllers: [TelecallerController, TelecallerMicroserviceController],
  providers: [TelecallerService, AuthClient],
})
export class TelecallerModule {}
