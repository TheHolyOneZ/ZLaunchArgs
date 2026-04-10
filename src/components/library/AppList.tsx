import { useAppStore } from "../../stores/appStore";
import { useUiStore } from "../../stores/uiStore";
import { useProcessStore } from "../../stores/processStore";
import { AppListItem } from "./AppListItem";
import { EmptyState } from "../shared/EmptyState";
import { Layers } from "lucide-react";
export function AppList() {
  const apps = useAppStore((s) => s.config.apps);
  const tags = useAppStore((s) => s.config.tags);
  const launchHistory = useAppStore((s) => s.config.launchHistory);
  const reorderApps = useAppStore((s) => s.reorderApps);
  const query = useUiStore((s) => s.searchQuery);
  const filterMode = useUiStore((s) => s.filterMode);
  const activeTagFilter = useUiStore((s) => s.activeTagFilter);
  const allProcesses = useProcessStore((s) => s.processes);
  const runningAppIds = allProcesses.filter((p) => p.alive).map((p) => p.appId);
  const recentAppIds = [...new Map(
    launchHistory.map((r) => [r.appId, r.timestamp])
  ).entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);
  const sorted = [...apps].sort((a, b) => a.order - b.order);
  const filtered = sorted.filter((app) => {
    const matchQuery = app.name
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchTag = !activeTagFilter || app.tags.includes(activeTagFilter);
    const matchFilter =
      filterMode === "all" ||
      (filterMode === "favorites" && app.favorite) ||
      (filterMode === "recent" && recentAppIds.includes(app.id)) ||
      (filterMode === "running" && runningAppIds.includes(app.id));
    return matchQuery && matchTag && matchFilter;
  });
  const pinned = filtered.filter((a) => a.favorite);
  const rest = filtered.filter((a) => !a.favorite);
  const handleDragStart = (
    e: React.DragEvent,
    index: number,
    section: "pinned" | "rest"
  ) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ index, section })
    );
  };
  const handleDrop = (
    e: React.DragEvent,
    targetIndex: number,
    targetSection: "pinned" | "rest"
  ) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    const sourceSection = data.section as "pinned" | "rest";
    const sourceIndex = data.index as number;
    const sourceList = sourceSection === "pinned" ? pinned : rest;
    const movedApp = sourceList[sourceIndex];
    if (!movedApp) return;
    const allSorted = [...pinned, ...rest];
    const from = allSorted.findIndex((a) => a.id === movedApp.id);
    const targetList = targetSection === "pinned" ? pinned : rest;
    const targetApp = targetList[targetIndex];
    const to = allSorted.findIndex((a) => a.id === targetApp?.id);
    if (from === -1 || to === -1 || from === to) return;
    const reordered = [...allSorted];
    const [removed] = reordered.splice(from, 1);
    reordered.splice(to, 0, removed);
    reorderApps(reordered.map((a) => a.id));
  };
  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={<Layers size={28} />}
        title="No apps found"
        description={
          query ? "Try a different search term." : "Add your first app below."
        }
      />
    );
  }
  const renderItem = (
    app: typeof apps[0],
    index: number,
    section: "pinned" | "rest"
  ) => (
    <div
      key={app.id}
      draggable
      onDragStart={(e) => handleDragStart(e, index, section)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, index, section)}
    >
      <AppListItem app={app} tags={tags} />
    </div>
  );
  return (
    <div className="pb-1">
      {pinned.length > 0 && (
        <>
          <div className="px-3 pt-2 pb-1">
            <span className="text-xs text-zinc-600 font-medium">Pinned</span>
          </div>
          {pinned.map((app, i) => renderItem(app, i, "pinned"))}
          {rest.length > 0 && (
            <div className="mx-3 my-1.5 border-t border-zinc-800/50" />
          )}
        </>
      )}
      {rest.length > 0 && (
        <>
          {pinned.length > 0 && (
            <div className="px-3 pb-1">
              <span className="text-xs text-zinc-600 font-medium">All</span>
            </div>
          )}
          {rest.map((app, i) => renderItem(app, i, "rest"))}
        </>
      )}
    </div>
  );
}
