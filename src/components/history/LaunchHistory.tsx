import { History, Trash2 } from "lucide-react";
import { useAppStore } from "../../stores/appStore";
interface LaunchHistoryProps {
  appId: string | null;
}
function formatTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(ts).toLocaleDateString();
}
export function LaunchHistory({ appId }: LaunchHistoryProps) {
  const history = useAppStore((s) => s.config.launchHistory);
  const clearHistory = useAppStore((s) => s.clearHistory);
  const entries = appId
    ? history.filter((r) => r.appId === appId).slice(0, 8)
    : history.slice(0, 8);
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <History size={12} className="text-zinc-600" />
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
          {appId ? "App History" : "Recent Launches"}
        </span>
        {entries.length > 0 && (
          <button
            onClick={clearHistory}
            className="ml-auto p-1 text-zinc-700 hover:text-zinc-500 rounded transition-colors"
            title="Clear history"
          >
            <Trash2 size={11} />
          </button>
        )}
      </div>
      {entries.length === 0 ? (
        <p className="text-[11px] text-zinc-700 text-center py-3">No launches yet</p>
      ) : (
        <div className="space-y-1">
          {entries.map((r, i) => (
            <div
              key={r.id}
              className="relative flex items-start gap-2.5 px-2.5 py-2 rounded-lg border transition-all duration-150"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}
            >
              {i < entries.length - 1 && (
                <span className="absolute left-[17px] top-8 bottom-0 w-px bg-zinc-800" />
              )}
              <span className="mt-0.5 w-2.5 h-2.5 rounded-full border border-zinc-700 bg-zinc-900 shrink-0 z-10" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-medium text-zinc-300 truncate">
                    {r.appName}
                  </span>
                  <span className="text-[10px] text-zinc-700 shrink-0 font-mono">
                    {formatTime(r.timestamp)}
                  </span>
                </div>
                <span className="text-[10px] text-zinc-600">{r.profileName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
