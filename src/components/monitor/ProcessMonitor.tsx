import { Activity, OctagonX } from "lucide-react";
import { useProcessStore } from "../../stores/processStore";
import { commands } from "../../services/tauriCommands";
import { useNotifications } from "../../hooks/useNotifications";
function formatUptime(secs: number): string {
  if (secs < 60) return `${secs}s`;
  if (secs < 3600) return `${Math.floor(secs / 60)}m ${secs % 60}s`;
  return `${Math.floor(secs / 3600)}h ${Math.floor((secs % 3600) / 60)}m`;
}
export function ProcessMonitor() {
  const allProcesses = useProcessStore((s) => s.processes);
  const processes = allProcesses.filter((p) => p.alive);
  const removeProcess = useProcessStore((s) => s.removeProcess);
  const { notifySuccess, notifyError } = useNotifications();
  const kill = async (pid: number, name: string) => {
    try {
      await commands.killProcess(pid);
      removeProcess(pid);
      notifySuccess(`Terminated ${name}`);
    } catch (err) {
      notifyError(`Failed to kill process: ${err}`);
    }
  };
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2.5">
        <Activity size={12} className="text-zinc-600" />
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Running</span>
        {processes.length > 0 && (
          <span
            className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(16,185,129,0.1)", color: "#10b981" }}
          >
            {processes.length}
          </span>
        )}
      </div>
      {processes.length === 0 ? (
        <div className="py-3 text-center">
          <p className="text-[11px] text-zinc-700">No running processes</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {processes.map((p) => (
            <div
              key={p.pid}
              className="group flex items-center gap-2.5 px-2.5 py-2 rounded-lg border transition-all duration-150"
              style={{ background: "rgba(16,185,129,0.04)", borderColor: "rgba(16,185,129,0.12)" }}
            >
              <span className="relative flex w-2 h-2 shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-500 relative z-10" />
                <span className="running-dot absolute inset-0" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-zinc-300 truncate leading-tight">
                  {p.appName}
                </p>
                <p className="text-[10px] text-zinc-600 font-mono">
                  PID {p.pid} · {formatUptime(p.uptimeSecs)}
                </p>
              </div>
              <button
                onClick={() => kill(p.pid, p.appName)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-150"
                title="Terminate process"
              >
                <OctagonX size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
