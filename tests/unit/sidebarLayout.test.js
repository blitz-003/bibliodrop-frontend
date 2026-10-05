import {
  findActiveHref,
  matchesPath,
} from "@/components/dashboard/sidebar/SidebarLayout";

const HREFS = [
  "/dashboard/admin",
  "/dashboard/admin/users",
  "/dashboard/admin/books",
  "/dashboard/admin/approvals",
];

describe("matchesPath", () => {
  it("matches the exact route", () => {
    expect(matchesPath("/dashboard/admin", "/dashboard/admin")).toBe(true);
  });

  it("matches a nested route", () => {
    expect(matchesPath("/dashboard/admin/users", "/dashboard/admin")).toBe(true);
  });

  it("matches a deeply nested route", () => {
    expect(matchesPath("/dashboard/admin/users/42/edit", "/dashboard/admin")).toBe(
      true,
    );
  });

  it("does not match a sibling that merely shares a prefix string", () => {
    // "/dashboard/administrator" starts with "/dashboard/admin" as a raw string,
    // so the match has to be anchored on a path separator.
    expect(matchesPath("/dashboard/administrator", "/dashboard/admin")).toBe(false);
  });

  it("does not match a different branch", () => {
    expect(matchesPath("/dashboard/user", "/dashboard/admin")).toBe(false);
  });

  it("tolerates a null pathname", () => {
    // `usePathname()` returns null outside a routed render.
    expect(matchesPath(null, "/dashboard/admin")).toBe(false);
  });

  it("tolerates missing arguments", () => {
    expect(matchesPath(undefined, undefined)).toBe(false);
    expect(matchesPath("/dashboard/admin", undefined)).toBe(false);
  });
});

describe("findActiveHref", () => {
  it("returns the exact route when one matches", () => {
    expect(findActiveHref("/dashboard/admin/books", HREFS)).toBe(
      "/dashboard/admin/books",
    );
  });

  it("prefers the most specific route on a nested page", () => {
    // Both "/dashboard/admin" and "/dashboard/admin/users" are prefixes of this
    // path; only the longer one should claim to be current.
    expect(findActiveHref("/dashboard/admin/users/42", HREFS)).toBe(
      "/dashboard/admin/users",
    );
  });

  it("picks a single winner regardless of declaration order", () => {
    expect(
      findActiveHref("/dashboard/admin/users/42", [...HREFS].reverse()),
    ).toBe("/dashboard/admin/users");
  });

  it("falls back to an ancestor when no child matches", () => {
    expect(findActiveHref("/dashboard/admin/transactions", HREFS)).toBe(
      "/dashboard/admin",
    );
  });

  it("returns undefined when nothing matches", () => {
    expect(findActiveHref("/dashboard/user", HREFS)).toBeUndefined();
  });

  it("returns undefined for an empty link set", () => {
    expect(findActiveHref("/dashboard/admin", [])).toBeUndefined();
  });

  it("returns undefined without a pathname", () => {
    expect(findActiveHref(null, HREFS)).toBeUndefined();
  });

  it("never returns two entries for one path", () => {
    const winner = findActiveHref("/dashboard/admin/users/42", HREFS);

    expect(HREFS.filter((href) => matchesPath("/dashboard/admin/users/42", href)))
      .toContain(winner);
  });
});