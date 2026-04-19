import { cn } from "@/lib/utils";

export type ProgramWorkspaceTab = "overview" | "inventory" | "demand" | "inbound" | "deliveries" | "exceptions" | "finance";

interface TabItem {
  id: ProgramWorkspaceTab;
  label: string;
  badge?: number;
}

const tabItems: TabItem[] = [
  { id: "overview", label: "Overview" },
  { id: "inventory", label: "Inventory" },
  { id: "demand", label: "Demand" },
  { id: "inbound", label: "Inbound" },
  { id: "deliveries", label: "Deliveries" },
  { id: "exceptions", label: "Exceptions" },
  { id: "finance", label: "Finance" },
];

export function VmiProgramTabs({
  activeTab,
  onChange,
  exceptionCount,
}: {
  activeTab: ProgramWorkspaceTab;
  onChange: (tab: ProgramWorkspaceTab) => void;
  exceptionCount: number;
}) {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-1 rounded-xl border border-border bg-card/95 p-1.5 shadow-[0_12px_24px_rgba(148,163,184,0.08)] backdrop-blur">
        {tabItems.map((tab) => {
          const isActive = tab.id === activeTab;
          const badge = tab.id === "exceptions" ? exceptionCount : undefined;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {tab.label}
              {badge ? (
                <span
                  className={cn(
                    "inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                    isActive ? "bg-white/20 text-white" : "bg-destructive/10 text-destructive",
                  )}
                >
                  {badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
