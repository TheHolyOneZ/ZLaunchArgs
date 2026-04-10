import { useState } from "react";
import { Cpu, Monitor, Bug, Sliders, Star, Tag, FileText, FolderOpen, X } from "lucide-react";
import { ProfileSelector } from "./ProfileSelector";
import { ArgSection } from "./ArgSection";
import { useAppStore } from "../../stores/appStore";
import { TagBadge } from "../shared/TagBadge";
import { GPU_PRESETS, RESOLUTION_PRESETS, DEBUG_PRESETS, TAG_COLORS } from "../../services/presets";
import type { AppEntry, Tag as TagType } from "../../types";
interface ProfilePanelProps {
  app: AppEntry;
}
export function ProfilePanel({ app }: ProfilePanelProps) {
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [notesExpanded, setNotesExpanded] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState<string | null>(null);
  const profile = app.profiles.find((p) => p.id === app.activeProfileId);
  const allTags = useAppStore((s) => s.config.tags);
  const updateApp = useAppStore((s) => s.updateApp);
  const addTag = useAppStore((s) => s.addTag);
  const appTags = allTags.filter((t) => app.tags.includes(t.id));
  const toggleTag = (tagId: string) => {
    const next = app.tags.includes(tagId)
      ? app.tags.filter((t) => t !== tagId)
      : [...app.tags, tagId];
    updateApp(app.id, { tags: next });
  };
  const createTag = (name: string, color: string) => {
    const tag: TagType = { id: crypto.randomUUID(), name, color };
    addTag(tag);
    updateApp(app.id, { tags: [...app.tags, tag.id] });
    setShowTagPicker(false);
    setNewTagName("");
    setNewTagColor(null);
  };
  const filename = app.executablePath.split(/[\\/]/).pop() ?? "";
  const categories = [
    { category: "gpu" as const, icon: <Cpu size={13} />, label: "GPU", presets: GPU_PRESETS, color: "#3b82f6" },
    { category: "resolution" as const, icon: <Monitor size={13} />, label: "Resolution", presets: RESOLUTION_PRESETS, color: "#8b5cf6" },
    { category: "debug" as const, icon: <Bug size={13} />, label: "Debug", presets: DEBUG_PRESETS, color: "#f59e0b" },
    { category: "custom" as const, icon: <Sliders size={13} />, label: "Custom", presets: [], color: "#10b981" },
  ];
  return (
    <div className="max-w-2xl mx-auto px-5 py-5 space-y-4">
      <div
        className="rounded-xl border p-4"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-semibold text-zinc-100 truncate">{app.name}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <FolderOpen size={10} className="text-zinc-700 shrink-0" />
              <span className="text-[10px] text-zinc-600 font-mono truncate" title={app.executablePath}>
                {filename}
              </span>
            </div>
          </div>
          <button
            onClick={() => updateApp(app.id, { favorite: !app.favorite })}
            className={`p-1.5 rounded-lg transition-all duration-150 ${
              app.favorite
                ? "text-amber-400 bg-amber-500/10 border border-amber-500/20"
                : "text-zinc-700 hover:text-zinc-400 hover:bg-white/[0.05] border border-transparent"
            }`}
            title={app.favorite ? "Unpin" : "Pin to top"}
          >
            <Star size={14} className={app.favorite ? "fill-amber-400" : ""} />
          </button>
        </div>
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {appTags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} onRemove={() => toggleTag(tag.id)} />
          ))}
          <div className="relative">
            <button
              onClick={() => setShowTagPicker((v) => !v)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors border border-dashed border-zinc-800 hover:border-zinc-700"
            >
              <Tag size={9} />
              Add tag
            </button>
            {showTagPicker && (
              <div
                className="absolute top-7 left-0 z-20 rounded-xl border shadow-2xl shadow-black/50 p-3 w-56 animate-slide-down"
                style={{ background: "var(--panel)", borderColor: "var(--border-strong)" }}
              >
                <button
                  onClick={() => setShowTagPicker(false)}
                  className="absolute top-2 right-2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  <X size={12} />
                </button>
                {allTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {allTags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => { toggleTag(tag.id); setShowTagPicker(false); }}
                        className={`px-2 py-0.5 rounded-full text-[10px] transition-all ${
                          app.tags.includes(tag.id) ? "opacity-40 line-through" : "hover:opacity-80"
                        }`}
                        style={{ background: tag.color + "22", color: tag.color, border: `1px solid ${tag.color}40` }}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                )}
                <div className={`${allTags.length > 0 ? "border-t pt-2.5" : ""}`} style={allTags.length > 0 ? { borderColor: "rgba(255,255,255,0.08)" } : {}}>
                  <p className="text-[10px] text-zinc-600 mb-2">Create tag</p>
                  <div className="flex gap-1 flex-wrap mb-2">
                    {TAG_COLORS.slice(0, 8).map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => setNewTagColor(newTagColor === c.hex ? null : c.hex)}
                        className="w-5 h-5 rounded-full transition-all"
                        style={{
                          backgroundColor: c.hex,
                          outline: newTagColor === c.hex ? `2px solid ${c.hex}` : "none",
                          outlineOffset: "2px",
                          opacity: newTagColor && newTagColor !== c.hex ? 0.4 : 1,
                        }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  {newTagColor && (
                    <div className="flex gap-1 animate-slide-down">
                      <input
                        autoFocus
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && newTagName.trim()) createTag(newTagName.trim(), newTagColor);
                          if (e.key === "Escape") { setNewTagName(""); setNewTagColor(null); }
                        }}
                        placeholder="Tag name…"
                        className="flex-1 bg-zinc-800 border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/30 transition-colors"
                      />
                      <button
                        onClick={() => newTagName.trim() && createTag(newTagName.trim(), newTagColor)}
                        className="px-2.5 py-1 text-xs rounded-lg font-medium text-white transition-colors"
                        style={{ background: newTagColor }}
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {showTagPicker && <div className="fixed inset-0 z-10" onClick={() => setShowTagPicker(false)} />}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Profile</span>
        <div className="flex-1 h-px bg-zinc-800/60" />
        <ProfileSelector app={app} />
      </div>
      {profile ? (
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <ArgSection
              key={cat.category}
              app={app}
              profile={profile}
              category={cat.category}
              icon={cat.icon}
              label={cat.label}
              presets={cat.presets}
              accentColor={cat.color}
            />
          ))}
        </div>
      ) : (
        <div
          className="text-center py-12 rounded-xl border"
          style={{ borderColor: "var(--border-subtle)", background: "var(--card)" }}
        >
          <p className="text-sm text-zinc-600">No profile selected</p>
          <p className="text-xs text-zinc-700 mt-1">Create a profile to add arguments</p>
        </div>
      )}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <button
          onClick={() => setNotesExpanded((v) => !v)}
          className="flex items-center gap-2.5 w-full px-4 py-3 text-left transition-colors"
          style={{ background: "transparent" }}
        >
          <FileText size={13} className="text-zinc-600" />
          <span className="text-xs font-semibold text-zinc-400 flex-1">Notes</span>
          {app.notes && (
            <span className="text-[10px] text-zinc-600 mr-2">{app.notes.length} chars</span>
          )}
          <span className="text-[10px] text-zinc-700">{notesExpanded ? "▲" : "▼"}</span>
        </button>
        {notesExpanded && (
          <div className="border-t px-3 pb-3" style={{ borderColor: "var(--border-subtle)" }}>
            <textarea
              value={app.notes}
              onChange={(e) => updateApp(app.id, { notes: e.target.value })}
              placeholder="Add notes, reminders, or tips for this app…"
              rows={4}
              className="w-full mt-3 border rounded-lg px-3 py-2 text-xs focus:outline-none resize-none transition-colors"
              style={{
                background: "var(--elevated)",
                borderColor: "var(--border-subtle)",
                color: "var(--text-2)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
