export const schemas = {
  Booking: {
    type: "object",
    properties: {
      id: { type: "string" },
      serviceId: { type: "string" },
      companyId: { type: "string" },
      userId: { type: "string" },
      datetime: { type: "string", format: "date-time" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
    required: ["id", "serviceId", "companyId", "userId", "datetime"],
  },
  BookingCreate: {
    type: "object",
    required: ["serviceId", "datetime"],
    properties: {
      serviceId: { type: "string", description: "Service ID to book" },
      datetime: { type: "string", format: "date-time", description: "Booking date and time (ISO 8601)" },
    },
  },

  Company: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      settings: { type: "object" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
    required: ["id", "name", "settings"],
  },

  Service: {
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      description: { type: "string" },
      companyId: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
    required: ["id", "name", "description", "companyId"],
  },

  User: {
    type: "object",
    properties: {
      id: { type: "string" },
      email: { type: "string" },
      name: { type: "string" },
      company: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
        },
      },
    },
    required: ["id", "email", "name"],
  },

  Error: {
    type: "object",
    properties: {
      error: {
        type: "object",
        properties: {
          code: { type: "string" },
          message: { type: "string" },
          details: { type: "string" },
        },
      },
    },
    example: {
      error: {
        code: "BOOKING_RULE_VIOLATION",
        message: "Same-day booking not allowed",
      },
    },
  },
};
