import { useMemo, useState } from "react";
import { Bell, Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { VmiProgramTable } from "@/components/vmi/VmiProgramTable";
import { vmiPrograms } from "@/data/vmiProgramsData";

type Filters = {
  customer: string;
  status: string;
  warehouse: string;
  risk: string;
  buyer: string;
  salesOwner: string;
};

const defaultFilters: Filters = {
  customer: "all",
  status: "all",
  warehouse: "all",
  risk: "all",
  buyer: "all",
  salesOwner: "all",
};

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

const VmiProgramsPage = () => {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const options = useMemo(
    () => ({
      customers: unique(vmiPrograms.map((program) => program.customer)),
      statuses: unique(vmiPrograms.map((program) => program.status)),
      warehouses: unique(vmiPrograms.flatMap((program) => program.warehouses)),
      risks: unique(vmiPrograms.map((program) => program.serviceRisk)),
      buyers: unique(vmiPrograms.map((program) => program.buyer)),
      salesOwners: unique(vmiPrograms.map((program) => program.salesOwner)),
    }),
    [],
  );

  const filteredPrograms = useMemo(() => {
    return vmiPrograms.filter((program) => {
      const matchesSearch =
        search === "" ||
        program.programName.toLowerCase().includes(search.toLowerCase()) ||
        program.customer.toLowerCase().includes(search.toLowerCase());

      const matchesCustomer = filters.customer === "all" || program.customer === filters.customer;
      const matchesStatus = filters.status === "all" || program.status === filters.status;
      const matchesWarehouse = filters.warehouse === "all" || program.warehouses.includes(filters.warehouse);
      const matchesRisk = filters.risk === "all" || program.serviceRisk === filters.risk;
      const matchesBuyer = filters.buyer === "all" || program.buyer === filters.buyer;
      const matchesSalesOwner = filters.salesOwner === "all" || program.salesOwner === filters.salesOwner;

      return matchesSearch && matchesCustomer && matchesStatus && matchesWarehouse && matchesRisk && matchesBuyer && matchesSalesOwner;
    });
  }, [filters, search]);

  return (
    <AppLayout>
      <div className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Vendor Managed Inventory</h1>
          </div>
          <button className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-background bg-destructive" />
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-3 shadow-[0_12px_30px_rgba(148,163,184,0.08)]">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search program or customer..."
                className="w-full rounded-lg border border-border bg-secondary py-1.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </div>
              <FilterSelect label="Customer" value={filters.customer} options={options.customers} onChange={(value) => setFilters((current) => ({ ...current, customer: value }))} />
              <FilterSelect label="Status" value={filters.status} options={options.statuses} onChange={(value) => setFilters((current) => ({ ...current, status: value }))} />
              <FilterSelect label="Warehouse" value={filters.warehouse} options={options.warehouses} onChange={(value) => setFilters((current) => ({ ...current, warehouse: value }))} />
              <FilterSelect label="Risk" value={filters.risk} options={options.risks} onChange={(value) => setFilters((current) => ({ ...current, risk: value }))} />
              <FilterSelect label="Buyer" value={filters.buyer} options={options.buyers} onChange={(value) => setFilters((current) => ({ ...current, buyer: value }))} />
              <FilterSelect label="Sales Owner" value={filters.salesOwner} options={options.salesOwners} onChange={(value) => setFilters((current) => ({ ...current, salesOwner: value }))} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-[0_12px_30px_rgba(148,163,184,0.08)]">
          {filteredPrograms.length > 0 ? (
            <VmiProgramTable programs={filteredPrograms} />
          ) : (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-foreground">No programs match the current filters.</p>
              <p className="mt-2 text-sm text-muted-foreground">Adjust search or filters to broaden the program list.</p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const selectedLabel = value === "all" ? "All" : value;

  return (
    <label className="relative flex min-w-[128px] items-center gap-2 rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-sm text-foreground cursor-pointer">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 flex-1 truncate text-foreground">{selectedLabel}</span>
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        <option value="all">All</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

export default VmiProgramsPage;
