import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Telecaller, TelecallerDocument } from './schema/telecaller.schema';
import { TelecallerDto } from './DTO/telecaller.dto';

@Injectable()
export class TelecallerService {
  constructor(
    @InjectModel(Telecaller.name)
    private telecallerModel: Model<TelecallerDocument>,
  ) {}

  async findAll(): Promise<Telecaller[]> {
    return this.telecallerModel.find().exec();
  }

  async findById(id: string): Promise<Telecaller> {
    const telecaller = await this.telecallerModel.findById(id).exec();
    if (!telecaller)
      throw new NotFoundException(`Telecaller with ID ${id} not found`);
    return telecaller;
  }
  async create(telecallerDto: TelecallerDto): Promise<Telecaller> {
    const existing = await this.telecallerModel
      .findOne({
        $or: [{ email: telecallerDto.email }, { phone: telecallerDto.phone }],
      })
      .exec();
    if (existing)
      throw new ConflictException(
        'Telecaller with this email or phone already exists',
      );
    const newTelecaller = new this.telecallerModel(telecallerDto);
    return newTelecaller.save();
  }

  async update(
    id: string,
    telecallerDto: Partial<TelecallerDto>,
  ): Promise<Telecaller> {
    if (telecallerDto.email || telecallerDto.phone) {
      const existing = await this.telecallerModel
        .findOne({
          _id: { $ne: id },
          $or: [{ email: telecallerDto.email }, { phone: telecallerDto.phone }],
        })
        .exec();
      if (existing)
        throw new ConflictException(
          'Email or phone already in use by another telecaller',
        );
    }
    const updated = await this.telecallerModel
      .findByIdAndUpdate(id, telecallerDto, { new: true })
      .exec();
    if (!updated)
      throw new NotFoundException(`Telecaller with ID ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<Telecaller> {
    const deleted = await this.telecallerModel.findByIdAndDelete(id).exec();
    if (!deleted)
      throw new NotFoundException(`Telecaller with ID ${id} not found`);
    return deleted;
  }

  async getAssignedLeads(id: string): Promise<string[]> {
    const telecaller = await this.findById(id);
    return telecaller.assignedLeads;
  }

  async getDailySummary(id: string): Promise<any> {
    const telecaller = await this.findById(id);
    return {
      telecallerId: id,
      telecallerName: telecaller.name,
      dailyStats: { callsMade: 0, leadsContacted: 0, successRate: '0%' },
      targetCompletion: {
        dailyCallTarget: telecaller.performanceMetrics?.dailyCallTarget ?? 0,
        completionPercentage: '0%',
      },
    };
  }

  async assignLead(leadId: string, telecallerId: string): Promise<Telecaller> {
    const telecaller = await this.findById(telecallerId);
    if (telecaller.assignedLeads.includes(leadId)) {
      throw new ConflictException(
        `Lead ${leadId} is already assigned to this telecaller`,
      );
    }
    const updatedTelecaller = await this.telecallerModel
      .findByIdAndUpdate(
        telecallerId,
        { $push: { assignedLeads: leadId } },
        { new: true },
      )
      .exec();
    if (!updatedTelecaller)
      throw new NotFoundException(
        `Telecaller with ID ${telecallerId} not found`,
      );
    return updatedTelecaller;
  }

  async findAvailableTelecallers(): Promise<Telecaller[]> {
    const telecallers = await this.telecallerModel.find().exec();
    return telecallers.sort(
      (a, b) => (a.assignedLeads?.length || 0) - (b.assignedLeads?.length || 0),
    );
  }

  getCapacity(telecaller: Telecaller): number {
    const currentLeadCount = telecaller.assignedLeads?.length || 0;
    const dailyTarget = telecaller.performanceMetrics?.dailyCallTarget || 0;
    if (dailyTarget === 0) return Number.MAX_SAFE_INTEGER;
    return Math.max(0, dailyTarget - currentLeadCount);
  }

  async smartAssignLeads(leadIds: string[]): Promise<any> {
    const availableTelecallers = await this.findAvailableTelecallers();
    if (!availableTelecallers.length)
      throw new ConflictException('No telecallers available for assignment');

    const assignments: Record<string, string[]> = {};
    const activeTelecallers: Array<{
      telecaller: TelecallerDocument;
      capacity: number;
      assignedLeads: string[];
    }> = availableTelecallers
      .map((tc) => ({
        telecaller: tc as TelecallerDocument,
        capacity: this.getCapacity(tc),
        assignedLeads: [...(tc.assignedLeads || [])],
      }))
      .filter((t) => t.capacity > 0);

    if (!activeTelecallers.length)
      throw new ConflictException('All telecallers are at capacity');

    for (const leadId of leadIds) {
      activeTelecallers.sort(
        (a, b) => a.assignedLeads.length - b.assignedLeads.length,
      );
      const target = activeTelecallers[0];
      if (target.capacity <= 0) continue;
      target.assignedLeads.push(leadId);
      target.capacity--;
      const telecallerId = (target.telecaller._id as any).toString();
      if (!assignments[telecallerId]) assignments[telecallerId] = [];
      assignments[telecallerId].push(leadId);
    }

    const results: {
      telecallerId: string;
      name: string;
      assignedLeads: string[];
      totalLeads: number;
      capacity: number;
    }[] = [];
    for (const [telecallerId, assignedLeadIds] of Object.entries(assignments)) {
      if (assignedLeadIds.length > 0) {
        const telecaller = await this.telecallerModel
          .findById(telecallerId)
          .exec();
        const updatedLeads = [
          ...(telecaller?.assignedLeads || []),
          ...assignedLeadIds,
        ];
        const updated = await this.telecallerModel
          .findByIdAndUpdate(
            telecallerId,
            { assignedLeads: updatedLeads },
            { new: true },
          )
          .exec();
        if (updated) {
          results.push({
            telecallerId,
            name: updated.name,
            assignedLeads: assignedLeadIds,
            totalLeads: updated.assignedLeads.length,
            capacity: this.getCapacity(updated),
          });
        }
      }
    }

    return {
      success: true,
      message: `Assigned ${leadIds.length} leads to ${results.length} telecallers`,
      assignments: results,
    };
  }
}
