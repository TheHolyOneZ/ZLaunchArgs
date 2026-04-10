import { invoke } from "@tauri-apps/api/core";
import type {
  AppConfig,
  DiscoveredApp,
  RunningProcess,
} from "../types";
export const commands = {
  loadConfig: () => invoke<AppConfig>("load_config"),
  saveConfig: (config: AppConfig) => invoke<void>("save_config", { config }),
  exportConfig: (config: AppConfig, path: string) =>
    invoke<void>("export_config", { config, path }),
  importConfig: (path: string) => invoke<AppConfig>("import_config", { path }),
  createBackup: () => invoke<string>("create_backup"),
  launchApp: (params: {
    executablePath: string;
    args: string[];
    envVars: Record<string, string>;
    appId: string;
    appName: string;
  }) =>
    invoke<number>("launch_app", {
      executablePath: params.executablePath,
      args: params.args,
      envVars: params.envVars,
      appId: params.appId,
      appName: params.appName,
    }),
  killProcess: (pid: number) => invoke<void>("kill_process", { pid }),
  getRunningProcesses: () => invoke<RunningProcess[]>("get_running_processes"),
  checkProcess: (pid: number) => invoke<boolean>("check_process", { pid }),
  validateExecutable: (path: string) =>
    invoke<boolean>("validate_executable", { path }),
  extractAppName: (path: string) =>
    invoke<string>("extract_app_name", { path }),
  scanSteamGames: () => invoke<DiscoveredApp[]>("scan_steam_games"),
  scanEpicGames: () => invoke<DiscoveredApp[]>("scan_epic_games"),
  scanGogGames: () => invoke<DiscoveredApp[]>("scan_gog_games"),
  scanDirectory: (path: string) =>
    invoke<DiscoveredApp[]>("scan_directory", { path }),
};
