import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ReleaseQueue from "@/pages/ReleaseQueue";
import VmiProgramsPage from "@/pages/VmiProgramsPage";

describe("VMI programs", () => {
  it("filters the program list", () => {
    render(
      <MemoryRouter>
        <VmiProgramsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Aldi Northeast Frozen Seafood")).toBeInTheDocument();
    expect(screen.getByText("Kroger Coastal Shrimp")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Search program or customer..."), { target: { value: "Aldi" } });

    expect(screen.getByText("Aldi Northeast Frozen Seafood")).toBeInTheDocument();
    expect(screen.queryByText("Kroger Coastal Shrimp")).not.toBeInTheDocument();
  });

  it("opens a related delivery from a deep link", () => {
    render(
      <MemoryRouter initialEntries={["/release-queue?caseId=aldi-manassas"]}>
        <ReleaseQueue />
      </MemoryRouter>,
    );

    expect(screen.getAllByText("Aldi Inc.")[0]).toBeInTheDocument();
    expect(screen.getByText(/PO #7516245503/)).toBeInTheDocument();
    expect(screen.getByText("3. Decision + Exceptions")).toBeInTheDocument();
  });
});
