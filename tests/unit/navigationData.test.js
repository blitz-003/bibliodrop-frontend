import { getRoleLinks, getRoleTitle, ROLE_TITLES } from "@/lib/navigationData";

const ROLES = ["user", "librarian", "admin"];

describe("role navigation data", () => {
  describe("getRoleTitle", () => {
    it.each(ROLES)("returns a title for the %s role", (role) => {
      expect(getRoleTitle(role)).toBe(ROLE_TITLES[role]);
    });

    it("returns an empty string for an unknown role", () => {
      // An empty string, not `undefined`: the value is rendered directly as a
      // heading by the dashboard sidebar.
      expect(getRoleTitle("moderator")).toBe("");
      expect(getRoleTitle(undefined)).toBe("");
    });
  });

  describe("getRoleLinks", () => {
    it.each(ROLES)("returns a non-empty link list for %s", (role) => {
      expect(getRoleLinks(role).length).toBeGreaterThan(0);
    });

    it("returns an empty array for an unknown role", () => {
      expect(getRoleLinks("moderator")).toEqual([]);
      expect(getRoleLinks(undefined)).toEqual([]);
    });

    it.each(ROLES)("gives every %s link a label, an href and an icon", (role) => {
      for (const link of getRoleLinks(role)) {
        expect(typeof link.label).toBe("string");
        expect(link.label.length).toBeGreaterThan(0);
        expect(link.href).toMatch(/^\/dashboard/);
        expect(link.icon).toBeDefined();
      }
    });

    it("keeps every role's links inside that role's own dashboard subtree", () => {
      const prefixes = {
        user: "/dashboard/user",
        librarian: "/dashboard/librarian",
        admin: "/dashboard/admin",
      };

      for (const role of ROLES) {
        for (const link of getRoleLinks(role)) {
          expect(link.href.startsWith(prefixes[role])).toBe(true);
        }
      }
    });

    it("returns distinct hrefs within a role", () => {
      for (const role of ROLES) {
        const hrefs = getRoleLinks(role).map((l) => l.href);
        expect(new Set(hrefs).size).toBe(hrefs.length);
      }
    });

    it("does not leak one role's links into another role's list", () => {
      const adminHrefs = getRoleLinks("admin").map((l) => l.href);

      for (const href of getRoleLinks("user").map((l) => l.href)) {
        expect(adminHrefs).not.toContain(href);
      }
    });

    it("returns a new array each call, so a consumer cannot corrupt the source", () => {
      const first = getRoleLinks("admin");
      first.pop();

      expect(getRoleLinks("admin").length).toBeGreaterThan(1);
    });
  });

  it("covers exactly the three roles the auth layer supports", () => {
    expect(Object.keys(ROLE_TITLES).sort()).toEqual([...ROLES].sort());
  });
});