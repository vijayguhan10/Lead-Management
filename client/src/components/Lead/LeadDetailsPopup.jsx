import PropTypes from "prop-types";
import {
  FaStar,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaUserTie,
} from "react-icons/fa";
import Header from "./LeadDetailsPopup/Header";
import LeadInfo from "./LeadDetailsPopup/LeadInfo";
import QuickStats from "./LeadDetailsPopup/QuickStats";
import Analytics from "./LeadDetailsPopup/Analytics";

// Sample data for lead-specific analytics
const leadActivityData = [
  { month: "Jan", calls: 12, emails: 8, meetings: 3 },
  { month: "Feb", calls: 15, emails: 12, meetings: 5 },
  { month: "Mar", calls: 18, emails: 15, meetings: 7 },
  { month: "Apr", calls: 22, emails: 18, meetings: 8 },
  { month: "May", calls: 20, emails: 16, meetings: 6 },
  { month: "Jun", calls: 25, emails: 20, meetings: 10 },
];

const leadSourceData = [
  { name: "Website", value: 35, color: "#7C3AED" },
  { name: "Referral", value: 25, color: "#16A34A" },
  { name: "Social Media", value: 20, color: "#F59E42" },
  { name: "Email Campaign", value: 20, color: "#3B82F6" },
];

const conversionFunnelData = [
  { stage: "Leads", count: 100, rate: 100 },
  { stage: "Qualified", count: 70, rate: 70 },
  { stage: "Proposal", count: 45, rate: 45 },
  { stage: "Negotiation", count: 25, rate: 25 },
  { stage: "Closed", count: 15, rate: 15 },
];

const leadStats = [
  {
    label: "Lead Score",
    value: "85/100",
    icon: <FaStar className="text-[#F59E42]" />,
    color: "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200",
  },
  {
    label: "Conversion Rate",
    value: "68%",
    icon: <FaCheckCircle className="text-[#16A34A]" />,
    color: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
  },
  {
    label: "Response Time",
    value: "2.5h",
    icon: <FaClock className="text-[#3B82F6]" />,
    color: "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200",
  },
  {
    label: "Follow-ups",
    value: "3 Pending",
    icon: <FaExclamationTriangle className="text-[#F59E42]" />,
    color: "bg-gradient-to-r from-orange-50 to-red-50 border-orange-200",
  },
];

const assignedLeadsStat = {
  label: "Assigned Leads",
  value: "320",
  sub: "This month",
  icon: <FaUserTie className="text-[#4F46E5] text-lg" />,
  color: "bg-gradient-to-r from-[#e0e7ff] to-[#f3f4f6]",
};

const LeadDetailsPopup = ({ lead, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div 
      className="absolute inset-0 transition-opacity"
      onClick={onClose}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px) brightness(0.8)',
        WebkitBackdropFilter: 'blur(10px) brightness(0.8)'
      }}
    ></div>
    <div className="relative w-full max-w-7xl mx-auto bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto">
      <Header onClose={onClose} />
      <div className="p-6 space-y-6 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <LeadInfo lead={lead} />
          <QuickStats stats={[...leadStats, assignedLeadsStat]} />
        </div>
        <Analytics
          leadActivityData={leadActivityData}
          leadSourceData={leadSourceData}
          conversionFunnelData={conversionFunnelData}
        />
      </div>
    </div>
  </div>
);

LeadDetailsPopup.propTypes = {
  lead: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    source: PropTypes.string,
    priority: PropTypes.string,
    status: PropTypes.string,
    company: PropTypes.string,
    position: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LeadDetailsPopup;
