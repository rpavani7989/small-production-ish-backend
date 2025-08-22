const request = require("supertest");
const app = require("../app");
const pgDatabase = require("../config/database");

jest.mock("../config/database"); // prevent hitting real DB

describe("Campaign & Lead API", () => {
  const fakeUser = { id: 1 };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------- CAMPAIGNS ----------
  it("GET /campaigns/:id → should return campaign", async () => {
    pgDatabase.query.mockResolvedValueOnce({
      rows: [{ id: 1, name: "Summer Sale", user_id: 1 }],
    });

    const res = await request(app)
      .get("/api/campaigns/1")
      .set("user", JSON.stringify(fakeUser)); // simulate req.user

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.campaigns[0].name).toBe("Summer Sale");
  });

  // ---------- LEADS ----------
  it("GET /api/leads/:id → should return lead", async () => {
    pgDatabase.query.mockResolvedValueOnce({
      rows: [{ id: 10, name: "John Doe", user_id: 1 }],
    });

    const res = await request(app)
      .get("/api/leads/10")
      .set("user", JSON.stringify(fakeUser));

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.leads[0].name).toBe("John Doe");
  });

  it("GET /api/leads/:id → should return 404 if not found", async () => {
    pgDatabase.query.mockResolvedValueOnce({ rows: [] });

    const res = await request(app)
      .get("/api/leads/999")
      .set("user", JSON.stringify(fakeUser));

    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("GET /api/leads/:id → should handle DB error", async () => {
    pgDatabase.query.mockRejectedValueOnce(new Error("DB failed"));

    const res = await request(app)
      .get("/api/leads/1")
      .set("user", JSON.stringify(fakeUser));

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Server error while fetching lead");
  });
});
