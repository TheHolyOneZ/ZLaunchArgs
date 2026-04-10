import { useState } from "react";
import { open, save } from "@tauri-apps/plugin-dialog";
import { Upload, Download, HardDrive, Loader2, CheckCircle } from "lucide-react";
import { useAppStore } from "../../stores/appStore";
import { commands } from "../../services/tauriCommands";
import { useNotifications } from "../../hooks/useNotifications";
export function ImportExport() {
  const [loading, setLoading] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const config = useAppStore((s) => s.config);
  const loadConfig = useAppStore((s) => s.loadConfig);
  const { notifySuccess, notifyError } = useNotifications();
  const flash = (id: string) => {
    setDone(id);
    setTimeout(() => setDone(null), 2000);
  };
  const exportConfig = async () => {
    setLoading("export");
    try {
      const path = await save({ defaultPath: "zlaunchargs_config.json", filters: [{ name: "JSON", extensions: ["json"] }] });
      if (path) { await commands.exportConfig(config, path); notifySuccess("Config exported"); flash("export"); }
    } catch (err) { notifyError(`Export failed: ${err}`); }
    finally { setLoading(null); }
  };
  const importConfig = async () => {
    setLoading("import");
    try {
      const path = await open({ filters: [{ name: "JSON", extensions: ["json"] }], multiple: false });
      if (typeof path === "string") { await commands.importConfig(path); await loadConfig(); notifySuccess("Config imported"); flash("import"); }
    } catch (err) { notifyError(`Import failed: ${err}`); }
    finally { setLoading(null); }
  };
  const backup = async () => {
    setLoading("backup");
    try {
      await commands.createBackup();
      notifySuccess(`Backup saved`);
      flash("backup");
    } catch (err) { notifyError(`Backup failed: ${err}`); }
    finally { setLoading(null); }
  };
  const actions = [
    {
      id: "export",
      icon: <Upload size={18} />,
      label: "Export Config",
      description: "Save your complete config — apps, profiles, arguments, and settings — to a JSON file.",
      onClick: exportConfig,
      color: "#3b82f6",
    },
    {
      id: "import",
      icon: <Download size={18} />,
      label: "Import Config",
      description: "Load a previously exported config file. This will replace your current configuration.",
      onClick: importConfig,
      color: "#8b5cf6",
    },
    {
      id: "backup",
      icon: <HardDrive size={18} />,
      label: "Create Backup",
      description: "Save a timestamped backup to the app data folder for safekeeping.",
      onClick: backup,
      color: "#10b981",
    },
  ];
  return (
    <div className="space-y-3">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={action.onClick}
          disabled={loading !== null}
          className="flex items-center gap-4 w-full p-4 rounded-xl border text-left transition-all duration-150 disabled:opacity-50 group"
          style={{
            background: done === action.id ? `${action.color}08` : "rgba(255,255,255,0.02)",
            borderColor: done === action.id ? `${action.color}30` : "rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150"
            style={{ background: `${action.color}12`, color: action.color }}
          >
            {loading === action.id ? (
              <Loader2 size={16} className="animate-spin" />
            ) : done === action.id ? (
              <CheckCircle size={16} />
            ) : (
              action.icon
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-zinc-200">{action.label}</p>
            <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{action.description}</p>
          </div>
          <span
            className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            style={{ color: action.color }}
          >
            {loading === action.id ? "Working…" : done === action.id ? "Done!" : "→"}
          </span>
        </button>
      ))}
      <div
        className="p-4 rounded-xl border mt-4"
        style={{ background: "rgba(255,255,255,0.01)", borderColor: "rgba(255,255,255,0.05)" }}
      >
        <p className="text-xs font-medium text-zinc-500 mb-1">Current config</p>
        <div className="flex gap-4 text-xs text-zinc-600">
          <span>{config.apps.length} apps</span>
          <span>{config.globalPresets.length} presets</span>
          <span>{config.tags.length} tags</span>
          <span>{config.launchHistory.length} history entries</span>
        </div>
      </div>
    </div>
  );
}
