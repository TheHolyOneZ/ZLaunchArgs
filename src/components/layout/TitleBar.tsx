import { Minus, Square, X, Sun, Moon, Layers } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useTheme } from "../../hooks/useTheme";
import { useAppStore } from "../../stores/appStore";
export function TitleBar() {
  const { theme, toggleTheme } = useTheme();
  const minimizeToTray = useAppStore((s) => s.config.settings.minimizeToTray);
  const win = getCurrentWindow();
  const handleDragStart = (e: React.MouseEvent) => {
    if (e.button === 0) win.startDragging();
  };
  return (
    <div
      onMouseDown={handleDragStart}
      className="flex items-center justify-between h-10 shrink-0 select-none px-3"
      style={{
        background: "linear-gradient(180deg, #0d0d10 0%, #09090b 100%)",
        borderBottom: "1px solid var(--border)",
        cursor: "grab",
      }}
    >
      <div className="flex items-center gap-2.5 pointer-events-none">
        <div className="flex items-center justify-center w-6 h-6 rounded-md bg-blue-600/20 border border-blue-500/30">
          <Layers size={13} className="text-blue-400" />
        </div>
        <span className="text-xs font-semibold tracking-wide text-zinc-300">
          ZLaunchArgs
        </span>
        <span className="text-[10px] text-zinc-600 font-medium tracking-wide">
          by TheHolyOneZ
        </span>
      </div>
      <div className="flex items-center pointer-events-auto" onMouseDown={(e) => e.stopPropagation()}>
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.06] transition-all duration-150"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          style={{ cursor: "default" }}
        >
          {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
        </button>
        <div className="w-px h-4 bg-white/[0.07] mx-1" />
        <button
          onClick={() => win.minimize()}
          className="flex items-center justify-center w-8 h-8 rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-all duration-150"
          style={{ cursor: "default" }}
        >
          <Minus size={12} />
        </button>
        <button
          onClick={() => win.toggleMaximize()}
          className="flex items-center justify-center w-8 h-8 rounded-md text-zinc-600 hover:text-zinc-300 hover:bg-white/[0.06] transition-all duration-150"
          style={{ cursor: "default" }}
        >
          <Square size={11} />
        </button>
        <button
          onClick={() => minimizeToTray ? win.hide() : win.destroy()}
          className="flex items-center justify-center w-8 h-8 rounded-md text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
          style={{ cursor: "default" }}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
