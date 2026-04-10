import { useEffect } from "react";
import { commands } from "../services/tauriCommands";
import { useProcessStore } from "../stores/processStore";
export function useProcessMonitor() {
  const setProcesses = useProcessStore((s) => s.setProcesses);
  useEffect(() => {
    const poll = async () => {
      try {
        const processes = await commands.getRunningProcesses();
        setProcesses(processes);
      } catch {}
    };
    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, [setProcesses]);
}
