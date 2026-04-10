import type { PresetTemplate } from "../types";
export const GPU_PRESETS: PresetTemplate[] = [
  { label: "Use GPU", value: "--use-gpu", category: "gpu" },
  { label: "Force DX12", value: "--force-dx12", category: "gpu" },
  { label: "Force DX11", value: "--force-dx11", category: "gpu" },
  { label: "Force Vulkan", value: "--force-vulkan", category: "gpu" },
  {
    label: "High Performance GPU",
    value: "--gpu-preference=high-performance",
    category: "gpu",
  },
  {
    label: "Force GPU Rasterization",
    value: "--force-gpu-rasterization",
    category: "gpu",
  },
  { label: "Disable GPU", value: "--disable-gpu", category: "gpu" },
  {
    label: "DXVK HUD",
    value: "DXVK_HUD=full",
    category: "gpu",
  },
];
export const RESOLUTION_PRESETS: PresetTemplate[] = [
  { label: "Width 1920", value: "-w 1920", category: "resolution" },
  { label: "Height 1080", value: "-h 1080", category: "resolution" },
  { label: "Width 2560", value: "-w 2560", category: "resolution" },
  { label: "Height 1440", value: "-h 1440", category: "resolution" },
  { label: "Width 3840", value: "-w 3840", category: "resolution" },
  { label: "Height 2160", value: "-h 2160", category: "resolution" },
  { label: "Fullscreen", value: "--fullscreen", category: "resolution" },
  { label: "Windowed", value: "--windowed", category: "resolution" },
  { label: "Borderless", value: "-popupwindow", category: "resolution" },
  { label: "No Border", value: "--borderless", category: "resolution" },
];
export const DEBUG_PRESETS: PresetTemplate[] = [
  { label: "Verbose", value: "--verbose", category: "debug" },
  { label: "Debug", value: "--debug", category: "debug" },
  { label: "Console", value: "--console", category: "debug" },
  { label: "Log Debug", value: "--log-level=debug", category: "debug" },
  { label: "Developer Mode", value: "--developer", category: "debug" },
  { label: "No Crash Reporter", value: "--disable-crashpad", category: "debug" },
  { label: "Safe Mode", value: "--safe-mode", category: "debug" },
  { label: "Skip Intro", value: "--skip-intro", category: "debug" },
  { label: "No Splash", value: "--no-splash", category: "debug" },
];
export const PRESET_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];
export const TAG_COLORS = [
  { name: "blue", hex: "#3b82f6" },
  { name: "purple", hex: "#8b5cf6" },
  { name: "green", hex: "#10b981" },
  { name: "yellow", hex: "#f59e0b" },
  { name: "red", hex: "#ef4444" },
  { name: "pink", hex: "#ec4899" },
  { name: "cyan", hex: "#06b6d4" },
  { name: "lime", hex: "#84cc16" },
  { name: "orange", hex: "#f97316" },
  { name: "slate", hex: "#64748b" },
];
