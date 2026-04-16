import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, RefreshCw, Bell } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { StatsCards } from "@/components/StatsCards";
import { DocumentTable } from "@/components/DocumentTable";
import { mockDocuments } from "@/data/mockDocuments";

const Index = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-foreground">Document Queue</h1>
          <button className="text-muted-foreground hover:text-foreground relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-destructive border-2 border-background" />
          </button>
        </div>

        {/* Stats */}
        <StatsCards />

        {/* Search / Filter bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders, vendors, documents..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary border border-border text-sm text-foreground hover:bg-accent transition-colors">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity ml-auto">
            <RefreshCw className="w-4 h-4" />
            Sync Inbox
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <DocumentTable
            documents={mockDocuments}
            onRowClick={(doc) => navigate(`/document/${doc.id}`)}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
