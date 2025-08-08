import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrganization, ITelecaller } from './organization.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel('Organization') private readonly orgModel: Model<IOrganization>,
  ) {}

  async createOrganization(data: Partial<IOrganization>): Promise<IOrganization> {
    const org = new this.orgModel(data);
    return org.save();
  }

  async getAllOrganizations(): Promise<IOrganization[]> {
    return this.orgModel.find().exec();
  }

  async getOrganizationById(id: string): Promise<IOrganization | null> {
    return this.orgModel.findById(id).exec();
  }

  async updateOrganization(id: string, update: Partial<IOrganization>): Promise<IOrganization | null> {
    return this.orgModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async deleteOrganization(id: string): Promise<{ deleted: boolean }> {
    const res = await this.orgModel.deleteOne({ _id: id }).exec();
    return { deleted: res.deletedCount === 1 };
  }

  async patchTelecallers(id: string, telecallers: ITelecaller[]): Promise<IOrganization | null> {
    return this.orgModel.findByIdAndUpdate(id, { telecallers }, { new: true }).exec();
  }

  async getTelecallers(id: string): Promise<ITelecaller[] | null> {
    const org = await this.orgModel.findById(id, 'telecallers').exec();
    return org ? org.telecallers : null;
  }
}
