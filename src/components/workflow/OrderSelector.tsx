import type { WorkflowOrder } from "@/data/workflowData";

export function OrderSelector({
  orders,
  selected,
  onSelect,
}: {
  orders: WorkflowOrder[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 bg-muted rounded-lg p-0.5">
      {orders.map((o) => (
        <button
          key={o.id}
          onClick={() => onSelect(o.id)}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            selected === o.id
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
