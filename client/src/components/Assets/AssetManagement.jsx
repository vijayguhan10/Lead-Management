import React, { useState } from "react";
import {
  FaFolder,
  FaFileAlt,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaUpload,
  FaSort,
  FaPlus,
  FaEllipsisH,
  FaCheckSquare,
  FaEnvelope,
  FaShareAlt,
  FaSearch,
} from "react-icons/fa";

// Storage and files data (can be fetched from backend)
const storageData = [
  { type: "Image", percent: 17, color: "#4ADE80" },
  { type: "Document", percent: 13, color: "#FACC15" },
  { type: "Video", percent: 25, color: "#60A5FA" },
  { type: "Others", percent: 10, color: "#F472B6" },
];
const totalUsed = 650;

const leadFiles = [
  {
    name: "Lead-Details-April.xlsx",
    size: "1.2 MB",
    type: "Document",
    modified: "Aug 01, 2025",
    owner: "Me",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    name: "Lead-Agreement.pdf",
    size: "800 KB",
    type: "Document",
    modified: "Jul 28, 2025",
    owner: "Me",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    name: "Lead-Profile.jpg",
    size: "2.1 MB",
    type: "Image",
    modified: "Jul 25, 2025",
    owner: "Me",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
];

const shareFiles = [
  {
    name: "Lead-Report-July.pdf",
    size: "1.5 MB",
    type: "Document",
    modified: "Jul 30, 2025",
    owner: "Me",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    name: "Lead-Image.png",
    size: "1.1 MB",
    type: "Image",
    modified: "Jul 29, 2025",
    owner: "Me",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
];

// Sample leads for folder view
const leadFolders = [
  {
    id: "LD-2023",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    id: "LD-2024",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
  },
  // ...add more leads
];

const getFileIcon = (type, name) => {
  if (type === "Folder")
    return <FaFolder className="text-yellow-400 text-xl" />;
  if (name.endsWith(".pdf"))
    return <FaFilePdf className="text-red-500 text-xl" />;
  if (name.endsWith(".docx") || name.endsWith(".xlsx"))
    return <FaFileWord className="text-blue-500 text-xl" />;
  if (type === "Image" || name.endsWith(".jpg") || name.endsWith(".png"))
    return <FaFileImage className="text-green-400 text-xl" />;
  return <FaFileAlt className="text-gray-400 text-xl" />;
};

export const AssetManagement = () => {
  const [selectedLeadFiles, setSelectedLeadFiles] = useState([]);
  const [selectedShareFiles, setSelectedShareFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLeadFolder, setActiveLeadFolder] = useState(null);

  const toggleLeadFile = (name) => {
    setSelectedLeadFiles((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const toggleShareFile = (name) => {
    setSelectedShareFiles((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  // Filter folders by search
  const filteredFolders = leadFolders.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-white min-h-screen ">
      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-2">
        <div className="relative w-96">
          <input
            type="text"
            placeholder="Search by Lead Name, ID, or Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-3 text-gray-400">
            <FaSearch />
          </span>
        </div>
      </div>

      {/* Frequently Accessed Folders */}
      <div className="mb-8">
        <h2 className="font-semibold text-lg mb-2">Frequently Accessed</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredFolders.map((lead) => (
            <div
              key={lead.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center cursor-pointer border hover:border-blue-400 transition"
              onClick={() => setActiveLeadFolder(lead)}
            >
              <FaFolder className="text-yellow-400 text-4xl mb-2" />
              <img
                src={lead.avatar}
                alt={lead.name}
                className="w-8 h-8 rounded-full mb-1"
              />
              <span className="font-medium">{lead.name}</span>
              <span className="text-xs text-gray-500">{lead.id}</span>
              <span className="text-xs text-gray-400">{lead.email}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lead Files Section (filtered by folder if selected) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-lg">
            {activeLeadFolder
              ? `Files for ${activeLeadFolder.name} (${activeLeadFolder.id})`
              : "Lead Files"}
          </span>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600">
            <FaUpload /> Upload Lead File
          </button>
          {activeLeadFolder && (
            <button
              className="ml-4 text-blue-500 underline"
              onClick={() => setActiveLeadFolder(null)}
            >
              Back to All Leads
            </button>
          )}
        </div>
        <table className="min-w-full text-base mb-2">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-2 text-left font-semibold">
                <input
                  type="checkbox"
                  checked={selectedLeadFiles.length === leadFiles.length}
                  onChange={() =>
                    setSelectedLeadFiles(
                      selectedLeadFiles.length === leadFiles.length
                        ? []
                        : leadFiles.map((row) => row.name)
                    )
                  }
                />
              </th>
              <th className="py-2 px-2 text-left font-semibold">Name</th>
              <th className="py-2 px-2 text-left font-semibold">Size</th>
              <th className="py-2 px-2 text-left font-semibold">Type</th>
              <th className="py-2 px-2 text-left font-semibold">
                Last Modified
              </th>
              <th className="py-2 px-2 text-left font-semibold">Owner</th>
              <th className="py-2 px-2 text-left font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {leadFiles.map((row) => (
              <tr key={row.name} className="hover:bg-gray-100 transition">
                <td className="py-2 px-2">
                  <input
                    type="checkbox"
                    checked={selectedLeadFiles.includes(row.name)}
                    onChange={() => toggleLeadFile(row.name)}
                  />
                </td>
                <td className="py-2 px-2 flex items-center gap-2">
                  {getFileIcon(row.type, row.name)}
                  <span className="font-medium">{row.name}</span>
                </td>
                <td className="py-2 px-2">{row.size}</td>
                <td className="py-2 px-2">{row.type}</td>
                <td className="py-2 px-2">{row.modified}</td>
                <td className="py-2 px-2 flex items-center gap-2">
                  <img
                    src={row.avatar}
                    alt={row.owner}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>{row.owner}</span>
                </td>
                <td className="py-2 px-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaEllipsisH />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Selected actions bar for Lead Files */}
        {selectedLeadFiles.length > 0 && (
          <div className="flex items-center gap-2 mt-2 bg-white rounded-lg shadow px-4 py-2 border border-gray-200">
            <FaCheckSquare className="text-blue-500" />
            <span className="font-medium">
              {selectedLeadFiles.length} Selected
            </span>
            <button className="text-gray-500 hover:text-blue-500 px-2">
              Download
            </button>
            <button className="text-gray-500 hover:text-blue-500 px-2">
              Delete
            </button>
            <button className="text-gray-500 hover:text-blue-500 px-2">
              Share
            </button>
            <button className="text-gray-500 hover:text-blue-500 px-2">
              More
            </button>
          </div>
        )}
      </div>

      {/* Files to Share/Send Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-lg">Files to Share/Send</span>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600">
            <FaShareAlt /> Add File to Share
          </button>
        </div>
        <table className="min-w-full text-base mb-2">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-2 text-left font-semibold">
                <input
                  type="checkbox"
                  checked={selectedShareFiles.length === shareFiles.length}
                  onChange={() =>
                    setSelectedShareFiles(
                      selectedShareFiles.length === shareFiles.length
                        ? []
                        : shareFiles.map((row) => row.name)
                    )
                  }
                />
              </th>
              <th className="py-2 px-2 text-left font-semibold">Name</th>
              <th className="py-2 px-2 text-left font-semibold">Size</th>
              <th className="py-2 px-2 text-left font-semibold">Type</th>
              <th className="py-2 px-2 text-left font-semibold">
                Last Modified
              </th>
              <th className="py-2 px-2 text-left font-semibold">Owner</th>
              <th className="py-2 px-2 text-left font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {shareFiles.map((row) => (
              <tr key={row.name} className="hover:bg-gray-100 transition">
                <td className="py-2 px-2">
                  <input
                    type="checkbox"
                    checked={selectedShareFiles.includes(row.name)}
                    onChange={() => toggleShareFile(row.name)}
                  />
                </td>
                <td className="py-2 px-2 flex items-center gap-2">
                  {getFileIcon(row.type, row.name)}
                  <span className="font-medium">{row.name}</span>
                </td>
                <td className="py-2 px-2">{row.size}</td>
                <td className="py-2 px-2">{row.type}</td>
                <td className="py-2 px-2">{row.modified}</td>
                <td className="py-2 px-2 flex items-center gap-2">
                  <img
                    src={row.avatar}
                    alt={row.owner}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span>{row.owner}</span>
                </td>
                <td className="py-2 px-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <FaEllipsisH />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Selected actions bar for Share Files */}
        {selectedShareFiles.length > 0 && (
          <div className="flex items-center gap-2 mt-2 bg-white rounded-lg shadow px-4 py-2 border border-gray-200">
            <FaCheckSquare className="text-green-500" />
            <span className="font-medium">
              {selectedShareFiles.length} Selected
            </span>
            <button className="text-gray-500 hover:text-green-500 px-2">
              <FaEnvelope className="inline mr-1" /> Send via Email
            </button>
            <button className="text-gray-500 hover:text-green-500 px-2">
              <FaShareAlt className="inline mr-1" /> Share Link
            </button>
            <button className="text-gray-500 hover:text-green-500 px-2">
              Download
            </button>
            <button className="text-gray-500 hover:text-green-500 px-2">
              Delete
            </button>
            <button className="text-gray-500 hover:text-green-500 px-2">
              More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetManagement;
