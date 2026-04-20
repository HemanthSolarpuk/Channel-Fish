import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WorkflowDrawer } from "@/components/WorkflowDrawer";
import { releaseCases } from "@/data/releaseQueueData";

vi.mock("recharts", async () => {
  const actual = await vi.importActual<typeof import("recharts")>("recharts");

  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: ReactNode }) => <div style={{ width: 960, height: 320 }}>{children}</div>,
  };
});

describe("WorkflowDrawer", () => {
  it("renders the workflow-only drawer and resets to the first step for a new release", () => {
    const { rerender } = render(<WorkflowDrawer releaseCase={releaseCases[0]} onClose={() => {}} />);

    expect(screen.getByText("1. Existing Order Context")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "VMI Context" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Documents" })).not.toBeInTheDocument();
    expect(screen.getAllByText("Pickup Scheduled").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "Approve pickup mode" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /4\. Pickup Scheduled/i }));
    expect(screen.getByText("4. Pickup Scheduled")).toBeInTheDocument();

    rerender(<WorkflowDrawer releaseCase={releaseCases.find((item) => item.id === "mclane") ?? releaseCases[0]} onClose={() => {}} />);
    expect(screen.getByText("1. Existing Order Context")).toBeInTheDocument();
    expect(screen.queryByText("2. Fulfillment Mode")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve carrier mode" })).toBeInTheDocument();
  });
});
