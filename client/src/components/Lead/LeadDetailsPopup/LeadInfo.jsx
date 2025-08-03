import PropTypes from "prop-types";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaBriefcase,
  FaTag,
  FaExclamationTriangle,
  FaCheckCircle,
} from "react-icons/fa";

const LeadInfo = ({ lead }) => (
  <div className="lg:col-span-2 bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-100 shadow-lg">
    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
      <FaUser className="text-[#7C3AED]" />
      Lead Information
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
          <FaUser className="text-[#7C3AED] text-lg" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Name
            </p>
            <p className="font-semibold text-gray-800">{lead.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
          <FaEnvelope className="text-[#16A34A] text-lg" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Email
            </p>
            <p className="font-semibold text-gray-800">{lead.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
          <FaPhone className="text-[#3B82F6] text-lg" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Phone
            </p>
            <p className="font-semibold text-gray-800">{lead.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
          <FaBuilding className="text-[#F59E42] text-lg" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Company
            </p>
            <p className="font-semibold text-gray-800">
              {lead.company || "N/A"}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
          <FaBriefcase className="text-[#7C3AED] text-lg" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Position
            </p>
            <p className="font-semibold text-gray-800">
              {lead.position || "N/A"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
          <FaTag className="text-[#16A34A] text-lg" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Source
            </p>
            <p className="font-semibold text-gray-800">{lead.source}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
          <FaExclamationTriangle className="text-[#F59E42] text-lg" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Priority
            </p>
            <p className="font-semibold text-gray-800">{lead.priority}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
          <FaCheckCircle className="text-[#16A34A] text-lg" />
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Status
            </p>
            <p className="font-semibold text-gray-800">{lead.status}</p>
          </div>
        </div>
      </div>
    </div>
    {lead.notes && (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="font-semibold text-gray-800 mb-2">Notes</h4>
        <p className="text-gray-700">{lead.notes}</p>
      </div>
    )}
  </div>
);

LeadInfo.propTypes = {
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
};

export default LeadInfo;
