import React, { useState, useRef } from "react";
import { FaCloudUploadAlt, FaFolderOpen } from "react-icons/fa";

const UploadModal = ({ leadId, leadName, onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files);
      onClose();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onUpload(files);
      onClose();
    }
  };

  if (!leadId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 transition-opacity"
          onClick={onClose}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px) brightness(0.8)",
            WebkitBackdropFilter: "blur(10px) brightness(0.8)",
          }}
        ></div>

        {/* Modal Content */}
        <div className="relative bg-white rounded-lg shadow-2xl max-w-lg w-full">
          <div className="p-6">
            <div className="text-center">
              <FaFolderOpen className="mx-auto w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Lead Selected
              </h3>
              <p className="text-gray-500">
                Please select a lead first to upload files.
              </p>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 transition-opacity"
        onClick={onClose}
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px) brightness(0.8)",
          WebkitBackdropFilter: "blur(10px) brightness(0.8)",
        }}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaCloudUploadAlt className="w-8 h-8 text-blue-500" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Upload Files
              </h3>
              <p className="text-sm text-gray-500">
                Upload files for {leadName}
              </p>
            </div>
          </div>

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
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <FaCloudUploadAlt className="mx-auto w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop files here</p>
            <p className="text-sm text-gray-500 mb-4">or</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Choose Files
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p>
              Supported formats: Images, Documents, Spreadsheets, Videos,
              Archives
            </p>
            <p>Maximum file size: 100MB per file</p>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
