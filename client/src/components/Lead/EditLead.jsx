import React, { useEffect, useState, useRef } from "react";
import { FaUserEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import { useApi } from "../../hooks/useApi";

// Helpers to convert between Date and input[type=datetime-local] string in local timezone
const toLocalDateTimeInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

const parseLocalDateTime = (dateTimeString) => {
  if (!dateTimeString) return undefined;
  const [datePart, timePart] = dateTimeString.split("T");
  if (!timePart) return new Date(datePart);
  const [year, month, day] = datePart.split("-").map((s) => Number(s));
  const [hour, minute] = timePart.split(":").map((s) => Number(s));
  return new Date(year, month - 1, day, hour || 0, minute || 0);
};

const LeadPriority = ["Low", "Medium", "High"];
const LeadStatus = ["New", "Qualified", "Contacted", "Converted", "Pending"];

export default function EditLead({
  leadId,
  onClose,
  onSubmit,
  telecallers = [],
}) {
  const role = localStorage.getItem("role");
  const { data, loading, error, execute } = useApi(
    "lead",
    leadId ? `/leads/${leadId}` : "/leads/0"
  );

  const formRef = useRef(null);

  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      // initialize form with API data
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        source: data.source || "",
        priority: data.priority || "Low",
        status: data.status || "New",
        assignedTo: data.assignedTo || "",
        email: data.email || "",
        alternatePhone: data.alternatePhone || "",
        company: data.company || "",
        position: data.position || "",
        industry: data.industry || "",
        location: data.location || "",
        pincode: data.pincode || "",
        notes: data.notes || "",
        lastContacted: data.lastContacted
          ? new Date(data.lastContacted).toISOString().slice(0, 10)
          : "",
        nextFollowUp: data.nextFollowUp ? toLocalDateTimeInput(data.nextFollowUp) : "",
        interestedIn: Array.isArray(data.interestedIn)
          ? data.interestedIn.join(", ")
          : data.interestedIn || "",
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : data.tags || "",
        createdBy: data.createdBy || "",
        attachments: Array.isArray(data.attachments)
          ? data.attachments.join(", ")
          : data.attachments || "",
        conversionScore: data.conversionScore || "",
        organizationId: data.organizationId,
        _id: data._id,
      });
    }
    if (error) {
      toast.error(error.message || "Failed to load lead details");
    }
  }, [data, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resolveAssignedName = (assignedId) => {
    if (!assignedId) return "Not assigned";
    if (Array.isArray(telecallers)) {
      const found = telecallers.find((tc) => {
        const id =
          tc._id ||
          tc.id ||
          tc.userId ||
          (tc.user && (tc.user._id || tc.user.id));
        return String(id) === String(assignedId);
      });
      if (found)
        return (
          found.name || found.fullName || found.firstName || String(assignedId)
        );
    }
    return String(assignedId);
  };

  const handleArrayChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form) return;
    let payload;
    let method = "PUT";
    let endpoint = `/leads/${leadId}`;
    if (role === "telecaller") {
      // Only allow notes, tags, and interestedIn for telecaller
      payload = {
        notes: form.notes,
        tags: form.tags ? form.tags.split(",").map((s) => s.trim()) : [],
        interestedIn: form.interestedIn
          ? form.interestedIn.split(",").map((s) => s.trim())
          : [],
        nextFollowUp: form.nextFollowUp ? parseLocalDateTime(form.nextFollowUp) : undefined,
        lastContacted: form.lastContacted ? new Date(form.lastContacted) : undefined,
      };
      method = "PATCH";
      endpoint = `/leads/${leadId}/notes`;
    } else {
      // Admin can edit all fields
      payload = {
        name: form.name,
        phone: form.phone,
        source: form.source,
        organizationId: form.organizationId,
        priority: form.priority,
        status: form.status,
        assignedTo: form.assignedTo,
        email: form.email,
        alternatePhone: form.alternatePhone,
        company: form.company,
        position: form.position,
        industry: form.industry,
        location: form.location,
        pincode: form.pincode,
        notes: form.notes,
        lastContacted: form.lastContacted
          ? new Date(form.lastContacted)
          : undefined,
        nextFollowUp: form.nextFollowUp ? parseLocalDateTime(form.nextFollowUp) : undefined,
        interestedIn: form.interestedIn
          ? form.interestedIn.split(",").map((s) => s.trim())
          : [],
        tags: form.tags ? form.tags.split(",").map((s) => s.trim()) : [],
        createdBy: form.createdBy,
        attachments: form.attachments
          ? form.attachments.split(",").map((s) => s.trim())
          : [],
        conversionScore: form.conversionScore
          ? Number(form.conversionScore)
          : undefined,
      };
    }
    try {
      setSaving(true);
      const res = await execute({ method, endpoint, data: payload });
      toast.success("Lead updated successfully");
      onSubmit && onSubmit(res || { ...data, ...payload });
      onClose && onClose();
    } catch (err) {
      toast.error(
        err?.message || err?.response?.data?.message || "Failed to update lead"
      );
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop with blur effect */}
        <div
          className="absolute inset-0 transition-opacity"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px) brightness(0.8)',
            WebkitBackdropFilter: 'blur(10px) brightness(0.8)'
          }}
        ></div>
        <div className="bg-white rounded-xl p-8">
          {loading ? "Loading..." : "No data"}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      {/* Backdrop with blur effect */}
      <div
        className="absolute inset-0 transition-opacity"
        onClick={onClose}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px) brightness(0.8)',
          WebkitBackdropFilter: 'blur(10px) brightness(0.8)'
        }}
      ></div>
      <div
        className="bg-white rounded-3xl shadow-2xl border border-gray-200 w-full max-w-4xl mx-4 py-0 px-0 relative flex flex-col"
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex items-center justify-between px-8 pt-8 pb-4 border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center gap-3 min-w-0">
            <FaUserEdit className="text-[#16A34A] text-2xl flex-shrink-0" />
            <div className="flex items-center gap-4 min-w-0">
              <h2 className="text-2xl font-extrabold text-[#222] truncate">Edit Lead</h2>
              <div className="text-base text-gray-700 truncate flex items-center gap-2">
                {form?.name ? (
                  <span className="font-semibold text-[#111]">{form.name}</span>
                ) : (
                  <span className="italic">Unnamed Lead</span>
                )}
                {form?.phone ? (
                  <span className="text-gray-400"> &nbsp;•&nbsp; {form.phone}</span>
                ) : null}
              </div>
            </div>
          </div>
          <button
            className="text-gray-400 hover:text-[#222] text-3xl font-bold transition"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="overflow-y-auto px-8 py-8 flex-1">
          <form ref={formRef} onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {role !== "telecaller" && (
                <div className="bg-[#FFFDEB] rounded-xl border border-[#FFD700] shadow p-6 mb-2">
                  <h3 className="text-lg font-bold text-[#222] mb-4">
                    Personal Info
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        htmlFor="name_input"
                        className="font-semibold text-[#222]"
                      >
                        Name
                      </label>
                      <input
                        id="name_input"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone_input"
                        className="font-semibold text-[#222]"
                      >
                        Phone
                      </label>
                      <input
                        id="phone_input"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email_input"
                        className="font-semibold text-[#222]"
                      >
                        Email
                      </label>
                      <input
                        id="email_input"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="altphone_input"
                        className="font-semibold text-[#222]"
                      >
                        Alternate Phone
                      </label>
                      <input
                        id="altphone_input"
                        name="alternatePhone"
                        value={form.alternatePhone}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {role !== "telecaller" && (
                <div className="bg-[#E6F9E5] rounded-xl border border-[#16A34A] shadow p-6 mb-2">
                  <h3 className="text-lg font-bold text-[#222] mb-4">
                    Company / Other
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
              )}

              {role !== "telecaller" && (
                <div className="bg-[#FFFDEB] rounded-xl border border-[#FFD700] shadow p-6 mb-2">
                  <h3 className="text-lg font-bold text-[#222] mb-4">
                    Lead Meta
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label
                        htmlFor="source_input"
                        className="font-semibold text-[#222]"
                      >
                        Source
                      </label>
                      <input
                        id="source_input"
                        name="source"
                        value={form.source}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="priority_select"
                        className="font-semibold text-[#222]"
                      >
                        Priority
                      </label>
                      <select
                        id="priority_select"
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        className="input"
                      >
                        {LeadPriority.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="status_select"
                        className="font-semibold text-[#222]"
                      >
                        Status
                      </label>
                      <select
                        id="status_select"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="input"
                      >
                        {LeadStatus.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="assignedTo_display"
                        className="font-semibold text-[#222]"
                      >
                        Assigned To (Telecaller)
                      </label>
                      <div
                        id="assignedTo_display"
                        className="input bg-gray-100 cursor-default"
                      >
                        {resolveAssignedName(form.assignedTo)}
                      </div>
                      <input
                        type="hidden"
                        name="assignedTo"
                        value={form.assignedTo || ""}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-[#E6F9E5] rounded-xl border border-[#16A34A] shadow p-6 mb-2">
                <h3 className="text-lg font-bold text-[#222] mb-4">
                  Notes & Tags
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    className="input"
                  />
                  <input
                    name="interestedIn"
                    value={form.interestedIn}
                    onChange={(e) =>
                      handleArrayChange("interestedIn", e.target.value)
                    }
                    placeholder="Interested In (comma separated)"
                    className="input"
                  />
                  <input
                    name="tags"
                    value={form.tags}
                    onChange={(e) => handleArrayChange("tags", e.target.value)}
                    placeholder="Tags (comma separated)"
                    className="input"
                  />
                </div>
              </div>
                {role !== "telecaller" ? (
                  <div className="bg-[#FFFDEB] rounded-xl border border-[#FFD700] shadow p-6 mb-2">
                    <h3 className="text-lg font-bold text-[#222] mb-4">
                      Dates & Other
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label
                          htmlFor="lastContacted_input"
                          className="font-semibold text-[#222]"
                        >
                          Last Contacted
                        </label>
                        <input
                          id="lastContacted_input"
                          type="date"
                          name="lastContacted"
                          value={form.lastContacted || ""}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="nextFollowUp_input"
                          className="font-semibold text-[#222]"
                        >
                          Next Follow Up
                        </label>
                        <input
                          id="nextFollowUp_input"
                          type="datetime-local"
                          name="nextFollowUp"
                          value={form.nextFollowUp || ""}
                          onChange={handleChange}
                          className="input"
                          aria-label="Next follow up datetime"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="conversionScore_input"
                          className="font-semibold text-[#222]"
                        >
                          Conversion Score
                        </label>
                        <input
                          id="conversionScore_input"
                          type="number"
                          name="conversionScore"
                          value={form.conversionScore || ""}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="createdBy_input"
                          className="font-semibold text-[#222]"
                        >
                          Created By
                        </label>
                        <input
                          id="createdBy_input"
                          name="createdBy"
                          value={form.createdBy || ""}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="attachments_input"
                          className="font-semibold text-[#222]"
                        >
                          Attachments (comma separated)
                        </label>
                        <input
                          id="attachments_input"
                          name="attachments"
                          value={form.attachments || ""}
                          onChange={(e) =>
                            handleArrayChange("attachments", e.target.value)
                          }
                          className="input"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Telecaller view: compact dates panel so telecallers can schedule follow-ups
                  <div className="bg-[#FFFDEB] rounded-xl border border-[#FFD700] shadow p-4 mb-2 w-full max-w-sm">
                    <h4 className="text-md font-bold text-[#222] mb-2">Dates</h4>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <label className="font-semibold text-[#222] block">Last Contacted</label>
                        <input
                          id="lastContacted_input"
                          type="date"
                          name="lastContacted"
                          value={form.lastContacted || ""}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-[#222] block">Next Follow Up</label>
                        <input
                          id="nextFollowUp_input"
                          type="datetime-local"
                          name="nextFollowUp"
                          value={form.nextFollowUp || ""}
                          onChange={handleChange}
                          className="input"
                          aria-label="Next follow up datetime"
                        />
                      </div>
                    </div>
                  </div>
                )}
            </div>
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
            disabled={saving}
            className="px-8 py-3 bg-[#16A34A] text-white rounded-lg font-bold shadow hover:bg-[#13c24a] transition"
            onClick={() => formRef.current && formRef.current.requestSubmit()}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

        <style>{`
          .input { padding: 14px; width: 100%; border-radius: 10px; border: 1px solid #e5e7eb; background: #f9fafb; font-size: 1rem; margin-bottom: 0.5rem; transition: border 0.2s; }
          .input:focus { border-color: #FFD700; background: #fff; outline: none; }
        `}</style>
      </div>
    </div>
  );
}
