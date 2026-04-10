import { useState } from "react";
import { ChevronDown, Plus, Zap } from "lucide-react";
import { ArgToggleRow } from "./ArgToggleRow";
import { useAppStore } from "../../stores/appStore";
import type { ArgCategory, Argument, ArgProfile, AppEntry } from "../../types";
import type { PresetTemplate } from "../../types";
interface ArgSectionProps {
  app: AppEntry;
  profile: ArgProfile;
  category: ArgCategory;
  icon: React.ReactNode;
  label: string;
  presets: PresetTemplate[];
  accentColor?: string;
}
export function ArgSection({ app, profile, category, icon, label, presets, accentColor = "#3b82f6" }: ArgSectionProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [customVal, setCustomVal] = useState("");
  const addArgument = useAppStore((s) => s.addArgument);
  const args = profile.arguments
    .filter((a) => a.category === category)
    .sort((a, b) => a.order - b.order);
  const enabledCount = args.filter((a) => a.enabled).length;
  const addCustom = () => {
    if (!customVal.trim()) return;
    const arg: Argument = {
      id: crypto.randomUUID(),
      label: customVal.trim(),
      value: customVal.trim(),
      enabled: true,
      category,
      order: profile.arguments.filter((a) => a.category === category).length,
    };
    addArgument(app.id, profile.id, arg);
    setCustomVal("");
  };
  const addPreset = (preset: PresetTemplate) => {
    if (profile.arguments.some((a) => a.value === preset.value)) return;
    const arg: Argument = {
      id: crypto.randomUUID(),
      label: preset.label,
      value: preset.value,
      enabled: true,
      category,
      order: profile.arguments.filter((a) => a.category === category).length,
    };
    addArgument(app.id, profile.id, arg);
    setShowPresets(false);
  };
  return (
    <div
      className="rounded-xl border overflow-hidden transition-all duration-150"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="flex items-center gap-2.5 w-full px-4 py-3 text-left transition-colors duration-150"
        style={{ background: "transparent" }}
      >
        <span style={{ color: accentColor }} className="opacity-70">{icon}</span>
        <span className="text-xs font-semibold text-zinc-300 flex-1">{label}</span>
        {args.length > 0 && (
          <div className="flex items-center gap-1.5">
            {enabledCount > 0 && (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                style={{ background: `${accentColor}18`, color: accentColor }}
              >
                {enabledCount} on
              </span>
            )}
            <span className="text-[10px] text-zinc-600">{args.length}</span>
          </div>
        )}
        <ChevronDown
          size={13}
          className={`text-zinc-600 transition-transform duration-200 ${collapsed ? "-rotate-90" : ""}`}
        />
      </button>
      {!collapsed && (
        <div className="border-t" style={{ borderColor: "var(--border-subtle)" }}>
          {args.length > 0 && (
            <div className="py-1">
              {args.map((arg) => (
                <ArgToggleRow key={arg.id} arg={arg} appId={app.id} profileId={profile.id} />
              ))}
            </div>
          )}
          <div className="px-3 pb-3 pt-1 space-y-2">
            {showPresets && presets.length > 0 && (
              <div
                className="flex flex-wrap gap-1.5 py-2.5 px-1 rounded-lg border animate-slide-down"
                style={{ background: "var(--elevated)", borderColor: "var(--border-subtle)" }}
              >
                {presets.map((preset) => {
                  const exists = profile.arguments.some((a) => a.value === preset.value);
                  return (
                    <button
                      key={preset.value}
                      onClick={() => addPreset(preset)}
                      disabled={exists}
                      className="px-2.5 py-1 rounded-full text-xs transition-all duration-150 font-mono"
                      style={
                        exists
                          ? { background: "rgba(255,255,255,0.04)", color: "#52525b", cursor: "not-allowed" }
                          : { background: `${accentColor}14`, color: accentColor, border: `1px solid ${accentColor}25` }
                      }
                    >
                      {preset.label}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="flex gap-1.5">
              <input
                type="text"
                value={customVal}
                onChange={(e) => setCustomVal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustom()}
                placeholder="--custom-arg"
                className="flex-1 border rounded-lg px-2.5 py-1.5 text-xs font-mono focus:outline-none transition-all duration-150"
              style={{ background: "var(--elevated)", borderColor: "var(--border)", color: "var(--text-2)" }}
              />
              <button
                onClick={addCustom}
                disabled={!customVal.trim()}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-30 border border-white/[0.06]"
                title="Add argument"
              >
                <Plus size={13} />
              </button>
              {presets.length > 0 && (
                <button
                  onClick={() => setShowPresets((v) => !v)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs transition-all duration-150 border ${
                    showPresets
                      ? "text-blue-300 border-blue-500/30"
                      : "text-zinc-600 hover:text-zinc-300 border-white/[0.06] hover:bg-zinc-800"
                  }`}
                  style={showPresets ? { background: "rgba(59,130,246,0.1)" } : {}}
                  title="Quick presets"
                >
                  <Zap size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
