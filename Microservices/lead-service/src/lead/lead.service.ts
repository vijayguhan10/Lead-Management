import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  // Find leads with upcoming follow-ups within a time range
  async findLeadsWithUpcomingFollowUps(startTime: Date, endTime: Date): Promise<Lead[]> {
    return this.leadModel
      .find({
        nextFollowUp: {
          $gte: startTime,
          $lte: endTime,
        },
        assignedTo: { $exists: true, $ne: null },
      })
      .exec();
  }

  async findAllOrganizationLeads(query: any = {}, param: any = {}): Promise<Lead[]> {
    const { status, priority, assignedTo, source, createdAt, tags } = query;
    const organizationId = param.organizationId;
    const filter: any = {};

    if (organizationId) filter.organizationId = organizationId;
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
    // Get the current lead to check for status changes
    const currentLead = await this.leadModel.findById(id).exec();
    if (!currentLead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }

    // Automatically set timestamps based on status changes
    const updateData: any = { ...leadDto };
    
    // Track status changes with appropriate timestamps
    if (leadDto.status && currentLead.status !== leadDto.status) {
      const now = new Date();
      
      switch (leadDto.status) {
        case LeadStatus.Contacted:
          updateData.contactedAt = now;
          updateData.lastContacted = now;
          break;
        case LeadStatus.Qualified:
          updateData.qualifiedAt = now;
          break;
        case LeadStatus.Converted:
          updateData.convertedAt = now;
          updateData.lastContacted = now;
          break;
        case LeadStatus.Dropped:
          updateData.droppedAt = now;
          break;
      }
    }

    const updatedLead = await this.leadModel
      .findByIdAndUpdate(id, updateData, { new: true })
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

    const now = new Date();
    lead.status = status;

    // Set appropriate timestamp based on status
    switch (status) {
      case LeadStatus.Contacted:
        lead.contactedAt = now;
        lead.lastContacted = now;
        break;
      case LeadStatus.Qualified:
        lead.qualifiedAt = now;
        break;
      case LeadStatus.Converted:
        lead.convertedAt = now;
        lead.lastContacted = now;
        break;
      case LeadStatus.Dropped:
        lead.droppedAt = now;
        break;
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
    lead.assignedAt = new Date();

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
  async smartBulkAssign(leadIds: string[], organizationId?: string): Promise<any> {
    try {
      // Validate that all leads exist
      const leads = await this.leadModel.find({ _id: { $in: leadIds } }).exec();

      if (leads.length !== leadIds.length) {
        throw new NotFoundException('One or more leads not found');
      }

  // Use the telecaller service to perform smart assignment (filtered by organization)
  const result = await this.telecallerClient.smartAssignLeads(leadIds, { organizationId });

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

  async updateNotesTagsInterested(
    id: string,
    notes: string,
    tags: string[],
    interestedIn: string[],
    nextFollowUp?: Date | string,
    lastContacted?: Date | string,
  ): Promise<Lead> {
    const update: any = {};
    if (typeof notes === 'string') update.notes = notes;
    if (Array.isArray(tags)) update.tags = tags;
    if (Array.isArray(interestedIn)) update.interestedIn = interestedIn;
    if (nextFollowUp) {
      const dt = nextFollowUp instanceof Date ? nextFollowUp : new Date(nextFollowUp);
      if (isNaN(dt.getTime())) {
        throw new BadRequestException('Invalid nextFollowUp datetime');
      }
      update.nextFollowUp = dt;
    }
    if (lastContacted) {
      const lc = lastContacted instanceof Date ? lastContacted : new Date(lastContacted);
      if (isNaN(lc.getTime())) {
        throw new BadRequestException('Invalid lastContacted date');
      }
      update.lastContacted = lc;
    }
    const updatedLead = await this.leadModel
      .findByIdAndUpdate(id, update, { new: true })
      .exec();
    if (!updatedLead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return updatedLead;
  }

  // Export leads to XLSX buffer. Optionally filter by organizationId or query filters.
  async exportLeads(filters: any = {}): Promise<Buffer> {
    // Build filter similar to findAllOrganizationLeads
    const queryFilter: any = {};
    if (filters.organizationId) {
      queryFilter.organizationId = filters.organizationId;
    }
    // apply optional status/priority/assignedTo/source/tags filters
    if (filters.status) queryFilter.status = filters.status;
    if (filters.priority) queryFilter.priority = filters.priority;
    if (filters.assignedTo) queryFilter.assignedTo = filters.assignedTo;
    if (filters.source) queryFilter.source = filters.source;
    if (filters.tags) queryFilter.tags = { $in: Array.isArray(filters.tags) ? filters.tags : [filters.tags] };

    const leads = await this.leadModel.find(queryFilter).lean().exec();

    // Build rows
    const rows = leads.map((l: any) => ({
      _id: l._id?.toString(),
      name: l.name || '',
      phone: l.phone || '',
      email: l.email || '',
      source: l.source || '',
      priority: l.priority || '',
      status: l.status || '',
      assignedTo: l.assignedTo ? (l.assignedTo.name || l.assignedTo.toString()) : '',
      lastContacted: l.lastContacted ? new Date(l.lastContacted).toISOString() : '',
      nextFollowUp: l.nextFollowUp ? new Date(l.nextFollowUp).toISOString() : '',
      interestedIn: Array.isArray(l.interestedIn) ? l.interestedIn.join('; ') : (l.interestedIn || ''),
      tags: Array.isArray(l.tags) ? l.tags.join('; ') : (l.tags || ''),
      notes: l.notes || '',
      company: l.company || '',
      position: l.position || '',
      industry: l.industry || '',
      location: l.location || '',
      pincode: l.pincode || '',
      conversionScore: l.conversionScore || '',
      createdBy: l.createdBy || '',
      organizationId: l.organizationId ? l.organizationId.toString() : '',
    }));

    // Generate XLSX via xlsx package
    // Use require to avoid import overhead
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const XLSX = require('xlsx');
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Leads');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return buffer;
  }

  // Generate a sample XLSX file for imports (header row + example row)
  async generateImportSample(): Promise<Buffer> {
    const XLSX = require('xlsx');
    const sampleRows = [
      {
        name: 'John Doe',
        phone: '9999999999',
        email: 'john.doe@example.com',
        source: 'Website',
        priority: 'Medium',
        status: 'New',
        assignedTo: '',
        lastContacted: '',
        nextFollowUp: '',
        interestedIn: 'Product A',
        tags: 'lead,import',
        notes: 'Imported sample',
        company: 'Example Co',
        position: 'Manager',
        industry: 'Software',
        location: 'Chennai',
        pincode: '600001',
        conversionScore: '0',
        createdBy: '',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(sampleRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SampleLeads');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return buffer;
  }

  // Import leads from a base64-encoded XLSX. Returns summary of created/updated records.
  async importLeadsFromBase64(fileBase64: string, organizationId: string, createdBy?: string): Promise<{ created: number; updated: number; errors: string[] }> {
    const result = { created: 0, updated: 0, errors: [] as string[] };
    if (!fileBase64) {
      throw new BadRequestException('No file content provided');
    }

    // Decode base64 to buffer
    const buffer = Buffer.from(fileBase64, 'base64');

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const XLSX = require('xlsx');
    let wb       ;
    try {
      wb = XLSX.read(buffer, { type: 'buffer' });
    } catch (err) {
        throw new BadRequestException('Invalid XLSX file: ' + (err?.message || String(err)));
    }

    const sheetName = wb.SheetNames[0];
    const ws = wb.Sheets[sheetName];
    if (!ws) {
      throw new BadRequestException('No sheet found in XLSX');
    }

    const rows: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

    for (const [idx, row] of rows.entries()) {
      try {
        const phone = (row.phone || row.Phone || '').toString().trim();
        if (!phone) {
          result.errors.push(`Row ${idx + 2}: missing phone`);
          continue;
        }

        // Normalize lead data
        const leadData: any = {
          name: row.name || row.Name || '',
          phone,
          email: row.email || row.Email || '',
          source: row.source || row.Source || '',
          priority: row.priority || row.Priority || '',
          status: row.status || row.Status || '',
          assignedTo: row.assignedTo || row.AssignedTo || undefined,
          lastContacted: row.lastContacted || row.LastContacted || undefined,
          nextFollowUp: row.nextFollowUp || row.NextFollowUp || undefined,
          interestedIn: row.interestedIn || row.InterestedIn || undefined,
          tags: row.tags || row.Tags || undefined,
          notes: row.notes || row.Notes || undefined,
          company: row.company || row.Company || undefined,
          position: row.position || row.Position || undefined,
          industry: row.industry || row.Industry || undefined,
          location: row.location || row.Location || undefined,
          pincode: row.pincode || row.Pincode || undefined,
          conversionScore: row.conversionScore || row.ConversionScore || undefined,
          createdBy: createdBy || (row.createdBy || row.CreatedBy || undefined),
        };

        // Attach organizationId when creating/updating
          if (organizationId) leadData.organizationId = organizationId;

        // Try to find existing lead by phone + organization
        const existing = await this.leadModel.findOne({ phone, organizationId: leadData.organizationId }).exec();
        if (existing) {
          // Update fields that are provided
          Object.keys(leadData).forEach((k) => {
            if (leadData[k] !== undefined && k !== 'organizationId') existing[k] = leadData[k];
          });
          await existing.save();
          result.updated++;
        } else {
          const created = new this.leadModel(leadData);
          await created.save();
          result.created++;
        }
      } catch (err) {
        result.errors.push(`Row ${idx + 2}: ${err.message || String(err)}`);
      }
    }

    return result;
  }

  // Dashboard analytics: comprehensive metrics for admin dashboard
  async getDashboardAnalytics(organizationId: string): Promise<any> {
    const filter: any = {};
    if (organizationId) filter.organizationId = organizationId;

    const allLeads = await this.leadModel.find(filter).lean().exec();

    // Basic metrics
    const totalLeads = allLeads.length;
    const assignedLeads = allLeads.filter((l) => l.assignedTo).length;
    const convertedLeads = allLeads.filter((l) => l.status === LeadStatus.Converted).length;
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : '0.00';

    // Monthly conversion and assignment data for the past 12 months
    const now = new Date();
    const monthlyConversions: Array<{ month: string; converted: number; assigned: number }> = [];
    for (let i = 11; i >= 0; i--) {
      const targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const converted = allLeads.filter((l) => {
        if (l.status !== LeadStatus.Converted) return false;
        // Use convertedAt timestamp - this is set when status changes to Converted
        if (!l.convertedAt) return false;
        const convDate = new Date(l.convertedAt);
        return convDate >= targetMonth && convDate < nextMonth;
      }).length;

      const assigned = allLeads.filter((l) => {
        if (!l.assignedTo) return false;
        // Use assignedAt timestamp - this is set when lead is assigned
        if (!l.assignedAt) return false;
        const assignDate = new Date(l.assignedAt);
        return assignDate >= targetMonth && assignDate < nextMonth;
      }).length;

      monthlyConversions.push({
        month: targetMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        converted,
        assigned,
      });
    }

    // Telecaller performance stats
    const telecallerStats = {};
    allLeads.forEach((lead) => {
      if (!lead.assignedTo) return;
      const tcId = String(lead.assignedTo);
      if (!telecallerStats[tcId]) {
        telecallerStats[tcId] = {
          telecallerId: tcId,
          totalAssigned: 0,
          converted: 0,
          contacted: 0,
          qualified: 0,
          new: 0,
          dropped: 0,
        };
      }
      telecallerStats[tcId].totalAssigned++;
      if (lead.status === LeadStatus.Converted) telecallerStats[tcId].converted++;
      if (lead.status === LeadStatus.Contacted) telecallerStats[tcId].contacted++;
      if (lead.status === LeadStatus.Qualified) telecallerStats[tcId].qualified++;
      if (lead.status === LeadStatus.New) telecallerStats[tcId].new++;
      if (lead.status === LeadStatus.Dropped) telecallerStats[tcId].dropped++;
    });

    const telecallerPerformance = Object.values(telecallerStats).map((stat: any) => ({
      ...stat,
      conversionRate: stat.totalAssigned > 0 ? ((stat.converted / stat.totalAssigned) * 100).toFixed(2) : '0.00',
    }));

    // Source-based conversion analytics
    const sourceStats = {};
    allLeads.forEach((lead) => {
      const source = lead.source || 'Unknown';
      if (!sourceStats[source]) {
        sourceStats[source] = {
          source,
          total: 0,
          converted: 0,
        };
      }
      sourceStats[source].total++;
      if (lead.status === LeadStatus.Converted) {
        sourceStats[source].converted++;
      }
    });

    const sourceConversions = Object.values(sourceStats).map((stat: any) => ({
      ...stat,
      conversionRate: stat.total > 0 ? ((stat.converted / stat.total) * 100).toFixed(2) : '0.00',
    })).sort((a: any, b: any) => b.converted - a.converted);

    return {
      overview: {
        totalLeads,
        assignedLeads,
        convertedLeads,
        conversionRate,
        unassignedLeads: totalLeads - assignedLeads,
      },
      monthlyConversions,
      telecallerPerformance,
      sourceConversions,
    };
  }

  // Telecaller-specific dashboard analytics
  async getTelecallerDashboardAnalytics(telecallerId: string): Promise<any> {
    console.log('\n========================================');
    console.log('📊 TELECALLER DASHBOARD ANALYTICS START');
    console.log('📊 Input telecallerId:', telecallerId);
    console.log('========================================\n');
    
    // First, try to find telecaller by ID to get the actual telecaller document
    // This allows us to handle both telecaller._id and userId from auth
    let actualTelecallerId = telecallerId;
    
    try {
      // Try to validate if this is a telecaller._id
      console.log('🔍 Step 1: Trying to validate as telecaller._id...');
      const telecallerResult = await this.telecallerClient.validateTelecaller(telecallerId);
      console.log('✅ Validation result:', JSON.stringify(telecallerResult, null, 2));
      
      if (telecallerResult.isValid && telecallerResult.telecaller) {
        // Use the telecaller's _id from the response
        actualTelecallerId = telecallerResult.telecaller._id || telecallerResult.telecaller.id || telecallerId;
        console.log('✅ Resolved telecaller._id:', actualTelecallerId);
      } else {
        console.log('⚠️  Validation failed, trying userId lookup...');
        throw new Error('Not a valid telecaller._id');
      }
    } catch (error) {
      // If validation fails, it might be a userId, try to find telecaller by userId
      console.log('🔍 Step 2: Trying to find telecaller by userId...');
      try {
        const telecallerByUserIdResult = await this.telecallerClient.findTelecallerByUserId(telecallerId);
        console.log('✅ UserId lookup result:', JSON.stringify(telecallerByUserIdResult, null, 2));
        
        if (telecallerByUserIdResult.success && telecallerByUserIdResult.telecaller && telecallerByUserIdResult.telecaller._id) {
          actualTelecallerId = telecallerByUserIdResult.telecaller._id;
          console.log('✅ Resolved from userId to telecaller._id:', actualTelecallerId);
        }
      } catch (userIdError) {
        // If both fail, continue with original ID
        console.error('❌ Could not resolve telecaller ID:', telecallerId);
        console.error('❌ Error:', userIdError.message);
      }
    }

    const filter: any = { assignedTo: actualTelecallerId };

    console.log('\n📊 Final Query Details:');
    console.log('📊 Original ID:', telecallerId);
    console.log('📊 Resolved ID:', actualTelecallerId);
    console.log('📊 Filter:', JSON.stringify(filter));

    const allLeads = await this.leadModel.find(filter).lean().exec();

    console.log('📊 Found Leads:', allLeads.length);
    if (allLeads.length > 0) {
      console.log('📊 Sample Lead assignedTo:', allLeads[0].assignedTo);
    }
    console.log('========================================\n');

    // Basic telecaller stats
    const totalLeads = allLeads.length;
    const convertedLeads = allLeads.filter((l) => l.status === LeadStatus.Converted).length;
    const qualifiedLeads = allLeads.filter((l) => l.status === LeadStatus.Qualified).length;
    const contactedLeads = allLeads.filter((l) => l.status === LeadStatus.Contacted).length;
    const newLeads = allLeads.filter((l) => l.status === LeadStatus.New).length;
    const droppedLeads = allLeads.filter((l) => l.status === LeadStatus.Dropped).length;
    const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) : '0.00';

    // Follow-up tracking
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const leadsWithFollowUp = allLeads.filter((l) => l.nextFollowUp);
    
    const overdueFollowUps = leadsWithFollowUp.filter((l) => {
      const followUpDate = new Date(l.nextFollowUp!);
      return followUpDate < today;
    });

    const todaysFollowUps = leadsWithFollowUp.filter((l) => {
      const followUpDate = new Date(l.nextFollowUp!);
      return followUpDate >= today && followUpDate < tomorrow;
    });

    const pendingFollowUps = leadsWithFollowUp.filter((l) => {
      const followUpDate = new Date(l.nextFollowUp!);
      return followUpDate >= tomorrow;
    });

    // Lead status distribution for chart
    const statusDistribution = [
      { status: 'New', count: newLeads },
      { status: 'Contacted', count: contactedLeads },
      { status: 'Qualified', count: qualifiedLeads },
      { status: 'Converted', count: convertedLeads },
      { status: 'Dropped', count: droppedLeads },
    ];

    // Monthly conversion trends (last 12 months)
    const monthlyTrends: Array<{ month: string; converted: number; contacted: number }> = [];
    for (let i = 11; i >= 0; i--) {
      const targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      
      const converted = allLeads.filter((l) => {
        if (l.status !== LeadStatus.Converted) return false;
        // Use convertedAt timestamp - this is set when status changes to Converted
        if (!l.convertedAt) return false;
        const convDate = new Date(l.convertedAt);
        return convDate >= targetMonth && convDate < nextMonth;
      }).length;

      const contacted = allLeads.filter((l) => {
        if (l.status !== LeadStatus.Contacted) return false;
        // Use contactedAt timestamp - this is set when status changes to Contacted
        if (!l.contactedAt) return false;
        const contactDate = new Date(l.contactedAt);
        return contactDate >= targetMonth && contactDate < nextMonth;
      }).length;

      monthlyTrends.push({
        month: targetMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        converted,
        contacted,
      });
    }

    // Weekly conversion trends (last 8 weeks)
    const weeklyTrends: Array<{ week: string; converted: number; contacted: number }> = [];
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);

      const converted = allLeads.filter((l) => {
        if (l.status !== LeadStatus.Converted) return false;
        // Use convertedAt timestamp - this is set when status changes to Converted
        if (!l.convertedAt) return false;
        const convDate = new Date(l.convertedAt);
        return convDate >= weekStart && convDate < weekEnd;
      }).length;

      const contacted = allLeads.filter((l) => {
        if (l.status !== LeadStatus.Contacted) return false;
        // Use contactedAt timestamp - this is set when status changes to Contacted
        if (!l.contactedAt) return false;
        const contactDate = new Date(l.contactedAt);
        return contactDate >= weekStart && contactDate < weekEnd;
      }).length;

      const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      weeklyTrends.push({
        week: weekLabel,
        converted,
        contacted,
      });
    }

    // Next 2 upcoming follow-ups (earliest dates, excluding overdue and today)
    const upcomingFollowUps = pendingFollowUps
      .sort((a, b) => new Date(a.nextFollowUp!).getTime() - new Date(b.nextFollowUp!).getTime())
      .slice(0, 2)
      .map((lead) => ({
        leadId: lead._id,
        name: lead.name,
        phone: lead.phone,
        company: lead.company,
        nextFollowUp: lead.nextFollowUp,
        status: lead.status,
        priority: lead.priority,
      }));

    return {
      stats: {
        totalLeads,
        convertedLeads,
        qualifiedLeads,
        contactedLeads,
        newLeads,
        droppedLeads,
        conversionRate,
      },
      followUps: {
        overdue: overdueFollowUps.length,
        today: todaysFollowUps.length,
        pending: pendingFollowUps.length,
        overdueLeads: overdueFollowUps.map((l) => ({
          leadId: l._id,
          name: l.name,
          phone: l.phone,
          nextFollowUp: l.nextFollowUp,
          status: l.status,
        })),
        todaysLeads: todaysFollowUps.map((l) => ({
          leadId: l._id,
          name: l.name,
          phone: l.phone,
          nextFollowUp: l.nextFollowUp,
          status: l.status,
        })),
        pendingLeads: pendingFollowUps.map((l) => ({
          leadId: l._id,
          name: l.name,
          phone: l.phone,
          company: l.company,
          nextFollowUp: l.nextFollowUp,
          status: l.status,
          priority: l.priority,
        })),
      },
      statusDistribution,
      trends: {
        monthly: monthlyTrends,
        weekly: weeklyTrends,
      },
      upcomingFollowUps,
    };
  }

  // Export telecaller dashboard data to Excel
  async exportTelecallerDashboard(telecallerId: string): Promise<Buffer> {
    const data = await this.getTelecallerDashboardAnalytics(telecallerId);
    const XLSX = require('xlsx');

    // Create sheets
    const statsSheet = XLSX.utils.json_to_sheet([data.stats]);
    
    const followUpsSheet = XLSX.utils.json_to_sheet([
      { 
        Overdue: data.followUps.overdue,
        Today: data.followUps.today,
        Pending: data.followUps.pending,
      },
    ]);

    const statusDistributionSheet = XLSX.utils.json_to_sheet(data.statusDistribution);
    const monthlyTrendsSheet = XLSX.utils.json_to_sheet(data.trends.monthly);
    const weeklyTrendsSheet = XLSX.utils.json_to_sheet(data.trends.weekly);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, statsSheet, 'Stats');
    XLSX.utils.book_append_sheet(wb, followUpsSheet, 'FollowUps');
    XLSX.utils.book_append_sheet(wb, statusDistributionSheet, 'Status Distribution');
    XLSX.utils.book_append_sheet(wb, monthlyTrendsSheet, 'Monthly Trends');
    XLSX.utils.book_append_sheet(wb, weeklyTrendsSheet, 'Weekly Trends');

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return buffer;
  }

  // Export admin dashboard data to Excel
  async exportAdminDashboard(organizationId: string): Promise<Buffer> {
    const data = await this.getDashboardAnalytics(organizationId);
    const XLSX = require('xlsx');

    // Create sheets
    const overviewSheet = XLSX.utils.json_to_sheet([data.overview]);
    const monthlyConversionsSheet = XLSX.utils.json_to_sheet(data.monthlyConversions);
    const telecallerPerformanceSheet = XLSX.utils.json_to_sheet(data.telecallerPerformance);
    const sourceConversionsSheet = XLSX.utils.json_to_sheet(data.sourceConversions);

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, overviewSheet, 'Overview');
    XLSX.utils.book_append_sheet(wb, monthlyConversionsSheet, 'Monthly Data');
    XLSX.utils.book_append_sheet(wb, telecallerPerformanceSheet, 'Telecaller Performance');
    XLSX.utils.book_append_sheet(wb, sourceConversionsSheet, 'Source Conversions');

    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    return buffer;
  }
}
