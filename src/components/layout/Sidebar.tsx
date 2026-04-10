import { useState } from "react";
import { Plus, ScanSearch, Settings, Download, PanelLeftClose, PanelLeftOpen, Star, List, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUiStore } from "../../stores/uiStore";
import { useProcessStore } from "../../stores/processStore";
import { AppList } from "../library/AppList";
import { SearchBar } from "../library/SearchBar";
import { AddAppDialog } from "../library/AddAppDialog";
import { ScanDialog } from "../library/ScanDialog";
export function Sidebar() {
  const [showAddApp, setShowAddApp] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const filterMode = useUiStore((s) => s.filterMode);
  const setFilterMode = useUiStore((s) => s.setFilterMode);
  const navigate = useNavigate();
  const allProcesses = useProcessStore((s) => s.processes);
  const runningCount = allProcesses.filter((p) => p.alive).length;
  if (collapsed) {
    return (
      <div
        className="flex flex-col items-center w-12 py-2 gap-1 shrink-0"
        style={{ background: "var(--surface)", borderRight: "1px solid var(--border-subtle)" }}
      >
        <button
          onClick={toggleSidebar}
          className="p-2 text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.05] rounded-lg transition-all"
          title="Expand sidebar"
        >
          <PanelLeftOpen size={15} />
        </button>
      </div>
    );
  }
  const filters = [
    { mode: "all" as const, icon: <List size={12} />, label: "All" },
    { mode: "favorites" as const, icon: <Star size={12} />, label: "Pinned" },
    { mode: "recent" as const, icon: <Clock size={12} />, label: "Recent" },
    {
      mode: "running" as const,
      icon: (
        <span className="relative flex items-center justify-center w-3 h-3">
          <span className={`w-2 h-2 rounded-full ${runningCount > 0 ? "bg-emerald-500" : "bg-zinc-600"}`} />
          {runningCount > 0 && <span className="running-dot absolute inset-0" />}
        </span>
      ),
      label: "Running",
    },
  ];
  return (
    <div
      className="flex flex-col w-64 shrink-0"
      style={{ background: "var(--surface)", borderRight: "1px solid var(--border-subtle)" }}
    >
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Library</span>
        <button
          onClick={toggleSidebar}
          className="p-1 text-zinc-700 hover:text-zinc-500 rounded transition-colors"
          title="Collapse sidebar"
        >
          <PanelLeftClose size={13} />
        </button>
      </div>
      <div className="px-2 pb-2">
        <SearchBar />
      </div>
      <div className="flex px-2 pb-2 gap-1">
        {filters.map((f) => (
          <button
            key={f.mode}
            onClick={() => setFilterMode(f.mode)}
            className={`flex items-center justify-center gap-1 flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-150 ${
              filterMode === f.mode
                ? "bg-blue-600/15 text-blue-400 border border-blue-500/20"
                : "text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.04] border border-transparent"
            }`}
            title={f.label}
          >
            {f.icon}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto min-h-0 pb-1">
        <AppList />
      </div>
      <div
        className="border-t p-2 grid grid-cols-2 gap-1"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        {[
          { icon: <Plus size={12} />, label: "Add App", onClick: () => setShowAddApp(true) },
          { icon: <ScanSearch size={12} />, label: "Scan", onClick: () => setShowScan(true) },
          { icon: <Settings size={12} />, label: "Settings", onClick: () => navigate("/settings") },
          { icon: <Download size={12} />, label: "Import", onClick: () => navigate("/settings?tab=import") },
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={btn.onClick}
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05] transition-all duration-150"
          >
            {btn.icon}
            {btn.label}
          </button>
        ))}
      </div>
      {showAddApp && <AddAppDialog onClose={() => setShowAddApp(false)} />}
      {showScan && <ScanDialog onClose={() => setShowScan(false)} />}
    </div>
  );
}
