import { useState } from "react";
import { Trash2, Edit3, Check, X, AlertTriangle } from "lucide-react";
import { useAppStore } from "../../stores/appStore";
import type { Argument } from "../../types";
interface ArgToggleRowProps {
  arg: Argument;
  appId: string;
  profileId: string;
}
function looksInvalid(value: string): boolean {
  const t = value.trim();
  if (!t || t.startsWith("-") || t.startsWith("/") || t.includes("=")) return false;
  if (!t.includes(" ") && t.length < 40) return true;
  return false;
}
export function ArgToggleRow({ arg, appId, profileId }: ArgToggleRowProps) {
  const [editing, setEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(arg.label);
  const [editValue, setEditValue] = useState(arg.value);
  const updateArgument = useAppStore((s) => s.updateArgument);
  const removeArgument = useAppStore((s) => s.removeArgument);
  const commitEdit = () => {
    updateArgument(appId, profileId, arg.id, {
      label: editLabel.trim() || editValue.trim(),
      value: editValue.trim(),
    });
    setEditing(false);
  };
  const cancelEdit = () => {
    setEditLabel(arg.label);
    setEditValue(arg.value);
    setEditing(false);
  };
  const warn = looksInvalid(arg.value);
  if (editing) {
    return (
      <div
        className="flex items-start gap-2 px-3 py-2.5 mx-1 rounded-lg border animate-fade-in"
        style={{ background: "rgba(59,130,246,0.05)", borderColor: "rgba(59,130,246,0.2)" }}
      >
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          <input
            autoFocus
            type="text"
            value={editLabel}
            onChange={(e) => setEditLabel(e.target.value)}
            placeholder="Display label"
            className="w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/40 transition-colors"
          />
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") commitEdit(); if (e.key === "Escape") cancelEdit(); }}
            placeholder="--flag or -v value"
            className="w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs font-mono text-blue-300 placeholder-zinc-600 focus:outline-none focus:border-blue-500/40 transition-colors"
          />
        </div>
        <div className="flex gap-1 mt-0.5">
          <button onClick={commitEdit} className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors" title="Save">
            <Check size={13} />
          </button>
          <button onClick={cancelEdit} className="p-1.5 text-zinc-500 hover:bg-zinc-700 rounded-lg transition-colors" title="Cancel">
            <X size={13} />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`group flex items-center gap-3 px-3 py-2 mx-1 rounded-lg transition-all duration-150 ${
        arg.enabled ? "hover:bg-white/[0.03]" : "opacity-40 hover:opacity-60"
      }`}
    >
      <button
        onClick={() => updateArgument(appId, profileId, arg.id, { enabled: !arg.enabled })}
        className="shrink-0 relative w-8 h-4 rounded-full transition-all duration-200"
        style={{
          background: arg.enabled ? "#2563eb" : "var(--elevated)",
          boxShadow: arg.enabled ? "0 0 8px rgba(59,130,246,0.4)" : "none",
        }}
      >
        <span
          className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-all duration-200"
          style={{ left: arg.enabled ? "calc(100% - 14px)" : "2px" }}
        />
      </button>
      <div className="flex-1 min-w-0">
        <span className={`text-xs font-medium block truncate leading-tight ${arg.enabled ? "text-zinc-200" : "text-zinc-500"}`}>
          {arg.label}
        </span>
        {arg.value !== arg.label && (
          <span className="text-[10px] font-mono text-zinc-600 block truncate">
            {arg.value}
          </span>
        )}
      </div>
      {warn && (
        <span title="Value may be missing a dash prefix" className="shrink-0">
          <AlertTriangle size={11} className="text-amber-500" />
        </span>
      )}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] rounded-lg transition-colors"
          title="Edit"
        >
          <Edit3 size={11} />
        </button>
        <button
          onClick={() => removeArgument(appId, profileId, arg.id)}
          className="p-1.5 text-zinc-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Remove"
        >
          <Trash2 size={11} />
        </button>
      </div>
    </div>
  );
}
