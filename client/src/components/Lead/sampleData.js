const sampleData = [
  ...Array(20)
    .fill([
      {
        name: "John Doe",
        phone: "+919876543210",
        source: "Website",
        priority: "High",
        status: "Qualified",
        assignedTo: "688dbb9d734eaea299915626",
        email: "john.doe@example.com",
        company: "Acme Inc",
        position: "CTO",
        notes: "Interested in enterprise solution",
        interestedIn: [],
        tags: ["interested-in-saas"],
        attachments: [],
        createdAt: new Date("2025-08-02T12:38:26.947Z"),
        updatedAt: new Date("2025-08-02T17:17:45.880Z"),
        __v: 2,
        nextFollowUp: new Date("2025-08-03T10:00:00.000Z"),
        assignedTelecallers: "Priya Sharma",
      },
      {
        name: "Jane Smith",
        phone: "+919876543211",
        source: "Referral",
        priority: "Medium",
        status: "Contacted",
        assignedTo: "688dbb9d734eaea299915627",
        email: "jane.smith@example.com",
        company: "Beta Corp",
        position: "CEO",
        notes: "Looking for a demo",
        interestedIn: ["CRM"],
        tags: ["demo-request"],
        attachments: [],
        createdAt: new Date("2025-08-01T10:00:00.000Z"),
        updatedAt: new Date("2025-08-02T15:00:00.000Z"),
        __v: 1,
        nextFollowUp: new Date("2025-08-04T11:00:00.000Z"),
        assignedTelecallers: "Rahul Verma",
      },
    ])
    .flat(),
];

export default sampleData;
