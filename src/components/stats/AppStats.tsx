import { TrendingUp, Clock, Calendar } from "lucide-react";
import type { AppEntry } from "../../types";
interface AppStatsProps {
  app: AppEntry;
}
function formatTime(secs: number): string {
  if (secs === 0) return "—";
  if (secs < 3600) return `${Math.floor(secs / 60)}m`;
  return `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m`;
}
function formatDate(ts?: number): string {
  if (!ts) return "Never";
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}
export function AppStats({ app }: AppStatsProps) {
  const { stats } = app;
  const items = [
    { icon: <TrendingUp size={12} />, value: stats.totalLaunches.toString(), label: "Launches", color: "#3b82f6" },
    { icon: <Clock size={12} />, value: formatTime(stats.totalTime), label: "Runtime", color: "#8b5cf6" },
    { icon: <Calendar size={12} />, value: formatDate(stats.lastLaunched), label: "Last run", color: "#10b981", small: true },
  ];
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <TrendingUp size={12} className="text-zinc-600" />
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Stats</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center py-2.5 px-2 rounded-xl border text-center"
            style={{ background: `${item.color}08`, borderColor: `${item.color}15` }}
          >
            <span style={{ color: item.color }} className="mb-1">{item.icon}</span>
            <p className={`font-semibold text-zinc-200 leading-tight mb-0.5 ${item.small ? "text-[10px]" : "text-sm"}`}>
              {item.value}
            </p>
            <p className="text-[9px] text-zinc-600 uppercase tracking-wide">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
