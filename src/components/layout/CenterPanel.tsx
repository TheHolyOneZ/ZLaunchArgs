import { Layers } from "lucide-react";
import { useUiStore } from "../../stores/uiStore";
import { useAppStore } from "../../stores/appStore";
import { ProfilePanel } from "../profiles/ProfilePanel";
export function CenterPanel() {
  const selectedAppId = useUiStore((s) => s.selectedAppId);
  const app = useAppStore((s) => s.config.apps.find((a) => a.id === selectedAppId));
  if (!app) {
    return (
      <div className="flex-1 flex items-center justify-center overflow-hidden bg-transparent">
        <div className="flex flex-col items-center gap-4 text-center px-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center border"
            style={{ background: "rgba(59,130,246,0.06)", borderColor: "rgba(59,130,246,0.15)" }}
          >
            <Layers size={28} className="text-blue-500/50" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">No app selected</p>
            <p className="text-xs text-zinc-700 mt-1">
              Select an app from the sidebar or add a new one to get started.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex-1 bg-transparent overflow-y-auto min-w-0">
      <ProfilePanel app={app} />
    </div>
  );
}
