import { render, screen, within } from "@testing-library/react";

import DataTable, {
  DataTableBody,
  DataTableCell,
  DataTableEmpty,
  DataTableHead,
  DataTableRow,
  DataTableTh,
} from "@/components/ui/DataTable";

function renderTable({ rows = 2, empty = false } = {}) {
  return render(
    <DataTable>
      <DataTableHead>
        <tr>
          <DataTableTh>Email</DataTableTh>
          <DataTableTh align="right">Role</DataTableTh>
        </tr>
      </DataTableHead>

      <DataTableBody>
        {empty ? (
          <DataTableEmpty colSpan={2}>No users found</DataTableEmpty>
        ) : (
          Array.from({ length: rows }, (_, i) => (
            <DataTableRow key={i}>
              <DataTableCell>{`user${i}@bibliodrop.test`}</DataTableCell>
              <DataTableCell align="right">user</DataTableCell>
            </DataTableRow>
          ))
        )}
      </DataTableBody>
    </DataTable>,
  );
}

describe("DataTable", () => {
  it("renders a real table with the given headers", () => {
    renderTable();

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Email" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Role" })).toBeInTheDocument();
  });

  it("marks every header cell as a column header for screen readers", () => {
    renderTable();

    for (const header of screen.getAllByRole("columnheader")) {
      expect(header).toHaveAttribute("scope", "col");
    }
  });

  it("renders one row per record", () => {
    renderTable({ rows: 3 });

    // Includes the header row.
    expect(screen.getAllByRole("row")).toHaveLength(4);
  });

  it("aligns header and cell content independently", () => {
    renderTable();

    expect(screen.getByRole("columnheader", { name: "Role" }).className).toContain(
      "text-right",
    );
    expect(screen.getByRole("columnheader", { name: "Email" }).className).not.toContain(
      "text-center",
    );
  });

  it("spans the empty message across the whole table", () => {
    renderTable({ empty: true });

    const cell = screen.getByRole("cell", { name: "No users found" });

    expect(cell).toHaveAttribute("colspan", "2");
  });

  it("keeps the header visible above an empty body", () => {
    renderTable({ empty: true });

    const table = screen.getByRole("table");

    expect(within(table).getByRole("columnheader", { name: "Email" })).toBeInTheDocument();
  });

  it("wraps the table in a horizontally scrollable container", () => {
    // Narrow viewports previously clipped columns instead of scrolling them.
    const { container } = renderTable();

    expect(container.firstChild.className).toContain("overflow-x-auto");
  });

  it("reserves a minimum table width so columns are not crushed", () => {
    const { container } = renderTable();

    expect(container.querySelector("table").className).toContain("min-w-[640px]");
  });

  it("accepts a custom minimum width", () => {
    const { container } = render(
      <DataTable minWidth="min-w-[900px]">
        <DataTableBody>
          <DataTableRow>
            <DataTableCell>Only row</DataTableCell>
          </DataTableRow>
        </DataTableBody>
      </DataTable>,
    );

    expect(container.querySelector("table").className).toContain("min-w-[900px]");
  });

  it("always resolves a real border colour rather than currentColor", () => {
    const { container } = renderTable();

    expect(container.firstChild.className).toContain("border-border");
  });
});