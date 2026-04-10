import { useState } from "react";
import { ArrowLeft, Package, Sun, Moon, Bell, Keyboard, Trash2, Plus, Monitor } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ImportExport } from "../components/settings/ImportExport";
import { useTheme } from "../hooks/useTheme";
import { useAppStore } from "../stores/appStore";
import type { HotkeyBinding } from "../types";
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative w-10 h-5 rounded-full transition-all duration-200 shrink-0"
      style={{
        background: checked ? "#2563eb" : "var(--elevated)",
        boxShadow: checked ? "0 0 10px rgba(59,130,246,0.35)" : "none",
      }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200"
        style={{ left: checked ? "calc(100% - 18px)" : "2px" }}
      />
    </button>
  );
}
function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div
      className="flex items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-150"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div>
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}
function GeneralTab() {
  const { theme, toggleTheme } = useTheme();
  const settings = useAppStore((s) => s.config.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const themes: { id: "dark" | "light"; icon: React.ReactNode; label: string }[] = [
    { id: "dark", icon: <Moon size={14} />, label: "Dark" },
    { id: "light", icon: <Sun size={14} />, label: "Light" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">Appearance</h3>
        <div
          className="p-4 rounded-xl border"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <p className="text-sm font-medium text-zinc-200 mb-3">Theme</p>
          <div className="flex gap-2">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => theme !== t.id && toggleTheme()}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 border flex-1 justify-center ${
                  theme === t.id
                    ? "text-blue-300 border-blue-500/30"
                    : "text-zinc-500 border-transparent hover:bg-white/[0.04] hover:text-zinc-300"
                }`}
                style={theme === t.id ? { background: "rgba(59,130,246,0.1)" } : {}}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-600 mt-2">
            Currently using <span className="text-zinc-400">{theme}</span> mode
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">System</h3>
        <div className="space-y-2">
          <SettingRow
            label="Minimize to Tray"
            description="Hide the window to the system tray when closed"
          >
            <Toggle
              checked={settings.minimizeToTray}
              onChange={(v) => updateSettings({ minimizeToTray: v })}
            />
          </SettingRow>
          <SettingRow
            label="Auto Backup"
            description="Automatically back up your config at a set interval"
          >
            <Toggle
              checked={settings.autoBackup}
              onChange={(v) => updateSettings({ autoBackup: v })}
            />
          </SettingRow>
          {settings.autoBackup && (
            <div
              className="p-4 rounded-xl border animate-slide-down"
              style={{ background: "var(--card)", borderColor: "var(--border)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-zinc-200">Backup Interval</p>
                <span className="text-xs text-zinc-400 font-medium">
                  {settings.autoBackupInterval < 3600
                    ? `${Math.floor(settings.autoBackupInterval / 60)} minutes`
                    : `${Math.floor(settings.autoBackupInterval / 3600)} hour${Math.floor(settings.autoBackupInterval / 3600) > 1 ? "s" : ""}`}
                </span>
              </div>
              <input
                type="range"
                min={300}
                max={86400}
                step={300}
                value={settings.autoBackupInterval}
                onChange={(e) => updateSettings({ autoBackupInterval: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-zinc-700">5 min</span>
                <span className="text-[10px] text-zinc-700">24 hr</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
function HotkeysTab() {
  const settings = useAppStore((s) => s.config.settings);
  const apps = useAppStore((s) => s.config.apps);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const [recording, setRecording] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [newAppId, setNewAppId] = useState("");
  const [newShortcut, setNewShortcut] = useState("");
  const startRecord = (id: string) => {
    setRecording(id);
    setNewShortcut("");
  };
  const commitRecord = (shortcut: string, id: string) => {
    if (!shortcut) { setRecording(null); return; }
    if (id === "__new__") {
      if (!newAppId) { setRecording(null); return; }
      const binding: HotkeyBinding = { id: crypto.randomUUID(), appId: newAppId, shortcut };
      updateSettings({ hotkeys: [...settings.hotkeys, binding] });
      setAdding(false);
      setNewAppId("");
    } else {
      updateSettings({
        hotkeys: settings.hotkeys.map((h) => h.id === id ? { ...h, shortcut } : h),
      });
    }
    setRecording(null);
    setNewShortcut("");
  };
  const removeHotkey = (id: string) => {
    updateSettings({ hotkeys: settings.hotkeys.filter((h) => h.id !== id) });
  };
  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const parts: string[] = [];
    if (e.ctrlKey) parts.push("Ctrl");
    if (e.altKey) parts.push("Alt");
    if (e.shiftKey) parts.push("Shift");
    if (e.metaKey) parts.push("Meta");
    const key = e.key;
    if (!["Control", "Alt", "Shift", "Meta"].includes(key)) {
      parts.push(key.length === 1 ? key.toUpperCase() : key);
      const shortcut = parts.join("+");
      setNewShortcut(shortcut);
      commitRecord(shortcut, id);
    } else {
      setNewShortcut(parts.join("+") + "+…");
    }
  };
  return (
    <div className="space-y-4">
      <div
        className="flex items-start gap-3 p-4 rounded-xl border"
        style={{ background: "rgba(59,130,246,0.05)", borderColor: "rgba(59,130,246,0.15)" }}
      >
        <Keyboard size={14} className="text-blue-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-blue-300">Global Hotkeys</p>
          <p className="text-xs text-zinc-500 mt-1">
            Bind keyboard shortcuts to launch your apps from anywhere. Click on a shortcut badge to re-record it.
          </p>
        </div>
      </div>
      {settings.hotkeys.length === 0 && !adding ? (
        <div
          className="py-10 text-center rounded-xl border"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.01)" }}
        >
          <Keyboard size={24} className="text-zinc-700 mx-auto mb-2" />
          <p className="text-sm text-zinc-600">No hotkeys configured</p>
          <p className="text-xs text-zinc-700 mt-1">Add a hotkey to quick-launch any app</p>
        </div>
      ) : (
        <div className="space-y-2">
          {settings.hotkeys.map((h) => {
            const app = apps.find((a) => a.id === h.appId);
            return (
              <div
                key={h.id}
                className="flex items-center gap-3 p-3 rounded-xl border"
                style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.07)" }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{app?.name ?? "Unknown App"}</p>
                  <p className="text-xs text-zinc-600 truncate">{app?.executablePath}</p>
                </div>
                <button
                  onClick={() => recording === h.id ? undefined : startRecord(h.id)}
                  onKeyDown={recording === h.id ? (e) => handleKeyDown(e, h.id) : undefined}
                  tabIndex={recording === h.id ? 0 : -1}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-all duration-150 ${
                    recording === h.id
                      ? "text-amber-300 border-amber-500/30 focus:outline-none"
                      : "text-zinc-300 border-white/[0.1] hover:border-blue-500/30 hover:text-blue-300"
                  }`}
                  style={recording === h.id ? { background: "rgba(245,158,11,0.08)" } : { background: "rgba(255,255,255,0.04)" }}
                  autoFocus={recording === h.id}
                >
                  {recording === h.id ? (newShortcut || "Press keys…") : (h.shortcut || "Click to set")}
                </button>
                <button
                  onClick={() => removeHotkey(h.id)}
                  className="p-1.5 text-zinc-700 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {adding && (
        <div
          className="p-4 rounded-xl border space-y-3 animate-slide-down"
          style={{ borderColor: "rgba(59,130,246,0.2)", background: "rgba(59,130,246,0.05)" }}
        >
          <p className="text-sm font-medium text-zinc-200">Add Hotkey</p>
          <div>
            <label className="text-xs text-zinc-500 mb-1.5 block">Application</label>
            <select
              value={newAppId}
              onChange={(e) => setNewAppId(e.target.value)}
              className="w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-blue-500/40 transition-colors"
            >
              <option value="">Select an app…</option>
              {apps.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          {newAppId && (
            <div>
              <label className="text-xs text-zinc-500 mb-1.5 block">Keyboard Shortcut</label>
              <button
                onClick={() => recording === "__new__" ? undefined : startRecord("__new__")}
                onKeyDown={recording === "__new__" ? (e) => handleKeyDown(e, "__new__") : undefined}
                className={`w-full px-3 py-2 rounded-lg text-xs font-mono font-medium border transition-all duration-150 text-center ${
                  recording === "__new__"
                    ? "text-amber-300 border-amber-500/40"
                    : "text-zinc-400 border-white/[0.08] hover:border-blue-500/30 hover:text-blue-300"
                }`}
                style={recording === "__new__" ? { background: "rgba(245,158,11,0.08)" } : { background: "rgba(255,255,255,0.03)" }}
                autoFocus={recording === "__new__"}
                tabIndex={0}
              >
                {recording === "__new__" ? (newShortcut || "Press key combination…") : "Click to record shortcut"}
              </button>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setAdding(false); setNewAppId(""); setRecording(null); setNewShortcut(""); }}
              className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-white/[0.05] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {!adding && (
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl border border-dashed text-xs text-zinc-600 hover:text-zinc-300 hover:border-zinc-600 transition-all duration-150"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <Plus size={13} />
          Add Hotkey Binding
        </button>
      )}
    </div>
  );
}
function NotificationsTab() {
  const settings = useAppStore((s) => s.config.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const notifSettings = (settings as typeof settings & {
    notifyLaunchSuccess?: boolean;
    notifyLaunchFailure?: boolean;
    notifyProcessExit?: boolean;
  });
  const rows = [
    {
      key: "notifyLaunchSuccess",
      label: "Launch Success",
      description: "Show a notification when an app launches successfully",
      default: true,
    },
    {
      key: "notifyLaunchFailure",
      label: "Launch Failure",
      description: "Alert when an app fails to start",
      default: true,
    },
    {
      key: "notifyProcessExit",
      label: "Process Exit",
      description: "Notify when a tracked process terminates",
      default: false,
    },
  ] as const;
  return (
    <div className="space-y-4">
      <div
        className="flex items-start gap-3 p-4 rounded-xl border"
        style={{ background: "rgba(16,185,129,0.05)", borderColor: "rgba(16,185,129,0.15)" }}
      >
        <Bell size={14} className="text-emerald-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-emerald-300">Toast Notifications</p>
          <p className="text-xs text-zinc-500 mt-1">
            Notifications appear as toasts in the bottom-right corner. Configure which events trigger them.
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {rows.map((row) => (
          <SettingRow key={row.key} label={row.label} description={row.description}>
            <Toggle
              checked={(notifSettings[row.key as keyof typeof notifSettings] as boolean | undefined) ?? row.default}
              onChange={(v) => updateSettings({ [row.key]: v } as Partial<typeof settings>)}
            />
          </SettingRow>
        ))}
      </div>
      <div
        className="p-4 rounded-xl border"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <p className="text-xs font-medium text-zinc-400 mb-3">Preview</p>
        <div className="space-y-2">
          {[
            { type: "success", color: "#10b981", label: "Launched game.exe (PID: 4821)" },
            { type: "error", color: "#ef4444", label: "Failed to launch: Access denied" },
            { type: "info", color: "#3b82f6", label: "Config saved automatically" },
          ].map((n) => (
            <div
              key={n.type}
              className="flex items-center gap-3 px-3 py-2 rounded-lg border"
              style={{ background: "rgba(255,255,255,0.03)", borderColor: `${n.color}25` }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: n.color }} />
              <span className="text-xs text-zinc-400">{n.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export function SettingsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "general";
  const tabs = [
    { id: "general", label: "General", icon: <Monitor size={13} /> },
    { id: "import", label: "Import / Export", icon: <Package size={13} /> },
    { id: "hotkeys", label: "Hotkeys", icon: <Keyboard size={13} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={13} /> },
  ];
  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <div
        className="w-52 shrink-0 flex flex-col"
        style={{ background: "var(--surface)", borderRight: "1px solid var(--border-subtle)" }}
      >
        <div className="p-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <ArrowLeft size={12} />
            Back to Library
          </button>
        </div>
        <div className="p-1.5">
          <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest px-2.5 py-2">
            Settings
          </p>
          <nav className="space-y-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(`/settings?tab=${tab.id}`)}
                className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                  activeTab === tab.id
                    ? "bg-blue-600/12 text-blue-300 border border-blue-500/20"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.04] border border-transparent"
                }`}
              >
                <span className={activeTab === tab.id ? "text-blue-400" : "text-zinc-600"}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto" style={{ background: "var(--bg)" }}>
        <div className="max-w-xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-base font-semibold text-zinc-100">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-zinc-600 mt-0.5">
              {activeTab === "general" && "Customize the appearance and behavior of ZLaunchArgs"}
              {activeTab === "import" && "Back up, restore, or migrate your configuration"}
              {activeTab === "hotkeys" && "Bind global keyboard shortcuts to launch your apps"}
              {activeTab === "notifications" && "Control which events show toast notifications"}
            </p>
          </div>
          {activeTab === "general" && <GeneralTab />}
          {activeTab === "import" && <ImportExport />}
          {activeTab === "hotkeys" && <HotkeysTab />}
          {activeTab === "notifications" && <NotificationsTab />}
        </div>
      </div>
    </div>
  );
}
