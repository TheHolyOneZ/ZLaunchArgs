import { Star, MoreHorizontal, Trash2, Edit3 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "../../stores/appStore";
import { useUiStore } from "../../stores/uiStore";
import { useProcessStore } from "../../stores/processStore";
import type { AppEntry, Tag } from "../../types";
interface AppListItemProps {
  app: AppEntry;
  tags: Tag[];
}
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "?";
}
const AVATAR_COLORS = [
  ["#3b82f6", "#1d4ed8"],
  ["#8b5cf6", "#5b21b6"],
  ["#10b981", "#047857"],
  ["#f59e0b", "#b45309"],
  ["#ef4444", "#b91c1c"],
  ["#ec4899", "#9d174d"],
  ["#06b6d4", "#0e7490"],
  ["#f97316", "#c2410c"],
];
function getAvatarGradient(id: string): [string, string] {
  const idx = id.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx] as [string, string];
}
export function AppListItem({ app, tags }: AppListItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(app.name);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectedAppId = useUiStore((s) => s.selectedAppId);
  const setSelectedApp = useUiStore((s) => s.setSelectedApp);
  const updateApp = useAppStore((s) => s.updateApp);
  const removeApp = useAppStore((s) => s.removeApp);
  const processes = useProcessStore((s) => s.processes);
  const isSelected = selectedAppId === app.id;
  const isRunning = processes.some((p) => p.appId === app.id && p.alive);
  const appTags = tags.filter((t) => app.tags.includes(t.id)).slice(0, 4);
  const [c1, c2] = getAvatarGradient(app.id);
  useEffect(() => {
    if (renaming && inputRef.current) inputRef.current.select();
  }, [renaming]);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const handleRename = () => {
    if (renameVal.trim()) updateApp(app.id, { name: renameVal.trim() });
    else setRenameVal(app.name);
    setRenaming(false);
  };
  return (
    <div
      onClick={() => !renaming && setSelectedApp(app.id)}
      className={`group relative flex items-center gap-2.5 px-2 py-2 mx-1.5 mb-0.5 rounded-lg cursor-pointer transition-all duration-150 ${
        isSelected
          ? "bg-blue-600/10 border border-blue-500/20"
          : "border border-transparent hover:bg-white/[0.04]"
      }`}
    >
      {isSelected && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-blue-500" />
      )}
      <div
        className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-white font-semibold text-[10px] relative"
        style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
      >
        {getInitials(app.name)}
        {isRunning && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-zinc-900 running-dot" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        {renaming ? (
          <input
            ref={inputRef}
            value={renameVal}
            onChange={(e) => setRenameVal(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRename();
              if (e.key === "Escape") { setRenameVal(app.name); setRenaming(false); }
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-zinc-700 border border-blue-500/40 rounded px-1.5 py-0.5 text-xs text-zinc-200 focus:outline-none"
          />
        ) : (
          <span
            className={`text-xs font-medium truncate block leading-tight ${
              isSelected ? "text-zinc-100" : "text-zinc-300"
            }`}
          >
            {app.name}
          </span>
        )}
        {appTags.length > 0 && (
          <div className="flex gap-1 mt-0.5">
            {appTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: tag.color }}
                title={tag.name}
              />
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); updateApp(app.id, { favorite: !app.favorite }); }}
          className={`p-1 rounded transition-all duration-150 ${
            app.favorite
              ? "text-amber-400 opacity-100"
              : "text-zinc-700 hover:text-zinc-400 opacity-0 group-hover:opacity-100"
          }`}
          title={app.favorite ? "Unpin" : "Pin to top"}
        >
          <Star size={11} className={app.favorite ? "fill-amber-400" : ""} />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowMenu((v) => !v); }}
            className="p-1 rounded text-zinc-700 hover:text-zinc-400 opacity-0 group-hover:opacity-100 transition-all duration-150"
          >
            <MoreHorizontal size={13} />
          </button>
          {showMenu && (
            <div
              className="absolute right-0 top-7 z-30 min-w-36 rounded-xl border shadow-2xl shadow-black/50 py-1 animate-slide-down"
              style={{ background: "var(--card)", borderColor: "var(--border-strong)" }}
            >
              <button
                onClick={(e) => { e.stopPropagation(); setRenaming(true); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-zinc-300 hover:bg-white/[0.06] transition-colors"
              >
                <Edit3 size={12} className="text-zinc-500" />
                Rename
              </button>
              <div className="my-1 border-t border-white/[0.06]" />
              <button
                onClick={(e) => { e.stopPropagation(); removeApp(app.id); setShowMenu(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={12} />
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
