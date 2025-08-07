import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrganization } from './organization.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel('Organization') private readonly orgModel: Model<IOrganization>,
  ) {}

  async createOrganization(data: Partial<IOrganization>): Promise<IOrganization> {
    const org = new this.orgModel(data);
    return org.save();
  }

  // Add more methods as needed (e.g., get, update, delete)
}
