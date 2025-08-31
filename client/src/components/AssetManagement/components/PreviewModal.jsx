import React from "react";
import { FaTimes, FaDownload, FaTrashAlt, FaFilePdf } from "react-icons/fa";
import {
  formatFileSize,
  getFileType,
  getFileIcon,
} from "../utils/fileUtils.jsx";

const PreviewModal = ({ file, onClose, onDownload, onDelete }) => {
  const fileName =
    file.originalName || file.name || file.fileName || "Unknown File";
  const fileType = getFileType(fileName);

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
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon(fileName)}
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {fileName}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)} •{" "}
                  {new Date(
                    file.uploadedAt || file.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-96">
            {fileType === "image" && file.url ? (
              <img
                src={file.url}
                alt={fileName}
                className="max-w-full max-h-96 object-contain"
              />
            ) : fileType === "document" && fileName.endsWith(".pdf") ? (
              <div className="text-center">
                <FaFilePdf className="w-24 h-24 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600">PDF Preview not available</p>
                <p className="text-sm text-gray-500 mt-2">
                  Download to view the document
                </p>
              </div>
            ) : (
              <div className="text-center">
                {getFileIcon(fileName, "w-24 h-24 mx-auto mb-4")}
                <p className="text-gray-600">
                  Preview not available for this file type
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Download to view the file
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onDownload(file)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <FaDownload className="w-4 h-4" />
            Download
          </button>
          <button
            onClick={() => onDelete(file)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <FaTrashAlt className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
