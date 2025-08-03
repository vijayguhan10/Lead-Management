import PropTypes from "prop-types";

const QuickStats = ({ stats }) => (
  <div className="space-y-4">
    {stats.map((stat) => (
      <div
        key={stat.label}
        className={`${stat.color} border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            {stat.sub && (
              <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
            )}
          </div>
          <div className="text-2xl">{stat.icon}</div>
        </div>
      </div>
    ))}
  </div>
);

QuickStats.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default QuickStats;
