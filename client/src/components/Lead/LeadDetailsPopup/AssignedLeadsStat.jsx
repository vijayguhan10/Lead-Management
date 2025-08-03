import { FaUserTie } from "react-icons/fa";

const AssignedLeadsStat = () => (
  <div className="bg-gradient-to-r from-[#e0e7ff] to-[#f3f4f6] border rounded-xl p-4 shadow-lg flex flex-col items-start justify-between h-full">
    <div className="flex items-center gap-3 mb-2">
      <FaUserTie className="text-[#4F46E5] text-2xl" />
      <span className="text-lg font-semibold text-gray-800">
        Assigned Leads
      </span>
    </div>
    <div className="text-3xl font-bold text-[#4F46E5]">320</div>
    <div className="text-xs text-gray-500 mt-1">This month</div>
  </div>
);

export default AssignedLeadsStat;
