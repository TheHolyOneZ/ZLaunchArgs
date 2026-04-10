import { useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { TitleBar } from "./components/layout/TitleBar";
import { StatusBar } from "./components/layout/StatusBar";
import { Toast } from "./components/shared/Toast";
import { LibraryPage } from "./pages/LibraryPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ErrorBoundary } from "./components/shared/ErrorBoundary";
import { useAppStore } from "./stores/appStore";
import { useUiStore } from "./stores/uiStore";
import { useProcessMonitor } from "./hooks/useProcessMonitor";
import { useAutoBackup } from "./hooks/useAutoBackup";
function AppInner() {
  const loadConfig = useAppStore((s) => s.loadConfig);
  const loaded = useAppStore((s) => s.loaded);
  const savedTheme = useAppStore((s) => s.config.settings.theme);
  const minimizeToTray = useAppStore((s) => s.config.settings.minimizeToTray);
  const setTheme = useUiStore((s) => s.setTheme);
  const minimizeToTrayRef = useRef(minimizeToTray);
  useProcessMonitor();
  useAutoBackup();
  useEffect(() => {
    minimizeToTrayRef.current = minimizeToTray;
  }, [minimizeToTray]);
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);
  useEffect(() => {
    if (loaded && savedTheme !== "system") {
      setTheme(savedTheme);
    }
  }, [loaded]);
  useEffect(() => {
    const win = getCurrentWindow();
    const unlisten = win.onCloseRequested((event) => {
      if (minimizeToTrayRef.current) {
        event.preventDefault();
        win.hide();
      }
    });
    return () => { unlisten.then((f) => f()); };
  }, []);
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden min-h-0">
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </div>
      <StatusBar />
      <Toast />
    </div>
  );
}
export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
