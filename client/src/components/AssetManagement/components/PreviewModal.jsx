import React from "react";
import { FaTimes, FaDownload, FaTrashAlt, FaFilePdf } from "react-icons/fa";
import {
  formatFileSize,
  getFileType,
  getFileIcon,
} from "../utils/fileUtils.jsx";

const PreviewModal = ({ file, onClose, onDownload, onDelete }) => {
  const fileType = getFileType(file.name);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon(file.name)}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {file.name}
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
          <div className="px-4 py-5 sm:px-6">
            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-96">
              {fileType === "image" && file.url ? (
                <img
                  src={file.url}
                  alt={file.name}
                  className="max-w-full max-h-96 object-contain"
                />
              ) : fileType === "document" && file.name.endsWith(".pdf") ? (
                <div className="text-center">
                  <FaFilePdf className="w-24 h-24 text-red-500 mx-auto mb-4" />
                  <p className="text-gray-600">PDF Preview not available</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Download to view the document
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  {getFileIcon(file.name, "w-24 h-24 mx-auto mb-4")}
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
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={onDownload}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <FaDownload className="w-4 h-4 mr-2" />
              Download
            </button>
            <button
              onClick={onDelete}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <FaTrashAlt className="w-4 h-4 mr-2" />
              Delete
            </button>
            <button
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
