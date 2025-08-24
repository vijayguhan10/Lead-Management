import React, { useState } from "react";

const MANDATORY = ["name", "phone", "source", "priority", "status"];
const OPTIONAL = [
  "assignedTo",
  "email",
  "alternatePhone",
  "company",
  "position",
  "industry",
  "location",
  "pincode",
  "notes",
  "lastContacted",
  "nextFollowUp",
  "interestedIn",
  "tags",
  "createdBy",
  "attachments",
  "conversionScore",
];

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate mandatory fields
    for (let field of MANDATORY) {
      if (!form[field]) {
        alert(`Please fill the mandatory field: ${field}`);
        return;
      }
    }
    onSubmit && onSubmit(form);
    onClose && onClose();
  };

  return (
    <div className="min-h-screen w-full bg-[#FFFDEB] flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-extrabold text-[#222]">
            Add Individual Lead
          </h2>
          <button
            className="px-6 py-2 bg-[#FFD700] text-[#222] rounded-lg font-bold shadow hover:bg-[#FFFDEB] transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mandatory Fields Card */}
            <div className="bg-white rounded-2xl border border-[#FFD700] shadow p-8">
              <h3 className="text-xl font-bold text-[#222] mb-6">
                Mandatory Fields <span className="text-red-500">*</span>
              </h3>
              <div className="flex flex-col gap-6">
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
            {/* Optional Fields Card */}
            <div className="bg-[#E6F9E5] rounded-2xl border border-[#16A34A] shadow p-8">
              <h3 className="text-xl font-bold text-[#222] mb-6">
                Optional Fields
              </h3>
              <div className="flex flex-col gap-6">
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
                <input
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Notes"
                  className="input"
                />
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
                    Array.isArray(form.tags) ? form.tags.join(", ") : form.tags
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
          </div>
          <div className="flex justify-end gap-4 mt-10">
            <button
              type="button"
              className="px-8 py-3 bg-[#FFD700] text-[#222] rounded-lg font-bold shadow hover:bg-[#FFFDEB] transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-[#16A34A] text-white rounded-lg font-bold shadow hover:bg-[#13c24a] transition"
            >
              Add Lead
            </button>
          </div>
        </form>
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
