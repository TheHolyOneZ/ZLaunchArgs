import { useState } from "react";
import { Layers, Loader2 } from "lucide-react";
import { useLaunch } from "../../hooks/useLaunch";
import { useAppStore } from "../../stores/appStore";
export function BatchLaunchButton() {
  const [launching, setLaunching] = useState(false);
  const { launchBatch } = useLaunch();
  const apps = useAppStore((s) => s.config.apps);
  const favorites = apps.filter((a) => a.favorite);
  const handleBatch = async () => {
    if (favorites.length === 0) return;
    setLaunching(true);
    try {
      const items = favorites.map((app) => {
        const profile =
          app.profiles.find((p) => p.id === app.activeProfileId) ??
          app.profiles[0];
        return { app, profile };
      }).filter((i) => i.profile != null) as Parameters<typeof launchBatch>[0];
      await launchBatch(items);
    } finally {
      setLaunching(false);
    }
  };
  const disabled = launching || favorites.length === 0;
  return (
    <button
      onClick={handleBatch}
      disabled={disabled}
      title={favorites.length === 0 ? "Pin apps to enable batch launch" : `Launch ${favorites.length} pinned apps`}
      className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed border"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderColor: "rgba(255,255,255,0.08)",
        color: disabled ? "#52525b" : "#a1a1aa",
      }}
    >
      {launching ? (
        <Loader2 size={12} className="animate-spin" />
      ) : (
        <Layers size={12} />
      )}
      {launching
        ? "Launching…"
        : favorites.length > 0
        ? `Batch Launch (${favorites.length} pinned)`
        : "Batch Launch"}
    </button>
  );
}
