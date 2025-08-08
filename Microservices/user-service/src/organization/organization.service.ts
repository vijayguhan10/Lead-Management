import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IOrganization, ITelecaller } from './organization.schema';
import { AuthClient } from '../auth/auth.client';
import { TelecallerClient } from '../telecaller/telecaller.client';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel('Organization') private readonly orgModel: Model<IOrganization>,
    private readonly authClient: AuthClient,
    private readonly telecallerClient: TelecallerClient,
  ) {}

  async createOrganization(data: Partial<IOrganization>): Promise<IOrganization> {
    const org = new this.orgModel(data);
    const savedOrg = await org.save();
    // Ensure savedOrg._id is treated as a string for downstream usage
    const orgId = (savedOrg._id as any).toString();

    // Create admin user in auth-service
    const adminUser = {
      email: data.admin?.email,
      password: '1234',
      isActive: true,
      phoneNumber: data.admin?.phone,
      username: data.admin?.name,
      role: 'admin',
      organizationId: orgId,
    };
    await this.authClient.createUser(adminUser);

    // Create organization user in auth-service (organization login)
    const orgUser = {
      email: `${data.orgName?.toLowerCase().replace(/\s+/g, '')}@org.com`,
      password: '1234',
      isActive: true,
      username: data.orgName,
      role: 'admin',
      organizationId: orgId,
    };
    await this.authClient.createUser(orgUser);

    // Create telecaller users and telecaller records
    if (Array.isArray(data.telecallers)) {
      for (const tc of data.telecallers) {
        // Create user in auth-service
        const telecallerUser = {
          email: tc.email,
          password: '1234',
          isActive: true,
          phoneNumber: tc.phone,
          username: tc.name,
          role: 'telecaller',
          organizationId: orgId,
        };
        const createdUser = await this.authClient.createUser(telecallerUser);

        // Create telecaller in telecaller-service
        const telecallerDoc = {
          userId: createdUser?._id || '',
          name: tc.name,
          phone: tc.phone,
          email: tc.email,
          assignedLeads: [],
          performanceMetrics: {},
          organizationId: orgId,
        };
        await this.telecallerClient.createTelecaller(telecallerDoc);
      }
    }

    return savedOrg;
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
