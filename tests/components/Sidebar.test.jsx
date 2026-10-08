import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Sidebar from "@/components/dashboard/sidebar/Sidebar";
import { makeUser } from "../mocks/fixtures";

/*
 * `SidebarLink` calls `usePathname()` to decide which entry is current. Outside a
 * Next.js request there is no router, so it returns `null` and the prefix match
 * on it throws. A controllable stub keeps the active-link logic testable without
 * standing up a router.
 *
 * Mock paths are relative because `jest.mock` resolves through Jest's resolver,
 * which does not read the `jsconfig.json` alias.
 */
let mockPathname = "/dashboard";

jest.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  useParams: () => ({}),
  useSearchParams: () => new URLSearchParams(),
}));

function renderSidebar({ role = "user", isOpen = true, onOpenChange } = {}) {
  const setIsOpen = onOpenChange ?? jest.fn();
  const user = role === null ? undefined : makeUser({ role });
  const utils = render(
    <Sidebar user={user} isOpen={isOpen} setIsOpen={setIsOpen} />,
  );
  return { setIsOpen, user, ...utils };
}

beforeEach(() => {
  mockPathname = "/dashboard";
});

describe("Sidebar", () => {
  describe("role-specific content", () => {
    it("renders the user navigation for a user", () => {
      renderSidebar({ role: "user" });

      expect(screen.getByRole("dialog", { name: "Dashboard navigation" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Overview" })).toHaveAttribute(
        "href",
        "/dashboard/user",
      );
      expect(
        screen.getByRole("link", { name: "Reading List" }),
      ).toBeInTheDocument();
    });

    it.each(["librarian", "admin"])(
      "renders the %s navigation",
      (role) => {
        renderSidebar({ role });

        expect(
          screen.getByRole("dialog", { name: "Dashboard navigation" }),
        ).toBeInTheDocument();
      },
    );

    it("gives each role a different set of links", () => {
      const { unmount } = renderSidebar({ role: "user" });
      const userHrefs = screen
        .getAllByRole("link")
        .map((link) => link.getAttribute("href"));
      unmount();

      renderSidebar({ role: "admin" });
      const adminHrefs = screen
        .getAllByRole("link")
        .map((link) => link.getAttribute("href"));

      expect(userHrefs).not.toEqual(adminHrefs);
    });

    it("renders nothing when there is no user", () => {
      renderSidebar({ role: null });

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("renders nothing for an unrecognised role rather than an empty drawer", () => {
      renderSidebar({ role: "superuser" });

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("dialog semantics", () => {
    it("is named for assistive technology", () => {
      renderSidebar();

      expect(screen.getByRole("dialog")).toHaveAccessibleName("Dashboard navigation");
    });

    it("is modal only while open", () => {
      const { rerender } = renderSidebar({ isOpen: true });
      expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");

      rerender(
        <Sidebar user={makeUser({ role: "user" })} isOpen={false} setIsOpen={jest.fn()} />,
      );

      // On desktop the drawer is permanently pinned, so marking it modal while
      // closed would hide the whole rest of the dashboard from screen readers.
      expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-modal");
    });

    it("is translated off-canvas when closed", () => {
      renderSidebar({ isOpen: false });

      expect(screen.getByRole("dialog").className).toContain("-translate-x-full");
    });

    it("is in place when open", () => {
      renderSidebar({ isOpen: true });

      expect(screen.getByRole("dialog").className).toContain("translate-x-0");
    });

    it("uses the Tailwind spacing scale for its offsets", () => {
      // `top-23` is not a class in the scale, so the drawer used to slide under
      // the sticky navbar.
      renderSidebar();

      const { className } = screen.getByRole("dialog");

      expect(className).toContain("top-16");
      expect(className).toContain("lg:top-[88px]");
      expect(className).not.toMatch(/top-23/);
    });

    it("exposes a stable id for the shell to target", () => {
      renderSidebar();

      expect(screen.getByRole("dialog")).toHaveAttribute("id", "dashboard-sidebar");
    });
  });

  describe("dismissing", () => {
    it("closes when the close button is clicked", async () => {
      const { setIsOpen } = renderSidebar();
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: "Close navigation menu" }));

      expect(setIsOpen).toHaveBeenCalledWith(false);
    });

    it("closes on Escape", async () => {
      const { setIsOpen } = renderSidebar();
      const user = userEvent.setup();

      await user.keyboard("{Escape}");

      expect(setIsOpen).toHaveBeenCalledWith(false);
    });

    it("closes when the backdrop is clicked", async () => {
      const { setIsOpen } = renderSidebar();
      const user = userEvent.setup();

      await user.click(screen.getByTestId("sidebar-backdrop"));

      expect(setIsOpen).toHaveBeenCalledWith(false);
    });

    it("renders no backdrop while closed", () => {
      renderSidebar({ isOpen: false });

      expect(screen.queryByTestId("sidebar-backdrop")).not.toBeInTheDocument();
    });

    it("closes the drawer when a navigation link is chosen", async () => {
      const { setIsOpen } = renderSidebar();
      const user = userEvent.setup();

      await user.click(screen.getAllByRole("link")[0]);

      // `SidebarLayout` clones every link with `closeMobileMenu`, so choosing a
      // destination dismisses the drawer instead of leaving it covering the page
      // it just navigated to.
      expect(setIsOpen).toHaveBeenCalledWith(false);
    });

    it("marks the entry matching the current route as the current page", () => {
      mockPathname = "/dashboard/user";

      renderSidebar();

      const current = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("aria-current") === "page");

      expect(current).toHaveLength(1);
      expect(current[0]).toHaveAttribute("href", "/dashboard/user");
    });

    it("marks a nested route as current via a prefix match", () => {
      mockPathname = "/dashboard/admin/users/42";

      renderSidebar({ role: "admin" });

      const current = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("aria-current") === "page");

      // Exact equality alone left nothing highlighted on any nested page.
      expect(current).toHaveLength(1);
      expect(current[0]).toHaveAttribute("href", "/dashboard/admin/users");
    });

    it("highlights nothing when no entry matches the route", () => {
      mockPathname = "/somewhere-else";

      renderSidebar();

      expect(
        screen
          .getAllByRole("link")
          .filter((link) => link.getAttribute("aria-current") === "page"),
      ).toHaveLength(0);
    });
  });

  describe("focus management", () => {
    it("moves focus to the close button when opened", () => {
      renderSidebar({ isOpen: true });

      expect(
        screen.getByRole("button", { name: "Close navigation menu" }),
      ).toHaveFocus();
    });

    it("leaves focus alone when already closed", () => {
      renderSidebar({ isOpen: false });

      expect(document.activeElement).toBe(document.body);
    });

    it("keeps Tab inside the drawer", async () => {
      const user = userEvent.setup();

      renderSidebar();
      const panel = screen.getByRole("dialog");
      const focusable = panel.querySelectorAll(
        'a[href], button:not([disabled])',
      );

      const last = focusable[focusable.length - 1];
      last.focus();

      await user.tab();

      expect(panel.contains(document.activeElement)).toBe(true);
    });

    it("wraps backwards to the last item on Shift+Tab", async () => {
      const user = userEvent.setup();

      renderSidebar();
      const panel = screen.getByRole("dialog");
      const focusable = panel.querySelectorAll(
        'a[href], button:not([disabled])',
      );

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      first.focus();
      await user.tab({ shift: true });

      expect(last).toHaveFocus();
    });

    it("stops listening for Escape once closed", async () => {
      const { setIsOpen, rerender } = renderSidebar({ isOpen: true });
      const user = userEvent.setup();

      rerender(
        <Sidebar user={makeUser({ role: "user" })} isOpen={false} setIsOpen={setIsOpen} />,
      );
      await user.keyboard("{Escape}");

      expect(setIsOpen).not.toHaveBeenCalled();
    });
  });

  describe("scroll lock", () => {
    it("prevents the page behind the drawer from scrolling", () => {
      const { rerender } = renderSidebar({ isOpen: true });

      expect(document.body.style.overflow).toBe("hidden");

      rerender(
        <Sidebar user={makeUser({ role: "user" })} isOpen={false} setIsOpen={jest.fn()} />,
      );

      expect(document.body.style.overflow).not.toBe("hidden");
    });

    it("restores the previous overflow value rather than clearing it", () => {
      document.body.style.overflow = "auto";

      const { unmount } = renderSidebar({ isOpen: true });
      expect(document.body.style.overflow).toBe("hidden");

      unmount();

      expect(document.body.style.overflow).toBe("auto");
      document.body.style.overflow = "";
    });
  });

  describe("presentation", () => {
    it("hides the close button from assistive tech on desktop only via CSS", () => {
      renderSidebar();

      const closeButton = screen.getByRole("button", {
        name: "Close navigation menu",
      });

      // `lg:hidden` is the real mechanism: the button is always in the
      // accessibility tree, which is what it must be on mobile.
      expect(closeButton.className).toContain("lg:hidden");
    });

    it("hides the close icon from assistive technology", () => {
      renderSidebar();

      const svg = screen
        .getByRole("button", { name: "Close navigation menu" })
        .querySelector("svg");

      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("matches the sidebar width used by the shell's content offset", () => {
      // `w-64` (17rem) against the shell's `lg:pl-72` (18rem) left a visible gap.
      renderSidebar();

      expect(screen.getByRole("dialog").className).toContain("w-64");
    });
  });
});

