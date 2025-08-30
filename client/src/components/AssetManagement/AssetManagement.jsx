import React, { useState } from "react";
import LeadsTable from "./components/LeadsTable";
import FileManager from "./components/FileManager";
import PreviewModal from "./components/PreviewModal";
import UploadModal from "./components/UploadModal";
import { useFileOperations } from "./hooks/useFileOperations";

const AssetManagement = () => {
  const [selectedLead, setSelectedLead] = useState(null);
  const [showPreview, setShowPreview] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const {
    files,
    uploads,
    loading,
    handleFileUpload,
    handleDownload,
    handleDelete,
    handleBulkDelete,
    handleBulkDownload,
  } = useFileOperations(selectedLead);

  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
  };

  const handlePreview = (file) => {
    setShowPreview(file);
  };

  const handleClosePreview = () => {
    setShowPreview(null);
  };

  const handleUploadModalOpen = () => {
    setShowUploadModal(true);
  };

  const handleUploadModalClose = () => {
    setShowUploadModal(false);
  };

  const handleUploadFromModal = (fileList) => {
    handleFileUpload(fileList);
    setShowUploadModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">File Management</h1>
        <p className="text-gray-600">
          Select a lead to view and manage their files
        </p>
      </div>

      {/* Leads Table */}
      <LeadsTable onLeadSelect={handleLeadSelect} selectedLead={selectedLead} />

      {/* File Manager - Shows when lead is selected */}
      <FileManager
        selectedLead={selectedLead}
        files={files}
        uploads={uploads}
        loading={loading}
        onFileUpload={handleFileUpload}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onBulkDownload={handleBulkDownload}
        onPreview={handlePreview}
        onUploadModalOpen={handleUploadModalOpen}
      />

      {/* Preview Modal */}
      {showPreview && (
        <PreviewModal
          file={showPreview}
          onClose={handleClosePreview}
          onDownload={handleDownload}
          onDelete={(file) => {
            handleDelete(file);
            setShowPreview(null);
          }}
        />
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          leadId={selectedLead?._id || selectedLead?.id}
          leadName={selectedLead?.name}
          onClose={handleUploadModalClose}
          onUpload={handleUploadFromModal}
        />
      )}
    </div>
  );
};

export default AssetManagement;
