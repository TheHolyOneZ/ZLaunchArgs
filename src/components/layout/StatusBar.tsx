import { useAppStore } from "../../stores/appStore";
import { useProcessStore } from "../../stores/processStore";
export function StatusBar() {
  const apps = useAppStore((s) => s.config.apps);
  const saving = useAppStore((s) => s.saving);
  const allProcesses = useProcessStore((s) => s.processes);
  const running = allProcesses.filter((p) => p.alive).length;
  return (
    <div
      className="flex items-center justify-between h-6 px-4 shrink-0 select-none"
      style={{
        background: "var(--bg)",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-[10px] text-zinc-600">
          {apps.length} {apps.length === 1 ? "app" : "apps"} loaded
        </span>
        {running > 0 && (
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-500">
            <span className="relative inline-flex w-1.5 h-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 relative z-10" />
              <span className="running-dot absolute inset-0" />
            </span>
            {running} running
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {saving && (
          <span className="text-[10px] text-zinc-600 animate-pulse">
            Saving…
          </span>
        )}
        <span className="text-[10px] text-zinc-700">ZLaunchArgs v0.1.0</span>
      </div>
    </div>
  );
}
