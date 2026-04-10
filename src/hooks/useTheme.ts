import { useEffect } from "react";
import { useUiStore } from "../stores/uiStore";
import { useAppStore } from "../stores/appStore";
export function useTheme() {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const updateSettings = useAppStore((s) => s.updateSettings);
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
  }, [theme]);
  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    updateSettings({ theme: next });
  };
  return { theme, toggleTheme };
}
