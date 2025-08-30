import { FaEye, FaDownload, FaTrashAlt } from "react-icons/fa";
import {
  formatFileSize,
  getFileType,
  getFileIcon,
} from "../utils/fileUtils.jsx";

const FileCard = ({
  file,
  selected,
  onSelect,
  onDownload,
  onDelete,
  onPreview,
}) => {
  const fileType = getFileType(file.name);

  return (
    <div
      className={`relative bg-white rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
        selected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-2 left-2 z-10">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
      </div>

      {/* File Icon/Preview */}
      <div className="p-4 pt-8">
        <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center bg-gray-50 rounded-lg">
          {fileType === "image" && file.url ? (
            <img
              src={file.url}
              alt={file.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            getFileIcon(file.name, "w-8 h-8")
          )}
        </div>

        {/* File Info */}
        <div className="text-center">
          <h4 className="font-medium text-gray-900 truncate" title={file.name}>
            {file.name}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            {formatFileSize(file.size)}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(file.uploadedAt || file.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100">
        <div className="flex gap-2">
          <button
            onClick={onPreview}
            className="bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            title="Preview"
          >
            <FaEye className="w-4 h-4" />
          </button>
          <button
            onClick={onDownload}
            className="bg-white text-gray-700 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            title="Download"
          >
            <FaDownload className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="bg-white text-red-600 p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
            title="Delete"
          >
            <FaTrashAlt className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileCard;
