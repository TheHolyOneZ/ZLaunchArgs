export type ArgCategory = "gpu" | "resolution" | "debug" | "custom";
export type Theme = "dark" | "light" | "system";
export interface Argument {
  id: string;
  label: string;
  value: string;
  enabled: boolean;
  category: ArgCategory;
  order: number;
}
export interface EnvVariable {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}
export interface ArgProfile {
  id: string;
  name: string;
  arguments: Argument[];
  envVariables: EnvVariable[];
  createdAt: number;
}
export interface AppStats {
  totalLaunches: number;
  totalTime: number;
  lastLaunched?: number;
}
export interface AppEntry {
  id: string;
  name: string;
  executablePath: string;
  iconPath?: string;
  profiles: ArgProfile[];
  activeProfileId: string;
  tags: string[];
  notes: string;
  favorite: boolean;
  order: number;
  addedAt: number;
  stats: AppStats;
}
export interface Tag {
  id: string;
  name: string;
  color: string;
}
export interface GlobalPreset {
  id: string;
  name: string;
  description: string;
  arguments: Argument[];
  envVariables: EnvVariable[];
  color: string;
}
export interface LaunchRecord {
  id: string;
  appId: string;
  appName: string;
  profileId: string;
  profileName: string;
  args: string[];
  timestamp: number;
  duration?: number;
}
export interface HotkeyBinding {
  id: string;
  appId: string;
  profileId?: string;
  shortcut: string;
}
export interface AppSettings {
  theme: Theme;
  autoBackup: boolean;
  autoBackupInterval: number;
  scanPaths: string[];
  hotkeys: HotkeyBinding[];
  minimizeToTray: boolean;
}
export interface AppConfig {
  version: number;
  apps: AppEntry[];
  globalPresets: GlobalPreset[];
  tags: Tag[];
  launchHistory: LaunchRecord[];
  settings: AppSettings;
}
export interface RunningProcess {
  pid: number;
  appId: string;
  appName: string;
  startedAt: number;
  alive: boolean;
  uptimeSecs: number;
}
export interface DiscoveredApp {
  name: string;
  executablePath: string;
  source: string;
}
export interface PresetTemplate {
  label: string;
  value: string;
  category: ArgCategory;
}
