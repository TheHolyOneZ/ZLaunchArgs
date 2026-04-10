import { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import { useLaunch } from "../../hooks/useLaunch";
import type { AppEntry, ArgProfile } from "../../types";
interface LaunchButtonProps {
  app: AppEntry;
  profile: ArgProfile;
}
export function LaunchButton({ app, profile }: LaunchButtonProps) {
  const [launching, setLaunching] = useState(false);
  const { launch } = useLaunch();
  const handleLaunch = async () => {
    setLaunching(true);
    try {
      await launch(app, profile);
    } finally {
      setLaunching(false);
    }
  };
  return (
    <button
      onClick={handleLaunch}
      disabled={launching}
      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
      style={{
        background: launching
          ? "linear-gradient(135deg, #2563eb, #1d4ed8)"
          : "linear-gradient(135deg, #3b82f6, #2563eb)",
        boxShadow: launching ? "none" : "0 4px 20px rgba(59,130,246,0.35), 0 0 0 1px rgba(59,130,246,0.2)",
      }}
    >
      {launching ? (
        <Loader2 size={15} className="animate-spin" />
      ) : (
        <Play size={14} className="fill-white" />
      )}
      {launching ? "Launching…" : "Launch"}
    </button>
  );
}
