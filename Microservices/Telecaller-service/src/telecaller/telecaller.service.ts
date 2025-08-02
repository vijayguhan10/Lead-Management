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

  // GET /telecallers/:id - Get telecaller by ID
  async findById(id: string): Promise<Telecaller> {
    const telecaller = await this.telecallerModel.findById(id).exec();
    if (!telecaller) {
      throw new NotFoundException(`Telecaller with ID ${id} not found`);
    }
    return telecaller;
  }

  // POST /telecallers - Create new telecaller
  async create(telecallerDto: TelecallerDto): Promise<Telecaller> {
    // Check if telecaller with same email or phone already exists
    const existing = await this.telecallerModel
      .findOne({
        $or: [{ email: telecallerDto.email }, { phone: telecallerDto.phone }],
      })
      .exec();

    if (existing) {
      throw new ConflictException(
        'Telecaller with this email or phone already exists',
      );
    }

    const newTelecaller = new this.telecallerModel(telecallerDto);
    return newTelecaller.save();
  }

  // PUT /telecallers/:id - Update telecaller details
  async update(
    id: string,
    telecallerDto: Partial<TelecallerDto>,
  ): Promise<Telecaller> {
    // Check if the updated email/phone conflicts with existing records
    if (telecallerDto.email || telecallerDto.phone) {
      const existing = await this.telecallerModel
        .findOne({
          _id: { $ne: id },
          $or: [{ email: telecallerDto.email }, { phone: telecallerDto.phone }],
        })
        .exec();

      if (existing) {
        throw new ConflictException(
          'Email or phone already in use by another telecaller',
        );
      }
    }

    const updated = await this.telecallerModel
      .findByIdAndUpdate(id, telecallerDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Telecaller with ID ${id} not found`);
    }

    return updated;
  }

  // DELETE /telecallers/:id - Delete telecaller
  async remove(id: string): Promise<Telecaller> {
    const deleted = await this.telecallerModel.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException(`Telecaller with ID ${id} not found`);
    }

    return deleted;
  }

  // GET /telecallers/:id/leads - Get leads assigned to a telecaller
  async getAssignedLeads(id: string): Promise<string[]> {
    const telecaller = await this.findById(id);
    return telecaller.assignedLeads;
  }

  // GET /telecallers/:id/summary - Daily summary
  async getDailySummary(id: string): Promise<any> {
    const telecaller = await this.findById(id);

    return {
      telecallerId: id,
      telecallerName: telecaller.name,
      dailyStats: {
        callsMade: 0, // Would come from call service
        leadsContacted: 0, // Would come from activity tracking
        successRate: '0%', // Calculated metric
      },
      targetCompletion: {
        dailyCallTarget: telecaller.performanceMetrics.dailyCallTarget,
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

    if (!updatedTelecaller) {
      throw new NotFoundException(
        `Telecaller with ID ${telecallerId} not found`,
      );
    }

    return updatedTelecaller;
  }
}
