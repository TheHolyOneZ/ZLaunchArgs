import { create } from "zustand";
import type { RunningProcess } from "../types";
interface ProcessState {
  processes: RunningProcess[];
  setProcesses: (processes: RunningProcess[]) => void;
  removeProcess: (pid: number) => void;
}
export const useProcessStore = create<ProcessState>((set) => ({
  processes: [],
  setProcesses: (processes) => set({ processes }),
  removeProcess: (pid) =>
    set((s) => ({ processes: s.processes.filter((p) => p.pid !== pid) })),
}));
