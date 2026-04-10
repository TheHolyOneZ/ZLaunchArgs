import { useEffect, useRef } from "react";
import { useAppStore } from "../stores/appStore";
import { commands } from "../services/tauriCommands";
export function useAutoBackup() {
  const autoBackup = useAppStore((s) => s.config.settings.autoBackup);
  const autoBackupInterval = useAppStore((s) => s.config.settings.autoBackupInterval);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (!autoBackup) return;
    intervalRef.current = setInterval(() => {
      commands.createBackup().catch(() => {});
    }, autoBackupInterval * 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoBackup, autoBackupInterval]);
}
