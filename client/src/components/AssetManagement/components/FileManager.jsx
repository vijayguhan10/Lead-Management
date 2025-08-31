import React, { useState, useEffect } from "react";
import {
  FaCloudUploadAlt,
  FaTh,
  FaList,
  FaSearch,
  FaFilter,
  FaDownload,
  FaTrashAlt,
  FaSpinner,
  FaCheck,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import FileCard from "./FileCard";
import FileRow from "./FileRow";
import { FILE_TYPES } from "../utils/fileUtils.jsx";

const FileManager = ({
  selectedLead,
  files,
  uploads,
  loading,
  onFileUpload,
  onDownload,
  onDelete,
  onBulkDelete,
  onBulkDownload,
  onPreview,
  onUploadModalOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Filter and sort files
  const filteredFiles = React.useMemo(() => {
    let filtered = [...files];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((file) => {
        const fileName = file.originalName || file.name || file.fileName || "";
        return fileName.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Apply type filter
    if (filterType !== "all") {
      filtered = filtered.filter((file) => {
        const fileName = file.originalName || file.name || file.fileName || "";
        if (!fileName) return false;
        const ext = "." + fileName.split(".").pop().toLowerCase();
        return FILE_TYPES[filterType]?.extensions.includes(ext);
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = (a.originalName || a.name || a.fileName || "").toLowerCase();
          bValue = (b.originalName || b.name || b.fileName || "").toLowerCase();
          break;
        case "size":
          aValue = a.size || 0;
          bValue = b.size || 0;
          break;
        case "date":
          aValue = new Date(a.uploadedAt || a.createdAt || 0);
          bValue = new Date(b.uploadedAt || b.createdAt || 0);
          break;
        default:
          aValue = (a.originalName || a.name || a.fileName || "").toLowerCase();
          bValue = (b.originalName || b.name || b.fileName || "").toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [files, searchTerm, filterType, sortBy, sortOrder]);

  const handleFileSelect = (fileId) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId)
        ? prev.filter((id) => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map((f) => f.id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedFiles.length === 0) return;

    if (action === "delete") {
      onBulkDelete(selectedFiles);
      setSelectedFiles([]);
    } else if (action === "download") {
      onBulkDownload(selectedFiles);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      onFileUpload(droppedFiles);
    }
  };

  useEffect(() => {
    if (!selectedLead) return;
    // ensure file manager is expanded and scrolled into view when a lead is selected
    setIsExpanded(true);
    setTimeout(() => {
      const el = document.getElementById("asset-file-manager");
      if (el && typeof el.scrollIntoView === "function") {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    }, 120);
  }, [selectedLead]);

  if (!selectedLead) {
    return null;
  }

  return (
    <div id="asset-file-manager" className="bg-white rounded-lg shadow mt-6">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center space-x-2 text-lg font-medium text-gray-900 hover:text-blue-600"
            >
              {isExpanded ? (
                <FaArrowUp className="w-4 h-4" />
              ) : (
                <FaArrowDown className="w-4 h-4" />
              )}
              <span>File Manager - {selectedLead.name}</span>
            </button>
            <span className="text-sm text-gray-500">
              {filteredFiles.length} files
            </span>
          </div>

          {isExpanded && (
            <div className="flex items-center space-x-3">
              {/* Bulk Actions */}
              {selectedFiles.length > 0 && (
                <>
                  <button
                    onClick={() => handleBulkAction("download")}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
                  >
                    <FaDownload className="w-3 h-3" />
                    <span>{selectedFiles.length}</span>
                  </button>
                  <button
                    onClick={() => handleBulkAction("delete")}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                  >
                    <FaTrashAlt className="w-3 h-3" />
                    <span>{selectedFiles.length}</span>
                  </button>
                </>
              )}

              {/* View Toggle */}
              <div className="flex border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 ${
                    viewMode === "grid"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaTh className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 ${
                    viewMode === "list"
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FaList className="w-3 h-3" />
                </button>
              </div>

              {/* Upload Button */}
              <button
                onClick={onUploadModalOpen}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 text-sm"
              >
                <FaCloudUploadAlt className="w-4 h-4" />
                <span>Upload</span>
              </button>
            </div>
          )}
        </div>

        {/* Filters - Only show when expanded */}
        {isExpanded && (
          <div className="mt-4 flex items-center space-x-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="spreadsheet">Spreadsheets</option>
              <option value="video">Videos</option>
              <option value="archive">Archives</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="size-asc">Size (Small)</option>
              <option value="size-desc">Size (Large)</option>
              <option value="date-desc">Newest</option>
              <option value="date-asc">Oldest</option>
            </select>
          </div>
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <>
          {/* Upload Progress */}
          {uploads.length > 0 && (
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3 text-sm">
                Uploading Files
              </h4>
              <div className="space-y-2">
                {uploads.map((upload) => (
                  <div key={upload.id} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-700">{upload.name}</span>
                        <span className="text-gray-500">
                          {upload.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full transition-all ${
                            upload.status === "failed"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${upload.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    {upload.status === "uploading" && (
                      <FaSpinner className="animate-spin text-blue-500 w-3 h-3" />
                    )}
                    {upload.status === "completed" && (
                      <FaCheck className="text-green-500 w-3 h-3" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <FaSpinner className="animate-spin text-gray-400 w-6 h-6" />
              </div>
            ) : filteredFiles.length === 0 ? (
              // Empty State / Drop Zone
              <div
                onDragEnter={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <FaCloudUploadAlt className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No files yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Upload files for {selectedLead.name}
                </p>
                <button
                  onClick={onUploadModalOpen}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                >
                  Upload Files
                </button>
              </div>
            ) : (
              // Files Display
              <div>
                {viewMode === "grid" ? (
                  // Grid View
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {filteredFiles.map((file) => (
                      <FileCard
                        key={file._id || file.id || Math.random()}
                        file={file}
                        selected={selectedFiles.includes(file._id || file.id)}
                        onSelect={() => handleFileSelect(file._id || file.id)}
                        onDownload={() => onDownload(file)}
                        onDelete={() => onDelete(file)}
                        onPreview={() => onPreview(file)}
                      />
                    ))}
                  </div>
                ) : (
                  // List View
                  <div className="overflow-hidden rounded-md border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left">
                            <input
                              type="checkbox"
                              checked={
                                selectedFiles.length === filteredFiles.length &&
                                filteredFiles.length > 0
                              }
                              onChange={handleSelectAll}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Name
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Size
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Type
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredFiles.map((file) => (
                          <FileRow
                            key={file._id || file.id || Math.random()}
                            file={file}
                            selected={selectedFiles.includes(
                              file._id || file.id
                            )}
                            onSelect={() =>
                              handleFileSelect(file._id || file.id)
                            }
                            onDownload={() => onDownload(file)}
                            onDelete={() => onDelete(file)}
                            onPreview={() => onPreview(file)}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FileManager;
