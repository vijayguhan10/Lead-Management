import { useState, useEffect, useCallback } from "react";
import { useApi } from "../../../hooks/useApi";
import { toast } from "react-toastify";

export const useFileOperations = (selectedLead) => {
  const [files, setFiles] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);

  const { execute: getSignedUrl } = useApi("media", "/files/signed-url", {
    manual: true,
    method: "POST",
  });
  const { execute } = useApi("media", "", { manual: true });

  // Fetch files for selected lead
  const fetchFiles = async () => {
    if (!selectedLead?._id) {
      setFiles([]);
      return;
    }

    setLoading(true);
    try {
      const response = await execute({
        endpoint: `/files/lead/${selectedLead._id}`,
        method: "GET",
      });
      setFiles(response || []);
    } catch (error) {
      console.error("Error fetching files:", error);
      // Only show toast error once per lead
      if (error.response?.status !== 404) {
        toast.error("Failed to fetch files");
      }
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedLead?._id]); // Removed execute from dependencies

  const handleFileUpload = async (fileList) => {
    if (!selectedLead) {
      toast.error("Please select a lead first");
      return;
    }

    const orgId = localStorage.getItem("organizationId");
    if (!orgId) {
      toast.error("Organization ID not found");
      return;
    }

    const newUploads = Array.from(fileList).map((file) => ({
      id: `upload-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      progress: 0,
      status: "uploading",
      leadId: selectedLead._id,
    }));

    setUploads((prev) => [...prev, ...newUploads]);

    // Process each file upload
    for (const upload of newUploads) {
      try {
        // Update progress to show start
        setUploads((prev) =>
          prev.map((u) => (u.id === upload.id ? { ...u, progress: 10 } : u))
        );

        // Step 1: Get signed URL from backend
        const signedUrlResponse = await getSignedUrl({
          method: "POST",
          data: {
            fileName: upload.file.name,
            fileType: upload.file.type,
            leadId: selectedLead._id,
            organizationId: orgId,
          },
        });

        setUploads((prev) =>
          prev.map((u) => (u.id === upload.id ? { ...u, progress: 30 } : u))
        );

        // Step 2: Upload file to S3 using signed URL
        const uploadResponse = await fetch(signedUrlResponse.uploadUrl, {
          method: "PUT",
          body: upload.file,
          headers: {
            "Content-Type": upload.file.type,
          },
        });

        if (!uploadResponse.ok) {
          const errorText = await uploadResponse.text();
          console.error("S3 Upload Error:", uploadResponse.status, errorText);
          throw new Error(
            `Failed to upload file to S3: ${uploadResponse.status} ${errorText}`
          );
        }

        setUploads((prev) =>
          prev.map((u) => (u.id === upload.id ? { ...u, progress: 80 } : u))
        );

        // Step 3: Confirm upload completion to backend
        await execute({
          endpoint: `/files/${signedUrlResponse.fileId}/confirm`,
          method: "POST",
        });

        // Refetch files to get the updated list from the server
        await fetchFiles();

        // Mark upload as complete
        setUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id
              ? { ...u, progress: 100, status: "completed" }
              : u
          )
        );

        toast.success(`${upload.file.name} uploaded successfully`);

        // Remove from uploads after 2 seconds
        setTimeout(() => {
          setUploads((prev) => prev.filter((u) => u.id !== upload.id));
        }, 2000);
      } catch (error) {
        console.error("Upload failed:", error);
        setUploads((prev) =>
          prev.map((u) =>
            u.id === upload.id ? { ...u, status: "failed", progress: 0 } : u
          )
        );
        toast.error(`Failed to upload ${upload.file.name}`);

        // Remove failed upload from uploads after 3 seconds
        setTimeout(() => {
          setUploads((prev) => prev.filter((u) => u.id !== upload.id));
        }, 3000);
      }
    }
  };

  const handleDownload = async (file) => {
    try {
      const response = await execute({
        endpoint: `/files/${file._id || file.id}/download`,
        method: "GET",
      });

      // Create download link and trigger download
      const link = document.createElement("a");
      link.href = response.downloadUrl;
      link.download =
        file.originalName || file.name || file.fileName || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(
        `Downloading ${
          file.originalName || file.name || file.fileName || "file"
        }`
      );
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file");
    }
  };

  const handleDelete = async (file) => {
    const fileName =
      file.originalName || file.name || file.fileName || "this file";
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      await execute({
        endpoint: `/files/${file._id || file.id}`,
        method: "DELETE",
      });

      setFiles((prev) =>
        prev.filter((f) => (f._id || f.id) !== (file._id || file.id))
      );
      toast.success(`${fileName} deleted successfully`);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete file");
    }
  };

  const handleBulkDelete = async (selectedFileIds) => {
    const filesToDelete = files.filter((file) =>
      selectedFileIds.includes(file._id || file.id)
    );

    if (
      !window.confirm(
        `Are you sure you want to delete ${filesToDelete.length} file(s)?`
      )
    ) {
      return;
    }

    try {
      await Promise.all(
        filesToDelete.map((file) =>
          execute({
            endpoint: `/files/${file.id}`,
            method: "DELETE",
          })
        )
      );

      setFiles((prev) => prev.filter((f) => !selectedFileIds.includes(f.id)));
      toast.success(`${filesToDelete.length} file(s) deleted successfully`);
    } catch (error) {
      console.error("Bulk delete failed:", error);
      toast.error("Failed to delete some files");
    }
  };

  const handleBulkDownload = async (selectedFileIds) => {
    const filesToDownload = files.filter((file) =>
      selectedFileIds.includes(file.id)
    );

    for (const file of filesToDownload) {
      await handleDownload(file);
    }
  };

  return {
    files,
    uploads,
    loading,
    handleFileUpload,
    handleDownload,
    handleDelete,
    handleBulkDelete,
    handleBulkDownload,
    refetchFiles: fetchFiles,
  };
};
