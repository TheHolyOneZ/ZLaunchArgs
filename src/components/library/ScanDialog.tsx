import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { ScanSearch, FolderOpen, Plus, Gamepad2, Swords, ShoppingBag, Loader2 } from "lucide-react";
import { Modal } from "../shared/Modal";
import { useAppStore } from "../../stores/appStore";
import { useUiStore } from "../../stores/uiStore";
import { commands } from "../../services/tauriCommands";
import type { AppEntry, ArgProfile, DiscoveredApp } from "../../types";
interface ScanDialogProps {
  onClose: () => void;
}
type ScanSource = "steam" | "epic" | "gog" | "directory";
export function ScanDialog({ onClose }: ScanDialogProps) {
  const [scanning, setScanning] = useState(false);
  const [activeSource, setActiveSource] = useState<ScanSource | null>(null);
  const [discovered, setDiscovered] = useState<DiscoveredApp[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customDir, setCustomDir] = useState("");
  const apps = useAppStore((s) => s.config.apps);
  const addApp = useAppStore((s) => s.addApp);
  const setSelectedApp = useUiStore((s) => s.setSelectedApp);
  const scan = async (source: ScanSource) => {
    setScanning(true);
    setActiveSource(source);
    setDiscovered([]);
    setSelected(new Set());
    try {
      let results: DiscoveredApp[] = [];
      if (source === "steam") results = await commands.scanSteamGames();
      else if (source === "epic") results = await commands.scanEpicGames();
      else if (source === "gog") results = await commands.scanGogGames();
      else if (source === "directory" && customDir) results = await commands.scanDirectory(customDir);
      const existing = new Set(apps.map((a) => a.executablePath));
      setDiscovered(results.filter((r) => !existing.has(r.executablePath)));
    } finally {
      setScanning(false);
    }
  };
  const browseDir = async () => {
    const dir = await open({ directory: true, multiple: false });
    if (typeof dir === "string") setCustomDir(dir);
  };
  const toggleSelect = (path: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path); else next.add(path);
      return next;
    });
  };
  const addSelected = () => {
    const toAdd = discovered.filter((d) => selected.has(d.executablePath));
    let offset = apps.length;
    let lastId: string | null = null;
    for (const d of toAdd) {
      const profileId = crypto.randomUUID();
      const profile: ArgProfile = { id: profileId, name: "Default", arguments: [], envVariables: [], createdAt: Date.now() };
      const entry: AppEntry = {
        id: crypto.randomUUID(), name: d.name, executablePath: d.executablePath,
        profiles: [profile], activeProfileId: profileId, tags: [], notes: "",
        favorite: false, order: offset++, addedAt: Date.now(),
        stats: { totalLaunches: 0, totalTime: 0 },
      };
      addApp(entry);
      lastId = entry.id;
    }
    if (lastId) setSelectedApp(lastId);
    onClose();
  };
  const sources = [
    { source: "steam" as const, label: "Steam", icon: <Gamepad2 size={13} />, color: "#1b9cf4" },
    { source: "epic" as const, label: "Epic", icon: <Swords size={13} />, color: "#2a2a2a" },
    { source: "gog" as const, label: "GOG", icon: <ShoppingBag size={13} />, color: "#8b5cf6" },
  ];
  return (
    <Modal title="Auto-Detect Games" onClose={onClose} width="max-w-xl">
      <div className="space-y-4">
        <div className="flex gap-2">
          {sources.map((btn) => (
            <button
              key={btn.source}
              onClick={() => scan(btn.source)}
              disabled={scanning}
              className={`flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-xs font-medium transition-all duration-150 border disabled:opacity-50 ${
                activeSource === btn.source && !scanning
                  ? "border-blue-500/30 text-blue-300"
                  : "border-white/[0.07] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
              style={activeSource === btn.source && !scanning ? { background: "rgba(59,130,246,0.08)" } : { background: "rgba(255,255,255,0.02)" }}
            >
              {scanning && activeSource === btn.source ? <Loader2 size={12} className="animate-spin" /> : btn.icon}
              {btn.label}
            </button>
          ))}
        </div>
        <div
          className="flex gap-2 p-2 rounded-xl border"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <input
            type="text"
            value={customDir}
            onChange={(e) => setCustomDir(e.target.value)}
            placeholder="Custom directory path…"
            className="flex-1 bg-transparent text-xs text-zinc-300 placeholder-zinc-700 focus:outline-none px-2"
          />
          <button onClick={browseDir} className="p-1.5 text-zinc-600 hover:text-zinc-400 rounded-lg transition-colors">
            <FolderOpen size={13} />
          </button>
          <button
            onClick={() => scan("directory")}
            disabled={!customDir || scanning}
            className="flex items-center gap-1 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-300 transition-all disabled:opacity-40 border border-white/[0.06]"
          >
            <ScanSearch size={12} />
            Scan
          </button>
        </div>
        {scanning && (
          <div className="text-center py-8">
            <Loader2 size={20} className="animate-spin text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-600">Scanning for games…</p>
          </div>
        )}
        {!scanning && activeSource && discovered.length === 0 && (
          <div className="text-center py-8">
            <p className="text-sm text-zinc-500">No new games found</p>
            <p className="text-xs text-zinc-700 mt-1">All discovered games are already in your library</p>
          </div>
        )}
        {!scanning && !activeSource && (
          <div className="text-center py-8">
            <Gamepad2 size={24} className="text-zinc-700 mx-auto mb-2" />
            <p className="text-xs text-zinc-600">Select a source to scan for installed games</p>
          </div>
        )}
        {discovered.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs text-zinc-500">{discovered.length} new {discovered.length === 1 ? "game" : "games"} found</span>
              <button
                onClick={() => setSelected(new Set(discovered.map((d) => d.executablePath)))}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Select all
              </button>
            </div>
            <div className="max-h-52 overflow-y-auto space-y-1">
              {discovered.map((d) => (
                <label
                  key={d.executablePath}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 border ${
                    selected.has(d.executablePath)
                      ? "border-blue-500/20"
                      : "border-transparent hover:border-white/[0.06]"
                  }`}
                  style={selected.has(d.executablePath) ? { background: "rgba(59,130,246,0.06)" } : { background: "rgba(255,255,255,0.02)" }}
                >
                  <input
                    type="checkbox"
                    checked={selected.has(d.executablePath)}
                    onChange={() => toggleSelect(d.executablePath)}
                    className="accent-blue-500 w-3.5 h-3.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-200 truncate">{d.name}</p>
                    <p className="text-[10px] text-zinc-600 truncate font-mono">{d.source} · {d.executablePath}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2 justify-end pt-1">
          <button onClick={onClose} className="px-4 py-2 text-sm rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all border border-white/[0.06]">
            Cancel
          </button>
          <button
            onClick={addSelected}
            disabled={selected.size === 0}
            className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-xl text-white font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #3b82f6, #2563eb)", boxShadow: selected.size > 0 ? "0 4px 16px rgba(59,130,246,0.3)" : "none" }}
          >
            <Plus size={13} />
            Add {selected.size > 0 ? `${selected.size} game${selected.size > 1 ? "s" : ""}` : "Selected"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
