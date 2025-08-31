import {
  FaFileAlt,
  FaFilePdf,
  FaFileImage,
  FaFileWord,
  FaFileVideo,
  FaFileArchive,
} from "react-icons/fa";

// File type configurations
export const FILE_TYPES = {
  image: {
    extensions: [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp", ".svg"],
    icon: FaFileImage,
    color: "text-green-500",
    accept: "image/*",
  },
  document: {
    extensions: [".pdf", ".doc", ".docx", ".txt", ".rtf"],
    icon: FaFilePdf,
    color: "text-red-500",
    accept: ".pdf,.doc,.docx,.txt,.rtf",
  },
  spreadsheet: {
    extensions: [".xls", ".xlsx", ".csv"],
    icon: FaFileWord,
    color: "text-blue-500",
    accept: ".xls,.xlsx,.csv",
  },
  video: {
    extensions: [".mp4", ".avi", ".mov", ".wmv", ".flv", ".webm"],
    icon: FaFileVideo,
    color: "text-purple-500",
    accept: "video/*",
  },
  archive: {
    extensions: [".zip", ".rar", ".7z", ".tar", ".gz"],
    icon: FaFileArchive,
    color: "text-orange-500",
    accept: ".zip,.rar,.7z,.tar,.gz",
  },
  other: {
    extensions: [],
    icon: FaFileAlt,
    color: "text-gray-500",
    accept: "*",
  },
};

// Utility functions
export const formatFileSize = (bytes) => {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const getFileType = (filename) => {
  if (!filename || typeof filename !== "string") {
    return "other";
  }
  const ext = "." + filename.split(".").pop().toLowerCase();
  for (const [type, config] of Object.entries(FILE_TYPES)) {
    if (config.extensions.includes(ext)) {
      return type;
    }
  }
  return "other";
};

export const getFileIcon = (filename, className = "w-6 h-6") => {
  const type = getFileType(filename);
  const config = FILE_TYPES[type];
  const IconComponent = config.icon;
  return <IconComponent className={`${className} ${config.color}`} />;
};
