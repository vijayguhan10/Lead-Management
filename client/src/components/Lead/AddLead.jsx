import React, { useState, useRef } from "react";
import { FaUserPlus } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

const LeadPriority = ["Low", "Medium", "High"];
const LeadStatus = ["New", "Qualified", "Contacted", "Converted", "Pending"];

export default function AddLead({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    source: "",
    priority: "Low",
    status: "New",
    assignedTo: "",
    email: "",
    alternatePhone: "",
    company: "",
    position: "",
    industry: "",
    location: "",
    pincode: "",
    notes: "",
    lastContacted: "",
    nextFollowUp: "",
    interestedIn: "",
    tags: "",
    createdBy: "",
    attachments: "",
    conversionScore: "",
  });
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleArrayChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value.split(",").map((v) => v.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (let field of ["name", "phone", "source", "priority"]) {
      if (!form[field]) {
        toast.error(`Please fill the mandatory field: ${field}`);
        return;
      }
    }
    const organizationId = localStorage.getItem("organizationId");
    const token = localStorage.getItem("jwt_token");
    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email,
      source: form.source,
      priority: form.priority,
      organizationId: organizationId,
    };
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_LEAD_SERVICE_URL}/leads`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Lead added successfully!");
      const created = res?.data || payload;
      onSubmit && onSubmit(created);
      onClose && onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to add lead. Please try again."
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#00000040] flex justify-center items-center">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-5xl mx-4 py-0 px-0 relative flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100 rounded-t-3xl ">
          <div className="flex items-center gap-3">
            <FaUserPlus className="text-[#FFD700] text-2xl" />
            <h2 className="text-2xl font-extrabold text-[#222]">
              Add Individual Lead
            </h2>
          </div>
          <button
            className="text-gray-400 hover:text-[#222] text-3xl font-bold transition"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        {/* Scrollable Form Area */}
        <div className="overflow-y-auto px-8 py-8 flex-1">
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Mandatory Fields */}
              <div className="bg-[#FFFDEB] rounded-xl border border-[#FFD700] shadow p-6 mb-2">
                <h3 className="text-lg font-bold text-[#222] mb-4">
                  Mandatory Fields <span className="text-red-500">*</span>
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="font-semibold text-[#222]">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Lead Name"
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#222]">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#222]">
                      Source <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="source"
                      value={form.source}
                      onChange={handleChange}
                      placeholder="Source"
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#222]">
                      Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="priority"
                      value={form.priority}
                      onChange={handleChange}
                      className="input"
                      required
                    >
                      {LeadPriority.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-[#222]">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleChange}
                      className="input"
                      required
                    >
                      {LeadStatus.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              {/* Contact Details */}
              <div className="bg-[#E6F9E5] rounded-xl border border-[#16A34A] shadow p-6 mb-2">
                <h3 className="text-lg font-bold text-[#222] mb-4">
                  Contact Details
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    name="assignedTo"
                    value={form.assignedTo}
                    onChange={handleChange}
                    placeholder="Assigned To"
                    className="input"
                  />
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="input"
                  />
                  <input
                    name="alternatePhone"
                    value={form.alternatePhone}
                    onChange={handleChange}
                    placeholder="Alternate Phone"
                    className="input"
                  />
                </div>
              </div>
              {/* Company Details */}
              <div className="bg-[#FFFDEB] rounded-xl border border-[#FFD700] shadow p-6 mb-2">
                <h3 className="text-lg font-bold text-[#222] mb-4">
                  Company Details
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Company"
                    className="input"
                  />
                  <input
                    name="position"
                    value={form.position}
                    onChange={handleChange}
                    placeholder="Position"
                    className="input"
                  />
                  <input
                    name="industry"
                    value={form.industry}
                    onChange={handleChange}
                    placeholder="Industry"
                    className="input"
                  />
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="input"
                  />
                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className="input"
                  />
                </div>
              </div>
              {/* Lead Details */}
              <div className="bg-[#E6F9E5] rounded-xl border border-[#16A34A] shadow p-6 mb-2">
                <h3 className="text-lg font-bold text-[#222] mb-4">
                  Lead Details
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Notes"
                    className="input"
                  />
                  <input
                    name="conversionScore"
                    type="number"
                    value={form.conversionScore}
                    onChange={handleChange}
                    placeholder="Conversion Score"
                    className="input"
                  />
                </div>
              </div>
              {/* Dates & Tags */}
              <div className="bg-[#FFFDEB] rounded-xl border border-[#FFD700] shadow p-6 mb-2">
                <h3 className="text-lg font-bold text-[#222] mb-4">
                  Dates & Tags
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <input
                    name="lastContacted"
                    type="date"
                    value={form.lastContacted}
                    onChange={handleChange}
                    className="input"
                  />
                  <input
                    name="nextFollowUp"
                    type="date"
                    value={form.nextFollowUp}
                    onChange={handleChange}
                    className="input"
                  />
                  <input
                    name="interestedIn"
                    value={
                      Array.isArray(form.interestedIn)
                        ? form.interestedIn.join(", ")
                        : form.interestedIn
                    }
                    onChange={(e) =>
                      handleArrayChange("interestedIn", e.target.value)
                    }
                    placeholder="Interested In (comma separated)"
                    className="input"
                  />
                  <input
                    name="tags"
                    value={
                      Array.isArray(form.tags)
                        ? form.tags.join(", ")
                        : form.tags
                    }
                    onChange={(e) => handleArrayChange("tags", e.target.value)}
                    placeholder="Tags (comma separated)"
                    className="input"
                  />
                  <input
                    name="createdBy"
                    value={form.createdBy}
                    onChange={handleChange}
                    placeholder="Created By"
                    className="input"
                  />
                  <input
                    name="attachments"
                    value={
                      Array.isArray(form.attachments)
                        ? form.attachments.join(", ")
                        : form.attachments
                    }
                    onChange={(e) =>
                      handleArrayChange("attachments", e.target.value)
                    }
                    placeholder="Attachments (comma separated)"
                    className="input"
                  />
                </div>
              </div>
            </div>
            {/* keep form content only; actions moved to footer */}
            <div style={{ height: 8 }} />
          </form>
        </div>
        {/* Footer action bar - always visible below the scroll area */}
        <div className="px-8 py-4 flex justify-end gap-4 items-center border-t border-gray-100">
          <button
            type="button"
            className="px-8 py-3 bg-[#FFD700] text-[#222] rounded-lg font-bold shadow hover:bg-[#FFFDEB] transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-8 py-3 bg-[#16A34A] text-white rounded-lg font-bold shadow hover:bg-[#13c24a] transition"
            onClick={() => formRef.current && formRef.current.requestSubmit()}
          >
            Add Lead
          </button>
        </div>
        {/* Input Styles */}
        <style>{`
          .input {
            padding: 14px;
            width: 100%;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
            background: #f9fafb;
            font-size: 1rem;
            margin-bottom: 0.5rem;
            transition: border 0.2s;
          }
          .input:focus {
            border-color: #FFD700;
            background: #fff;
            outline: none;
          }
        `}</style>
      </div>
    </div>
  );
}
