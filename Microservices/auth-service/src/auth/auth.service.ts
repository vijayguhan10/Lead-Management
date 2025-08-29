import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth, AuthDocument } from './Schema/auth.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async create(data: Partial<Auth>): Promise<{ user: Auth; token: string }> {
    const existing = await this.authModel.findOne({
      $or: [{ phoneNumber: data.phoneNumber }, { email: data.email }],
    });
    if (existing) throw new ConflictException('User already exists');

    if (!data.password) {
      throw new ConflictException('Password is required');
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    const createdUser = new this.authModel(data);
    const user = await createdUser.save();

    const payload = {
      name: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
    const token = this.jwtService.sign(payload);

    return { user, token };
  }

  async login(
    identifier: string,
    password: string,
  ): Promise<{ token: string; role: string; isActive: boolean; organizationId: string; userId: string }> {
    const user = await this.authModel
      .findOne({
        $or: [{ email: identifier }, { phoneNumber: identifier }],
      })
      .exec();

    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!user.isActive) throw new UnauthorizedException('User is not active');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      name: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      role: user.role,
      isActive: user.isActive,
      organizationId: user.role == "admin" ? user.organizationId || "" : "",
      userId: user._id?.toString() || "",
    };
  }

  async findAll(): Promise<Auth[]> {
    return this.authModel.find().exec();
  }

  async update(id: string, updateData: Partial<Auth>): Promise<Auth | null> {
    return this.authModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async delete(id: string): Promise<Auth | null> {
    return this.authModel.findByIdAndDelete(id).exec();
  }

  async toggleIsActive(id: string): Promise<Auth | null> {
    const user = await this.authModel.findById(id).exec();
    if (!user) return null;
    user.isActive = !user.isActive;
    return user.save();
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.authModel
        .findOne({ email: payload.email })
        .exec();

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return {
        userId: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isActive: user.isActive,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async findById(id: string): Promise<Auth | null> {
    return this.authModel.findById(id).exec();
  }
}
