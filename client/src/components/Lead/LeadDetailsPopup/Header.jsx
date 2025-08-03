import PropTypes from "prop-types";
import { FaUser } from "react-icons/fa";

const Header = ({ onClose }) => (
  <div className="sticky top-0 z-50 bg-gradient-to-r from-[#fefce8] to-[#ede9fe] text-[#312e81] p-6 rounded-t-2xl">
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-3 text-[#5B21B6]">
          <FaUser className="text-[#a78bfa]" />
          Lead Profile
        </h2>
        <p className="text-[#b45309] mt-1 font-semibold">
          Comprehensive lead analytics and details
        </p>
      </div>
      <button
        onClick={onClose}
        className="text-[#6366f1] hover:text-[#312e81] text-3xl font-light hover:rotate-90 transition-all duration-300"
        aria-label="Close"
      >
        ✕
      </button>
    </div>
  </div>
);

Header.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Header;
