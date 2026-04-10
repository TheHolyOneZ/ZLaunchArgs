import { create } from "zustand";
type FilterMode = "all" | "favorites" | "recent" | "running";
interface UiState {
  selectedAppId: string | null;
  searchQuery: string;
  filterMode: FilterMode;
  activeTagFilter: string | null;
  sidebarCollapsed: boolean;
  rightPanelCollapsed: boolean;
  theme: "dark" | "light";
  toast: { id: string; message: string; type: "success" | "error" | "info" } | null;
  setSelectedApp: (id: string | null) => void;
  setSearchQuery: (q: string) => void;
  setFilterMode: (mode: FilterMode) => void;
  setActiveTagFilter: (tagId: string | null) => void;
  toggleSidebar: () => void;
  toggleRightPanel: () => void;
  setTheme: (theme: "dark" | "light") => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  clearToast: () => void;
}
export const useUiStore = create<UiState>((set) => ({
  selectedAppId: null,
  searchQuery: "",
  filterMode: "all",
  activeTagFilter: null,
  sidebarCollapsed: false,
  rightPanelCollapsed: false,
  theme: "dark",
  toast: null,
  setSelectedApp: (id) => set({ selectedAppId: id }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterMode: (mode) => set({ filterMode: mode }),
  setActiveTagFilter: (tagId) => set({ activeTagFilter: tagId }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleRightPanel: () =>
    set((s) => ({ rightPanelCollapsed: !s.rightPanelCollapsed })),
  setTheme: (theme) => set({ theme }),
  showToast: (message, type = "info") =>
    set({ toast: { id: crypto.randomUUID(), message, type } }),
  clearToast: () => set({ toast: null }),
}));
