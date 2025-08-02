import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthMicroserviceController } from './auth.microservice.controller';
import { AuthService } from './auth.service';
import { Auth, AuthSchema } from './Schema/auth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    JwtModule.register({
      secret: 'your_jwt_secret', 
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController, AuthMicroserviceController],
  providers: [AuthService],
})
export class AuthModule {}
