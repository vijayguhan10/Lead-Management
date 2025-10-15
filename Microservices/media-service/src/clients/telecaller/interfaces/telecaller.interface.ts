export interface Telecaller {
  _id: string;
  userId: string;
  name: string;
  phone: string;
  email: string;
  assignedLeads: string[];
  performanceMetrics?: {
    dailyCallTarget?: number;
    monthlyLeadGoal?: number;
  };
  organizationId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
