import { FaUserTie, FaCheckCircle } from "react-icons/fa";

const telecallers = [
  { name: "Priya Sharma", assigned: 45, status: "Active" },
  { name: "Rahul Verma", assigned: 38, status: "Active" },
  { name: "Sneha Patel", assigned: 27, status: "Inactive" },
];

const TelecallerPerformanceStat = () => (
  <div className="bg-gradient-to-r from-[#e0e7ff] to-[#f3f4f6] border rounded-xl p-4 shadow-lg flex flex-col h-full">
    <div className="flex items-center gap-2 mb-2">
      <FaUserTie className="text-[#4F46E5] text-xl" />
      <span className="text-base font-semibold text-gray-800">
        Telecaller Performance
      </span>
    </div>
    <div className="flex-1">
      <ul className="divide-y divide-gray-200">
        {telecallers.map((tc) => (
          <li key={tc.name} className="py-2 flex items-center justify-between">
            <span className="font-medium text-gray-700">{tc.name}</span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <FaCheckCircle
                className={`text-xs ${
                  tc.status === "Active" ? "text-green-500" : "text-gray-400"
                }`}
              />
              {tc.status}
            </span>
            <span className="text-sm font-semibold text-[#4F46E5]">
              {tc.assigned} leads
            </span>
          </li>
        ))}
      </ul>
    </div>
    <div className="text-xs text-gray-500 mt-2">Top performers this month</div>
  </div>
);

export default TelecallerPerformanceStat;
