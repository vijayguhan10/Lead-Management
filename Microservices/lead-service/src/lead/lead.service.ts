import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Lead, LeadDocument, LeadStatus } from './schema/lead.schema';
import { LeadDto } from './dto/lead.dto';
import { TelecallerClient } from '../telecaller/telecaller.client';

@Injectable()
export class LeadService {
  constructor(
    @InjectModel(Lead.name) private readonly leadModel: Model<LeadDocument>,
    private readonly telecallerClient: TelecallerClient,
  ) {}

  // Create a new lead
  async create(leadDto: LeadDto): Promise<Lead> {
    // Check if lead with this phone already exists
    const existingLead = await this.leadModel
      .findOne({ phone: leadDto.phone })
      .exec();
    if (existingLead) {
      throw new ConflictException(
        `Lead with phone ${leadDto.phone} already exists`,
      );
    }
    
    const createdLead = new this.leadModel(leadDto);
    return createdLead.save();
  }

  async findAllOrganizationLeads(query: any = {}, param: any = {}): Promise<Lead[]> {
    const { status, priority, assignedTo, source, createdAt, tags } = query;
    const organizationId = param.organizationId;
    const filter: any = {};

    filter.organizationId = new Types.ObjectId(organizationId);
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (source) filter.source = source;
    if (tags) filter.tags = { $in: Array.isArray(tags) ? tags : [tags] };

    if (createdAt) {
      const { startDate, endDate } = createdAt;
      if (startDate && endDate) {
        filter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }
    }

    return this.leadModel.find(filter).exec();
  }

  // Get a single lead by ID
  async findById(id: string): Promise<Lead> {
    const lead = await this.leadModel.findById(id).exec();
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return lead;
  }

  // Get leads by phone number
  async findByPhone(phone: string): Promise<Lead[]> {
    return this.leadModel.find({ phone }).exec();
  }

  // Update a lead
  async update(id: string, leadDto: Partial<LeadDto>): Promise<Lead> {
    const updatedLead = await this.leadModel
      .findByIdAndUpdate(id, leadDto, { new: true })
      .exec();

    if (!updatedLead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    return updatedLead;
  }

  // Delete a lead
  async remove(id: string): Promise<Lead> {
    const deletedLead = await this.leadModel.findByIdAndDelete(id).exec();
    if (!deletedLead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return deletedLead;
  }

  // Update lead status
  async updateStatus(id: string, status: LeadStatus): Promise<Lead> {
    const lead = await this.leadModel.findById(id).exec();
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    lead.status = status;

    // If converting lead, set conversion date
    if (status === LeadStatus.Converted) {
      lead.lastContacted = new Date();
    }

    return lead.save();
  }

  // Assign lead to telecaller
  async assignLead(id: string, telecallerId: string): Promise<Lead> {
    // First, validate that the lead exists
    const lead = await this.leadModel.findById(id).exec();
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    // Then, validate that the telecaller exists via the microservice
    const telecallerResult =
      await this.telecallerClient.validateTelecaller(telecallerId);
    if (!telecallerResult.isValid) {
      throw new NotFoundException(
        `Telecaller with ID ${telecallerId} not found`,
      );
    }

    // Assign the lead in both services
    lead.assignedTo = telecallerId;

    // Update the telecaller's assigned leads via the microservice
    const assignResult = await this.telecallerClient.assignLead(
      id,
      telecallerId,
    );
    if (!assignResult.success) {
      throw new ConflictException(
        `Failed to assign lead to telecaller: ${assignResult.error}`,
      );
    }

    return lead.save();
  }

  // Smart bulk assign leads
  async smartBulkAssign(leadIds: string[]): Promise<any> {
    try {
      // Validate that all leads exist
      const leads = await this.leadModel.find({ _id: { $in: leadIds } }).exec();

      if (leads.length !== leadIds.length) {
        throw new NotFoundException('One or more leads not found');
      }

      // Use the telecaller service to perform smart assignment
      const result = await this.telecallerClient.smartAssignLeads(leadIds);

      if (!result || !result.success) {
        throw new ConflictException(
          `Failed to assign leads: ${result?.error || 'Unknown error'}`,
        );
      }

      // Update lead assignments in our database
      let updatedCount = 0;

      for (const assignment of result.assignments || []) {
        const telecallerId = assignment.telecallerId;
        const assignedLeadIds = assignment.assignedLeads || [];

        // Bulk update all leads assigned to this telecaller
        if (assignedLeadIds.length > 0) {
          const updateResult = await this.leadModel
            .updateMany(
              { _id: { $in: assignedLeadIds } },
              { assignedTo: telecallerId },
            )
            .exec();

          updatedCount += updateResult.modifiedCount;
        }
      }

      return {
        ...result,
        updatedLeads: updatedCount,
      };
    } catch (error) {
      console.error('Error in smartBulkAssign:', error);
      throw error;
    }
  }

  // Schedule next follow-up
  async scheduleFollowUp(id: string, followUpDate: Date): Promise<Lead> {
    const lead = await this.leadModel.findById(id).exec();
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    if (new Date(followUpDate) < new Date()) {
      throw new BadRequestException('Follow-up date cannot be in the past');
    }

    // Fix: Assign followUpDate to nextFollowUp property
    lead.nextFollowUp = followUpDate;
    console.log(
      'Scheduling follow-up for lead:',
      lead._id,
      'on',
      lead.nextFollowUp,
    );
    return lead.save();
  }

  // Add tags to lead
  async addTags(id: string, tags: string[]): Promise<Lead> {
    const lead = await this.leadModel.findById(id).exec();
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    // Ensure no duplicates
    const uniqueTags = [...new Set([...(lead.tags || []), ...tags])];
    lead.tags = uniqueTags;

    return lead.save();
  }

  // Remove tags from lead
  async removeTags(id: string, tags: string[]): Promise<Lead> {
    const lead = await this.leadModel.findById(id).exec();
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    lead.tags = (lead.tags || []).filter((tag) => !tags.includes(tag));
    return lead.save();
  }

  // Get leads assigned to a specific telecaller
  async getLeadsByTelecaller(telecallerId: string): Promise<Lead[]> {
    return this.leadModel.find({ assignedTo: telecallerId }).exec();
  }

  // Get leads by status
  async getLeadsByStatus(status: LeadStatus): Promise<Lead[]> {
    return this.leadModel.find({ status }).exec();
  }

  // Get leads that need follow-up today
  async getFollowUpsForToday(): Promise<Lead[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.leadModel
      .find({
        nextFollowUp: {
          $gte: today,
          $lt: tomorrow,
        },
      })
      .exec();
  }

  async updateNotes(id: string, notes: string): Promise<Lead> {
    const updatedLead = await this.leadModel
      .findByIdAndUpdate(id, { notes }, { new: true })
      .exec();
    if (!updatedLead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return updatedLead;
  }
}
