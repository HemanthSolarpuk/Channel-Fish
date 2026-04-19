import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, RefreshCw, Bell } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { ReleaseQueueTable } from "@/components/ReleaseQueueTable";
import { WorkflowDrawer } from "@/components/WorkflowDrawer";
import { releaseCases, type ReleaseCase, type FlowType } from "@/data/releaseQueueData";

type Filter = "all" | FlowType;

const filterTabs: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pickup", label: "Pickup Scheduled" },
  { id: "carrier", label: "Carrier Delivery" },
];

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ReleaseCase | null>(null);

  const counts = useMemo(() => ({
    all: releaseCases.length,
    pickup: releaseCases.filter((c) => c.flowType === "pickup").length,
    carrier: releaseCases.filter((c) => c.flowType === "carrier").length,
  }), []);

  const filtered = useMemo(() => {
    return releaseCases
      .filter((c) => filter === "all" || c.flowType === filter)
      .filter((c) =>
        search === "" ||
        c.customer.toLowerCase().includes(search.toLowerCase()) ||
        c.poNumber.toLowerCase().includes(search.toLowerCase()) ||
        c.shipTo.toLowerCase().includes(search.toLowerCase())
      );
  }, [filter, search]);

  useEffect(() => {
    const caseId = searchParams.get("caseId");
    if (!caseId) {
      setSelected(null);
      return;
    }

    setSelected(releaseCases.find((item) => item.id === caseId) ?? null);
  }, [searchParams]);

  const handleRowClick = (releaseCase: ReleaseCase) => {
    setSelected(releaseCase);
    setSearchParams({ caseId: releaseCase.id });
  };

  const handleClose = () => {
    setSelected(null);
    setSearchParams({});
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Release Workflow Queue</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Click a PO to open the release-to-invoice workflow</p>
          </div>
          <button className="text-muted-foreground hover:text-foreground relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive border-2 border-background" />
          </button>
        </div>

        {/* Filter sub-tabs */}
        <div className="flex items-center gap-1 border-b border-border">
          {filterTabs.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {counts[tab.id]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PO, customer, or destination..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <RefreshCw className="w-4 h-4" />
            Sync Queue
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <ReleaseQueueTable cases={filtered} onRowClick={handleRowClick} />
        </div>
      </div>

      {/* Drawer */}
      <WorkflowDrawer releaseCase={selected} onClose={handleClose} />
    </AppLayout>
  );
};

export default Index;
