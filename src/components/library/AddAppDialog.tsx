import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderOpen, Plus, Loader2 } from "lucide-react";
import { Modal } from "../shared/Modal";
import { useAppStore } from "../../stores/appStore";
import { useUiStore } from "../../stores/uiStore";
import { commands } from "../../services/tauriCommands";
import type { AppEntry, ArgProfile } from "../../types";
interface AddAppDialogProps {
  onClose: () => void;
}
export function AddAppDialog({ onClose }: AddAppDialogProps) {
  const [name, setName] = useState("");
  const [path, setPath] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const addApp = useAppStore((s) => s.addApp);
  const apps = useAppStore((s) => s.config.apps);
  const setSelectedApp = useUiStore((s) => s.setSelectedApp);
  const browse = async () => {
    const selected = await open({
      filters: [{ name: "Executable", extensions: ["exe", "bat", "cmd"] }],
      multiple: false,
    });
    if (typeof selected === "string") {
      setPath(selected);
      setError("");
      if (!name.trim()) {
        const extracted = await commands.extractAppName(selected);
        setName(extracted);
      }
    }
  };
  const submit = async () => {
    if (!path.trim()) { setError("Please select an executable"); return; }
    setLoading(true);
    setError("");
    try {
      const valid = await commands.validateExecutable(path.trim());
      if (!valid) { setError("Executable not found or inaccessible"); return; }
      const displayName = name.trim() || await commands.extractAppName(path.trim());
      const profileId = crypto.randomUUID();
      const defaultProfile: ArgProfile = {
        id: profileId, name: "Default", arguments: [], envVariables: [], createdAt: Date.now(),
      };
      const entry: AppEntry = {
        id: crypto.randomUUID(),
        name: displayName,
        executablePath: path.trim(),
        profiles: [defaultProfile],
        activeProfileId: profileId,
        tags: [], notes: "", favorite: false,
        order: apps.length,
        addedAt: Date.now(),
        stats: { totalLaunches: 0, totalTime: 0 },
      };
      addApp(entry);
      setSelectedApp(entry.id);
      onClose();
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal title="Add Application" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2">Executable Path</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={path}
              onChange={(e) => { setPath(e.target.value); setError(""); }}
              placeholder="C:\Games\MyGame\game.exe"
              className="flex-1 bg-zinc-800/60 border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs font-mono text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-blue-500/40 transition-colors"
            />
            <button
              onClick={browse}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-white/[0.08] text-zinc-300 rounded-xl text-xs font-medium transition-all"
            >
              <FolderOpen size={13} />
              Browse
            </button>
          </div>
          {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-2">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Auto-detected from file name"
            className="w-full bg-zinc-800/60 border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-blue-500/40 transition-colors"
          />
        </div>
        <div
          className="flex items-center gap-3 p-3 rounded-xl border text-xs text-zinc-600"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
          A "Default" launch profile will be created automatically.
        </div>
        <div className="flex gap-2 justify-end pt-1">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all border border-white/[0.06]"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!path.trim() || loading}
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl text-white font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #2563eb)",
              boxShadow: "0 4px 16px rgba(59,130,246,0.3)",
            }}
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
            {loading ? "Adding…" : "Add App"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
