import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Settings, Menu, GitBranchPlus } from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: LayoutGrid, label: "Document Queue", path: "/" },
  { icon: GitBranchPlus, label: "Release Workflow", path: "/release-queue" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export function AppSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className="flex flex-col h-full bg-sidebar border-r border-sidebar-border"
      style={{ width: collapsed ? 64 : 220, transition: "width 0.2s" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
          <LayoutGrid className="w-4 h-4 text-primary-foreground" />
        </div>
        {!collapsed && <span className="font-semibold text-sidebar-accent-foreground text-sm">Ubik Intake</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-sidebar-foreground hover:text-sidebar-accent-foreground">
          <Menu className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-sidebar-border flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold text-primary">
            RS
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-sidebar-accent-foreground truncate">Rini S.</div>
            <div className="text-xs text-sidebar-foreground truncate">Operations</div>
          </div>
        </div>
      )}
    </aside>
  );
}
