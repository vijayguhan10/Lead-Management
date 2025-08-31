import React from "react";
import { FaEye, FaDownload, FaTrashAlt } from "react-icons/fa";
import {
  formatFileSize,
  getFileType,
  getFileIcon,
} from "../utils/fileUtils.jsx";

const FileRow = ({
  file,
  selected,
  onSelect,
  onDownload,
  onDelete,
  onPreview,
}) => {
  const fileName =
    file.originalName || file.name || file.fileName || "Unknown File";

  return (
    <tr className={`hover:bg-gray-50 ${selected ? "bg-blue-50" : ""}`}>
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {getFileIcon(fileName)}
          <div>
            <div className="font-medium text-gray-900">{fileName}</div>
            <div className="text-sm text-gray-500">
              {file._id || file.id || "N/A"}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {formatFileSize(file.size)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 capitalize">
        {getFileType(fileName)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {new Date(file.uploadedAt || file.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onPreview}
            className="text-gray-400 hover:text-blue-600 transition-colors"
            title="Preview"
          >
            <FaEye className="w-4 h-4" />
          </button>
          <button
            onClick={onDownload}
            className="text-gray-400 hover:text-green-600 transition-colors"
            title="Download"
          >
            <FaDownload className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-gray-400 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <FaTrashAlt className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default FileRow;
