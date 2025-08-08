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
    // Create organization without telecallers first
    const orgData = { ...data };
    delete orgData.telecallers; // Remove telecallers for initial save
    const org = new this.orgModel(orgData);
    const savedOrg = await org.save();
    const orgId = (savedOrg._id as any).toString();

    await this.createAdminUsers(data, orgId);
    await this.createTelecallersForOrg(data.telecallers, orgId, savedOrg);
    return savedOrg;
  }

  private async createAdminUsers(data: Partial<IOrganization>, orgId: string) {
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
  }

  private async createTelecallersForOrg(telecallers: ITelecaller[] | undefined, orgId: string, savedOrg: IOrganization) {
    if (!Array.isArray(telecallers)) return;
    const updatedTelecallers: ITelecaller[] = [];
    for (const tc of telecallers) {
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
      const userId = createdUser?.user?.user?._id || '';

      // Create telecaller in telecaller-service
      const telecallerDoc: any = {
        userId,
        name: tc.name,
        phone: tc.phone,
        email: tc.email,
        assignedLeads: [],
        organizationId: orgId,
      };
      if (tc.performanceMetrics && (tc.performanceMetrics.dailyCallTarget !== undefined || tc.performanceMetrics.monthlyLeadGoal !== undefined)) {
        telecallerDoc.performanceMetrics = tc.performanceMetrics;
      }
      await this.telecallerClient.createTelecaller(telecallerDoc);

      // Update the telecaller in organization with userId as _id
      updatedTelecallers.push({
        userId,
        name: tc.name,
        email: tc.email,
        phone: tc.phone,
        status: tc.status || 'available',
        ...(tc.performanceMetrics && { performanceMetrics: tc.performanceMetrics })
      } as ITelecaller);
    }
    // Update the saved organization with telecallers having userId as _id
    savedOrg.telecallers = updatedTelecallers;
    await (savedOrg as any).save();
  }

  async getAllOrganizations(): Promise<IOrganization[]> {
    return this.orgModel.find({ deleted: { $ne: true } }).exec();
  }

  async getOrganizationById(id: string): Promise<IOrganization | null> {
    const org = await this.orgModel.findById(id).exec();
    if (!org || org.deleted) return null;
    return org;
  }

  async updateOrganization(id: string, update: Partial<IOrganization>): Promise<IOrganization | null> {
    const org = await this.orgModel.findById(id).exec();
    if (!org || org.deleted) return null;
    return this.orgModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async deleteOrganization(id: string): Promise<{ deleted: boolean }> {
    const res = await this.orgModel.findByIdAndUpdate(id, { deleted: true }, { new: true }).exec();
    return { deleted: !!res };
  }

  async patchTelecallers(id: string, telecallers: ITelecaller[]): Promise<IOrganization | null> {
    const org = await this.orgModel.findById(id).exec();
    if (!org || org.deleted) return null;
    return this.orgModel.findByIdAndUpdate(id, { telecallers }, { new: true }).exec();
  }

  async getTelecallers(id: string): Promise<ITelecaller[] | null> {
    const org = await this.orgModel.findById(id, 'telecallers deleted').exec();
    if (!org || org.deleted) return null;
    return org.telecallers;
  }

  async updateTelecallerStatus(orgId: string, telecallerUserId: string, status: 'available' | 'not available'): Promise<{ updated: boolean }> {
    const org = await this.orgModel.findById(orgId);
    if (!org || org.deleted) return { updated: false };
    const telecaller = org.telecallers.find(tc => tc.userId.toString() === telecallerUserId);
    if (!telecaller) return { updated: false };
    telecaller.status = status;
    await org.save();
    return { updated: true };
  }
}
