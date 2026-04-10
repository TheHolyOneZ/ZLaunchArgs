import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { useUiStore } from "../../stores/uiStore";
import { useAppStore } from "../../stores/appStore";
import { LaunchButton } from "../launch/LaunchButton";
import { LaunchPreview } from "../launch/LaunchPreview";
import { BatchLaunchButton } from "../launch/BatchLaunchButton";
import { ProcessMonitor } from "../monitor/ProcessMonitor";
import { LaunchHistory } from "../history/LaunchHistory";
import { AppStats } from "../stats/AppStats";
import { EnvVariables } from "../env/EnvVariables";
function SectionDivider() {
  return <div className="border-t mx-3" style={{ borderColor: "var(--border-subtle)" }} />;
}
function SectionWrapper({ children }: { children: React.ReactNode }) {
  return <div className="px-3 py-3">{children}</div>;
}
export function RightPanel() {
  const collapsed = useUiStore((s) => s.rightPanelCollapsed);
  const toggleRightPanel = useUiStore((s) => s.toggleRightPanel);
  const selectedAppId = useUiStore((s) => s.selectedAppId);
  const app = useAppStore((s) => s.config.apps.find((a) => a.id === selectedAppId));
  const activeProfile = app?.profiles.find((p) => p.id === app.activeProfileId);
  if (collapsed) {
    return (
      <div
        className="flex flex-col items-center w-10 py-2 shrink-0"
        style={{ background: "var(--surface)", borderLeft: "1px solid var(--border-subtle)" }}
      >
        <button
          onClick={toggleRightPanel}
          className="p-2 text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.05] rounded-lg transition-all"
          title="Expand panel"
        >
          <PanelRightOpen size={15} />
        </button>
      </div>
    );
  }
  return (
    <div
      className="flex flex-col w-72 shrink-0 overflow-y-auto"
      style={{ background: "var(--surface)", borderLeft: "1px solid var(--border-subtle)" }}
    >
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Actions</span>
        <button
          onClick={toggleRightPanel}
          className="p-1 text-zinc-700 hover:text-zinc-500 rounded transition-colors"
          title="Collapse panel"
        >
          <PanelRightClose size={13} />
        </button>
      </div>
      <SectionWrapper>
        {app && activeProfile ? (
          <div className="space-y-2">
            <LaunchPreview app={app} profile={activeProfile} />
            <LaunchButton app={app} profile={activeProfile} />
            <BatchLaunchButton />
          </div>
        ) : (
          <div className="space-y-2">
            <div
              className="flex items-center justify-center h-20 rounded-xl border"
              style={{ borderColor: "var(--border-subtle)", background: "var(--card)" }}
            >
              <span className="text-xs text-zinc-700">Select an app to launch</span>
            </div>
            <BatchLaunchButton />
          </div>
        )}
      </SectionWrapper>
      {app && activeProfile && (
        <>
          <SectionDivider />
          <SectionWrapper>
            <EnvVariables app={app} profile={activeProfile} />
          </SectionWrapper>
        </>
      )}
      <SectionDivider />
      <SectionWrapper>
        <ProcessMonitor />
      </SectionWrapper>
      {app && (
        <>
          <SectionDivider />
          <SectionWrapper>
            <AppStats app={app} />
          </SectionWrapper>
        </>
      )}
      <SectionDivider />
      <SectionWrapper>
        <LaunchHistory appId={selectedAppId} />
      </SectionWrapper>
    </div>
  );
}
