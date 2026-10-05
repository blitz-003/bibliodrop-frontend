import { ROLE_ROUTES } from "@/lib/auth-role";

describe("ROLE_ROUTES", () => {
  it("maps each role to a dashboard path", () => {
    expect(ROLE_ROUTES).toEqual({
      user: "/dashboard/user",
      librarian: "/dashboard/librarian",
      admin: "/dashboard/admin",
    });
  });

  it("points every role at a distinct route", () => {
    const routes = Object.values(ROLE_ROUTES);

    expect(new Set(routes).size).toBe(routes.length);
  });

  it("uses the same role keys as the session role field", () => {
    // `lib/auth.js` declares `role` with defaultValue "user"; these three are the
    // only values the backend's requireRole() middleware and the dashboard
    // layouts accept.
    expect(Object.keys(ROLE_ROUTES).sort()).toEqual(["admin", "librarian", "user"]);
  });
});