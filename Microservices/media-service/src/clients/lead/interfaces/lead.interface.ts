export interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  alternatePhone?: string;
  company?: string;
  position?: string;
  industry?: string;
  location?: string;
  pincode?: string;
  source: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Dropped';
  assignedTo?: string;
  notes?: string;
  lastContacted?: Date;
  nextFollowUp?: Date;
  interestedIn?: string[];
  tags?: string[];
  createdBy?: string;
  attachments?: string[];
  conversionScore?: number;
  organizationId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LeadsWithUpcomingFollowUps {
  leads: Lead[];
  count: number;
}
