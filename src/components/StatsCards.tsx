import { TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  colorClass: string;
}

function StatsCard({ label, value, subtitle, icon, colorClass }: StatsCardProps) {
  return (
    <div className={`rounded-xl p-4 border border-border bg-card`}>
      <div className="flex items-start justify-between">
        <div>
          <div className={`text-xs font-semibold uppercase tracking-wider ${colorClass}`}>{label}</div>
          <div className="text-2xl font-bold text-foreground mt-1">{value}</div>
          <div className={`text-xs mt-1 ${colorClass}`}>{subtitle}</div>
        </div>
        <div className={`${colorClass}`}>{icon}</div>
      </div>
    </div>
  );
}

export function StatsCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatsCard
        label="Received Today"
        value={4}
        subtitle="↗ +3 from yesterday"
        icon={<TrendingUp className="w-5 h-5" />}
        colorClass="text-info"
      />
      <StatsCard
        label="Pending Review"
        value={3}
        subtitle="— 2 urgent"
        icon={<Clock className="w-5 h-5" />}
        colorClass="text-warning"
      />
      <StatsCard
        label="Verified"
        value={3}
        subtitle="↗ +5 today"
        icon={<CheckCircle className="w-5 h-5" />}
        colorClass="text-success"
      />
      <StatsCard
        label="ERP Failed"
        value={1}
        subtitle="⚠ Needs attention"
        icon={<XCircle className="w-5 h-5" />}
        colorClass="text-destructive"
      />
    </div>
  );
}
