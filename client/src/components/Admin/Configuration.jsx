import React, { useState } from "react";

export default function OnboardConfig() {
  const [form, setForm] = useState({
    orgName: "",
    orgAddress: "",
    language: "English",
    timezone: "Asia/Kolkata",
    adminName: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: "",
    telecallers: 1,
    telecallerDetails: [{ name: "", email: "", phone: "", role: "Telecaller" }],
    exotel: {
      virtualNumbers: 1,
      balance: "",
      callVolume: "",
      activeNumbers: 1,
      callDuration: "",
    },
    whatsapp: {
      numbers: 1,
      messageVolume: "",
    },
    cloud: {
      totalStorage: "",
      defaultstorage: "",
      storageurl: "",
    },

    inviteAdmins: "",
    plan: "",
  });
  const [openTelecaller, setOpenTelecaller] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Support nested fields using dot notation
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Organization configured! (Demo)");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-8 font-poppins">
      <h1 className="text-2xl font-bold text-shadow-black mb-8">
        Super Admin Organization Configuration
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Organization Details */}
          <section className="bg-white rounded-xl shadow-lg border p-6">
            <h2 className="text-lg font-bold text-blue-600 mb-4">
              Organization Details
            </h2>
            <input
              name="orgName"
              value={form.orgName}
              onChange={handleChange}
              placeholder="Organization Name"
              className="text-sm input"
            />
            <input
              name="orgAddress"
              value={form.orgAddress}
              onChange={handleChange}
              placeholder="Organization Address"
              className="text-sm input"
            />
            <input
              name="language"
              value={form.language}
              onChange={handleChange}
              placeholder="Preferred Language"
              className="text-sm input"
            />
            <input
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              placeholder="Timezone"
              className="text-sm input"
            />
          </section>

          {/* Admin Details */}
          <section className="bg-white rounded-xl shadow-lg border p-6">
            <h2 className="text-lg font-bold text-purple-600 mb-4">
              Admin Details
            </h2>
            <input
              name="adminName"
              value={form.adminName}
              onChange={handleChange}
              placeholder="Admin Name"
              className="text-sm input"
            />
            <input
              name="adminEmail"
              value={form.adminEmail}
              onChange={handleChange}
              placeholder="Admin Email"
              className="text-sm input"
            />
            <input
              name="adminPhone"
              value={form.adminPhone}
              onChange={handleChange}
              placeholder="Admin Phone"
              className="text-sm input"
            />
            <input
              name="adminPassword"
              type="password"
              value={form.adminPassword}
              onChange={handleChange}
              placeholder="Set Admin Password"
              className="text-sm input"
            />
          </section>

          {/* Telecaller Setup */}
          <section className="bg-white rounded-xl shadow-lg border p-6">
            <h2 className="text-lg font-bold text-green-600 mb-4">
              Telecaller Setup
            </h2>
            <div className="mb-4 flex gap-4 items-center">
              <label className="font-medium">Number of Telecallers:</label>
              <input
                name="telecallers"
                type="number"
                min={1}
                value={form.telecallers}
                onChange={(e) => {
                  const count = Math.max(1, Number(e.target.value));
                  setForm((f) => ({
                    ...f,
                    telecallers: count,
                    telecallerDetails: Array(count)
                      .fill()
                      .map(
                        (_, i) =>
                          f.telecallerDetails[i] || {
                            name: "",
                            email: "",
                            phone: "",
                            role: "Telecaller",
                          }
                      ),
                  }));
                  setOpenTelecaller(null); // Reset open state when count changes
                }}
                className="input w-24"
              />
            </div>
            <div className="space-y-2">
              {form.telecallerDetails.map((tc, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-lg shadow border mb-2"
                >
                  <button
                    type="button"
                    className={`w-full flex justify-between items-center px-4 py-3 font-semibold text-blue-700 focus:outline-none`}
                    onClick={() =>
                      setOpenTelecaller(openTelecaller === idx ? null : idx)
                    }
                  >
                    <span>Telecaller #{idx + 1}</span>
                    <span>
                      {openTelecaller === idx ? (
                        <svg width="20" height="20" fill="none">
                          <path
                            d="M6 8l4 4 4-4"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg width="20" height="20" fill="none">
                          <path
                            d="M6 12l4-4 4 4"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                  </button>
                  {openTelecaller === idx && (
                    <div className="px-4 pb-4 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        name={`telecallerDetails[${idx}].name`}
                        value={tc.name}
                        onChange={(e) => {
                          const updated = [...form.telecallerDetails];
                          updated[idx].name = e.target.value;
                          setForm((f) => ({
                            ...f,
                            telecallerDetails: updated,
                          }));
                        }}
                        placeholder="Name"
                        className="text-sm input"
                      />
                      <input
                        name={`telecallerDetails[${idx}].email`}
                        value={tc.email}
                        onChange={(e) => {
                          const updated = [...form.telecallerDetails];
                          updated[idx].email = e.target.value;
                          setForm((f) => ({
                            ...f,
                            telecallerDetails: updated,
                          }));
                        }}
                        placeholder="Email"
                        className="text-sm input"
                      />
                      <input
                        name={`telecallerDetails[${idx}].phone`}
                        value={tc.phone}
                        onChange={(e) => {
                          const updated = [...form.telecallerDetails];
                          updated[idx].phone = e.target.value;
                          setForm((f) => ({
                            ...f,
                            telecallerDetails: updated,
                          }));
                        }}
                        placeholder="Phone"
                        className="text-sm input"
                      />
                      <select
                        name={`telecallerDetails[${idx}].role`}
                        value={tc.role}
                        onChange={(e) => {
                          const updated = [...form.telecallerDetails];
                          updated[idx].role = e.target.value;
                          setForm((f) => ({
                            ...f,
                            telecallerDetails: updated,
                          }));
                        }}
                        className="text-sm input"
                      >
                        <option value="Telecaller">Telecaller</option>
                        <option value="Supervisor">Supervisor</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Second Row: Integrations & Storage */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Exotel Integration */}
          <section className="bg-white rounded-xl shadow-lg border p-6">
            <h2 className="text-lg font-bold text-blue-600 mb-4">
              Exotel Integration
            </h2>
            <input
              name="exotel.virtualNumbers"
              type="number"
              min={1}
              value={form.exotel.virtualNumbers}
              onChange={handleChange}
              placeholder="Virtual Numbers Required"
              className="text-sm input"
            />
            <input
              name="exotel.balance"
              value={form.exotel.balance}
              onChange={handleChange}
              placeholder="Initial Available Balance"
              className="text-sm input"
            />
            <input
              name="exotel.callVolume"
              value={form.exotel.callVolume}
              onChange={handleChange}
              placeholder="Expected Monthly Call Volume"
              className="text-sm input"
            />
            <input
              name="exotel.activeNumbers"
              type="number"
              min={1}
              value={form.exotel.activeNumbers}
              onChange={handleChange}
              placeholder="Total Active Numbers"
              className="text-sm input"
            />
            <input
              name="exotel.callDuration"
              value={form.exotel.callDuration}
              onChange={handleChange}
              placeholder="Total Call Duration/Month"
              className="text-sm input"
            />
          </section>

          {/* WhatsApp Integration */}
          <section className="bg-white rounded-xl shadow-lg border p-6">
            <h2 className="text-lg font-bold text-green-600 mb-4">
              WhatsApp Integration
            </h2>
            <input
              name="whatsapp.numbers"
              type="number"
              min={1}
              value={form.whatsapp.numbers}
              onChange={handleChange}
              placeholder="WhatsApp Numbers to Activate"
              className="text-sm input"
            />
            <input
              name="whatsapp.messageVolume"
              value={form.whatsapp.messageVolume}
              onChange={handleChange}
              placeholder="Expected Monthly Message Volume"
              className="text-sm input"
            />
          </section>

          {/* Cloud Storage */}
          <section className="bg-white rounded-xl shadow-lg border p-6">
            <h2 className="text-lg font-bold text-indigo-600 mb-4">
              Cloud Storage
            </h2>
            <input
              name="cloud.totalStorage"
              value={form.cloud.totalStorage}
              onChange={handleChange}
              placeholder="Total Storage Required (GB)"
              className="text-sm input"
            />
            <input
              name="cloud.defaultstorage"
              value={form.cloud.defaultstorage}
              onChange={handleChange}
              placeholder="Default Storage (GB)"
              className="text-sm input"
            />
            <input
              name="cloud.storageurl"
              value={form.cloud.storageurl}
              onChange={handleChange}
              placeholder="Storage URL"
              className="text-sm input"
            />
          </section>
        </div>

        {/* Third Row: Plan Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Selection */}
          <section className="bg-white rounded-xl shadow-lg border p-6">
            <h2 className="text-lg font-bold text-gray-700 mb-4">
              Subscription Plan
            </h2>
            <select
              name="plan"
              value={form.plan || ""}
              onChange={(e) => setForm({ ...form, plan: e.target.value })}
              className="text-sm input"
              required
            >
              <option value="" disabled>
                Select your plan
              </option>
              <option value="Starter">Starter</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
              <option value="Enterprise">Enterprise</option>
            </select>
            <div className="mt-2 text-sm text-gray-500">
              Choose the plan that best fits your organization's needs.
            </div>
          </section>
        </div>

        {/* Review & Confirm */}
        <section className="bg-white rounded-xl shadow-lg border p-6 mt-8">
          <h2 className="text-lg font-bold text-blue-700 mb-4">
            Review & Confirm
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-gray-700">
            Please review all your inputs before creating the organization.
          </div>
          <button
            type="submit"
            className="w-2xl bg-[#ff0505b0] text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition shadow-lg text-lg"
          >
            Confirm & Create Organization
          </button>
        </section>
      </form>
      <style>{`
        .input {
          padding: 12px;
          width: 100%;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          font-size: 0.8rem;
          margin-bottom: 0.5rem;
          transition: border 0.2s;
        }
        .input:focus {
          border-color: #3b82f6;
          background: #fff;
          outline: none;
        }
      `}</style>
    </div>
  );
}
