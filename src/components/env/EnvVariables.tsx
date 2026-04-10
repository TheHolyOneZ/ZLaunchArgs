import { useState } from "react";
import { Plus, Trash2, Edit3, Check, X, FlaskConical, ChevronDown } from "lucide-react";
import { useAppStore } from "../../stores/appStore";
import type { AppEntry, ArgProfile, EnvVariable } from "../../types";
interface EnvVariablesProps {
  app: AppEntry;
  profile: ArgProfile;
}
export function EnvVariables({ app, profile }: EnvVariablesProps) {
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editKey, setEditKey] = useState("");
  const [editVal, setEditVal] = useState("");
  const [expanded, setExpanded] = useState(false);
  const addEnvVar = useAppStore((s) => s.addEnvVar);
  const removeEnvVar = useAppStore((s) => s.removeEnvVar);
  const updateEnvVar = useAppStore((s) => s.updateEnvVar);
  const add = () => {
    if (!newKey.trim()) return;
    const env: EnvVariable = { id: crypto.randomUUID(), key: newKey.trim(), value: newVal.trim(), enabled: true };
    addEnvVar(app.id, profile.id, env);
    setNewKey("");
    setNewVal("");
  };
  const startEdit = (env: EnvVariable) => { setEditingId(env.id); setEditKey(env.key); setEditVal(env.value); };
  const commitEdit = (envId: string) => {
    if (editKey.trim()) updateEnvVar(app.id, profile.id, envId, { key: editKey.trim(), value: editVal.trim() });
    setEditingId(null);
  };
  const count = profile.envVariables.length;
  return (
    <div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 w-full group mb-1"
      >
        <FlaskConical size={12} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider group-hover:text-zinc-400 transition-colors">
          Env Variables
        </span>
        {count > 0 && (
          <span className="text-[10px] text-zinc-600 bg-zinc-800 rounded px-1 py-0.5 ml-1">{count}</span>
        )}
        <ChevronDown
          size={12}
          className={`ml-auto text-zinc-700 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>
      {expanded && (
        <div className="mt-2 space-y-1.5 animate-slide-down">
          {profile.envVariables.map((env) => (
            <div key={env.id}>
              {editingId === env.id ? (
                <div
                  className="flex gap-1.5 p-2 rounded-lg border animate-fade-in"
                  style={{ background: "rgba(139,92,246,0.05)", borderColor: "rgba(139,92,246,0.2)" }}
                >
                  <input
                    autoFocus
                    value={editKey}
                    onChange={(e) => setEditKey(e.target.value)}
                    className="w-24 bg-zinc-800 border border-white/[0.08] rounded px-2 py-1 text-xs font-mono text-violet-300 focus:outline-none focus:border-violet-500/40 transition-colors"
                    placeholder="KEY"
                  />
                  <span className="text-zinc-600 self-center text-xs font-mono">=</span>
                  <input
                    value={editVal}
                    onChange={(e) => setEditVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") commitEdit(env.id); if (e.key === "Escape") setEditingId(null); }}
                    className="flex-1 bg-zinc-800 border border-white/[0.08] rounded px-2 py-1 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500/40 transition-colors"
                    placeholder="value"
                  />
                  <button onClick={() => commitEdit(env.id)} className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded transition-colors">
                    <Check size={12} />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1 text-zinc-500 hover:bg-zinc-700 rounded transition-colors">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div
                  className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-all duration-150"
                  style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <button
                    onClick={() => updateEnvVar(app.id, profile.id, env.id, { enabled: !env.enabled })}
                    className="shrink-0 relative w-7 h-3.5 rounded-full transition-all duration-200"
                    style={{
                      background: env.enabled ? "#7c3aed" : "var(--elevated)",
                      boxShadow: env.enabled ? "0 0 6px rgba(139,92,246,0.4)" : "none",
                    }}
                  >
                    <span
                      className="absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full shadow-sm transition-all duration-200"
                      style={{ left: env.enabled ? "calc(100% - 12px)" : "2px" }}
                    />
                  </button>
                  <span className={`text-xs font-mono truncate flex-1 ${env.enabled ? "" : "opacity-40"}`}>
                    <span className="text-violet-400">{env.key}</span>
                    <span className="text-zinc-600">=</span>
                    <span className="text-emerald-400">{env.value || <span className="text-zinc-700 italic">empty</span>}</span>
                  </span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                    <button onClick={() => startEdit(env)} className="p-1 text-zinc-600 hover:text-zinc-300 rounded transition-colors">
                      <Edit3 size={11} />
                    </button>
                    <button onClick={() => removeEnvVar(app.id, profile.id, env.id)} className="p-1 text-zinc-600 hover:text-red-400 rounded transition-colors">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div
            className="flex gap-1.5 p-2 rounded-lg border"
            style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}
          >
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="KEY"
              className="w-24 bg-zinc-800 border border-white/[0.08] rounded px-2 py-1 text-xs font-mono text-violet-300 placeholder-zinc-700 focus:outline-none focus:border-violet-500/30 transition-colors"
            />
            <span className="text-zinc-700 self-center text-xs font-mono">=</span>
            <input
              value={newVal}
              onChange={(e) => setNewVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="value"
              className="flex-1 bg-zinc-800 border border-white/[0.08] rounded px-2 py-1 text-xs font-mono text-emerald-300 placeholder-zinc-700 focus:outline-none focus:border-emerald-500/30 transition-colors"
            />
            <button
              onClick={add}
              disabled={!newKey.trim()}
              className="p-1.5 bg-zinc-800 hover:bg-zinc-700 rounded text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-30"
              title="Add variable"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
