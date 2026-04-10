import { useState } from "react";
import { Plus, Copy, Trash2, ChevronDown, Check } from "lucide-react";
import { useAppStore } from "../../stores/appStore";
import type { AppEntry, ArgProfile } from "../../types";
interface ProfileSelectorProps {
  app: AppEntry;
}
export function ProfileSelector({ app }: ProfileSelectorProps) {
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const addProfile = useAppStore((s) => s.addProfile);
  const removeProfile = useAppStore((s) => s.removeProfile);
  const duplicateProfile = useAppStore((s) => s.duplicateProfile);
  const setActiveProfile = useAppStore((s) => s.setActiveProfile);
  const active = app.profiles.find((p) => p.id === app.activeProfileId);
  const createProfile = () => {
    if (!newName.trim()) return;
    const profile: ArgProfile = {
      id: crypto.randomUUID(),
      name: newName.trim(),
      arguments: [],
      envVariables: [],
      createdAt: Date.now(),
    };
    addProfile(app.id, profile);
    setActiveProfile(app.id, profile.id);
    setNewName("");
    setCreating(false);
    setOpen(false);
  };
  return (
    <div className="relative flex items-center gap-1.5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-200 transition-all duration-150 border"
        style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
        {active?.name ?? "No Profile"}
        <ChevronDown size={12} className={`text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <button
        onClick={() => { setCreating(true); setOpen(true); }}
        className="p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05] rounded-lg transition-all duration-150 border border-transparent hover:border-white/[0.06]"
        title="New profile"
      >
        <Plus size={13} />
      </button>
      {active && (
        <button
          onClick={() => duplicateProfile(app.id, active.id)}
          className="p-1.5 text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.05] rounded-lg transition-all duration-150 border border-transparent hover:border-white/[0.06]"
          title="Duplicate profile"
        >
          <Copy size={13} />
        </button>
      )}
      {open && (
        <>
          <div
            className="absolute top-10 left-0 z-20 min-w-48 rounded-xl border shadow-2xl shadow-black/60 py-1.5 animate-slide-down"
            style={{ background: "#1c1c1f", borderColor: "rgba(255,255,255,0.1)" }}
          >
            {app.profiles.map((p) => (
              <div
                key={p.id}
                className={`group flex items-center justify-between px-3 py-2 cursor-pointer transition-colors rounded-lg mx-1 ${
                  p.id === app.activeProfileId
                    ? "bg-blue-600/10 text-blue-300"
                    : "text-zinc-300 hover:bg-white/[0.06]"
                }`}
                onClick={() => { setActiveProfile(app.id, p.id); setOpen(false); }}
              >
                <div className="flex items-center gap-2">
                  {p.id === app.activeProfileId ? (
                    <Check size={12} className="text-blue-400 shrink-0" />
                  ) : (
                    <span className="w-3 h-3 shrink-0" />
                  )}
                  <span className="text-xs font-medium">{p.name}</span>
                </div>
                {app.profiles.length > 1 && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeProfile(app.id, p.id); }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-zinc-600 hover:text-red-400 transition-all rounded"
                  >
                    <Trash2 size={11} />
                  </button>
                )}
              </div>
            ))}
            {creating && (
              <div className="px-2 pt-1 pb-1.5 border-t mt-1" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <input
                  autoFocus
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") createProfile();
                    if (e.key === "Escape") { setCreating(false); setNewName(""); if (!app.profiles.length) setOpen(false); }
                  }}
                  onBlur={() => { if (!newName.trim()) { setCreating(false); } }}
                  placeholder="Profile name…"
                  className="w-full bg-zinc-800 border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/40 transition-colors"
                />
              </div>
            )}
          </div>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
        </>
      )}
    </div>
  );
}
