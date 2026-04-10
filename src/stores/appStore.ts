import { create } from "zustand";
import { commands } from "../services/tauriCommands";
import type {
  AppConfig,
  AppEntry,
  ArgProfile,
  Argument,
  EnvVariable,
  GlobalPreset,
  LaunchRecord,
  Tag,
  AppSettings,
} from "../types";
let saveTimer: ReturnType<typeof setTimeout> | null = null;
interface AppState {
  config: AppConfig;
  loaded: boolean;
  saving: boolean;
  loadConfig: () => Promise<void>;
  scheduleSave: () => void;
  forceSave: () => Promise<void>;
  addApp: (entry: AppEntry) => void;
  removeApp: (id: string) => void;
  updateApp: (id: string, partial: Partial<AppEntry>) => void;
  reorderApps: (orderedIds: string[]) => void;
  addProfile: (appId: string, profile: ArgProfile) => void;
  removeProfile: (appId: string, profileId: string) => void;
  duplicateProfile: (appId: string, profileId: string) => void;
  setActiveProfile: (appId: string, profileId: string) => void;
  updateProfile: (
    appId: string,
    profileId: string,
    partial: Partial<ArgProfile>
  ) => void;
  addArgument: (appId: string, profileId: string, arg: Argument) => void;
  removeArgument: (
    appId: string,
    profileId: string,
    argId: string
  ) => void;
  updateArgument: (
    appId: string,
    profileId: string,
    argId: string,
    partial: Partial<Argument>
  ) => void;
  reorderArguments: (
    appId: string,
    profileId: string,
    orderedIds: string[]
  ) => void;
  addEnvVar: (appId: string, profileId: string, env: EnvVariable) => void;
  removeEnvVar: (
    appId: string,
    profileId: string,
    envId: string
  ) => void;
  updateEnvVar: (
    appId: string,
    profileId: string,
    envId: string,
    partial: Partial<EnvVariable>
  ) => void;
  addGlobalPreset: (preset: GlobalPreset) => void;
  removeGlobalPreset: (id: string) => void;
  updateGlobalPreset: (id: string, partial: Partial<GlobalPreset>) => void;
  addTag: (tag: Tag) => void;
  removeTag: (id: string) => void;
  updateTag: (id: string, partial: Partial<Tag>) => void;
  addLaunchRecord: (record: LaunchRecord) => void;
  clearHistory: () => void;
  updateSettings: (partial: Partial<AppSettings>) => void;
  incrementStats: (appId: string, duration?: number) => void;
}
const defaultConfig = (): AppConfig => ({
  version: 1,
  apps: [],
  globalPresets: [],
  tags: [],
  launchHistory: [],
  settings: {
    theme: "dark",
    autoBackup: false,
    autoBackupInterval: 3600,
    scanPaths: [],
    hotkeys: [],
    minimizeToTray: true,
  },
});
export const useAppStore = create<AppState>((set, get) => ({
  config: defaultConfig(),
  loaded: false,
  saving: false,
  loadConfig: async () => {
    try {
      const config = await commands.loadConfig();
      set({ config, loaded: true });
    } catch {
      set({ config: defaultConfig(), loaded: true });
    }
  },
  scheduleSave: () => {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => get().forceSave(), 500);
  },
  forceSave: async () => {
    set({ saving: true });
    try {
      await commands.saveConfig(get().config);
    } finally {
      set({ saving: false });
    }
  },
  addApp: (entry) => {
    set((s) => ({
      config: { ...s.config, apps: [...s.config.apps, entry] },
    }));
    get().scheduleSave();
  },
  removeApp: (id) => {
    set((s) => ({
      config: {
        ...s.config,
        apps: s.config.apps.filter((a) => a.id !== id),
      },
    }));
    get().scheduleSave();
  },
  updateApp: (id, partial) => {
    set((s) => ({
      config: {
        ...s.config,
        apps: s.config.apps.map((a) =>
          a.id === id ? { ...a, ...partial } : a
        ),
      },
    }));
    get().scheduleSave();
  },
  reorderApps: (orderedIds) => {
    set((s) => {
      const map = new Map(s.config.apps.map((a) => [a.id, a]));
      const reordered = orderedIds
        .map((id, i) => {
          const app = map.get(id);
          return app ? { ...app, order: i } : null;
        })
        .filter(Boolean) as AppEntry[];
      return { config: { ...s.config, apps: reordered } };
    });
    get().scheduleSave();
  },
  addProfile: (appId, profile) => {
    set((s) => ({
      config: {
        ...s.config,
        apps: s.config.apps.map((a) =>
          a.id === appId
            ? { ...a, profiles: [...a.profiles, profile] }
            : a
        ),
      },
    }));
    get().scheduleSave();
  },
  removeProfile: (appId, profileId) => {
    set((s) => ({
      config: {
        ...s.config,
        apps: s.config.apps.map((a) => {
          if (a.id !== appId) return a;
          const profiles = a.profiles.filter((p) => p.id !== profileId);
          const activeProfileId =
            a.activeProfileId === profileId
              ? profiles[0]?.id ?? ""
              : a.activeProfileId;
          return { ...a, profiles, activeProfileId };
        }),
      },
    }));
    get().scheduleSave();
  },
  duplicateProfile: (appId, profileId) => {
    const app = get().config.apps.find((a) => a.id === appId);
    const profile = app?.profiles.find((p) => p.id === profileId);
    if (!profile) return;
    const newProfile: ArgProfile = {
      ...profile,
      id: crypto.randomUUID(),
      name: `${profile.name} (Copy)`,
      createdAt: Date.now(),
    };
    get().addProfile(appId, newProfile);
  },
  setActiveProfile: (appId, profileId) => {
    get().updateApp(appId, { activeProfileId: profileId });
  },
  updateProfile: (appId, profileId, partial) => {
    set((s) => ({
      config: {
        ...s.config,
        apps: s.config.apps.map((a) =>
          a.id === appId
            ? {
                ...a,
                profiles: a.profiles.map((p) =>
                  p.id === profileId ? { ...p, ...partial } : p
                ),
              }
            : a
        ),
      },
    }));
    get().scheduleSave();
  },
  addArgument: (appId, profileId, arg) => {
    get().updateProfile(appId, profileId, {
      arguments: [
        ...(get().config.apps
          .find((a) => a.id === appId)
          ?.profiles.find((p) => p.id === profileId)?.arguments ?? []),
        arg,
      ],
    });
  },
  removeArgument: (appId, profileId, argId) => {
    const profile = get()
      .config.apps.find((a) => a.id === appId)
      ?.profiles.find((p) => p.id === profileId);
    if (!profile) return;
    get().updateProfile(appId, profileId, {
      arguments: profile.arguments.filter((a) => a.id !== argId),
    });
  },
  updateArgument: (appId, profileId, argId, partial) => {
    const profile = get()
      .config.apps.find((a) => a.id === appId)
      ?.profiles.find((p) => p.id === profileId);
    if (!profile) return;
    get().updateProfile(appId, profileId, {
      arguments: profile.arguments.map((a) =>
        a.id === argId ? { ...a, ...partial } : a
      ),
    });
  },
  reorderArguments: (appId, profileId, orderedIds) => {
    const profile = get()
      .config.apps.find((a) => a.id === appId)
      ?.profiles.find((p) => p.id === profileId);
    if (!profile) return;
    const map = new Map(profile.arguments.map((a) => [a.id, a]));
    const reordered = orderedIds
      .map((id, i) => {
        const arg = map.get(id);
        return arg ? { ...arg, order: i } : null;
      })
      .filter(Boolean) as Argument[];
    get().updateProfile(appId, profileId, { arguments: reordered });
  },
  addEnvVar: (appId, profileId, env) => {
    const profile = get()
      .config.apps.find((a) => a.id === appId)
      ?.profiles.find((p) => p.id === profileId);
    if (!profile) return;
    get().updateProfile(appId, profileId, {
      envVariables: [...profile.envVariables, env],
    });
  },
  removeEnvVar: (appId, profileId, envId) => {
    const profile = get()
      .config.apps.find((a) => a.id === appId)
      ?.profiles.find((p) => p.id === profileId);
    if (!profile) return;
    get().updateProfile(appId, profileId, {
      envVariables: profile.envVariables.filter((e) => e.id !== envId),
    });
  },
  updateEnvVar: (appId, profileId, envId, partial) => {
    const profile = get()
      .config.apps.find((a) => a.id === appId)
      ?.profiles.find((p) => p.id === profileId);
    if (!profile) return;
    get().updateProfile(appId, profileId, {
      envVariables: profile.envVariables.map((e) =>
        e.id === envId ? { ...e, ...partial } : e
      ),
    });
  },
  addGlobalPreset: (preset) => {
    set((s) => ({
      config: {
        ...s.config,
        globalPresets: [...s.config.globalPresets, preset],
      },
    }));
    get().scheduleSave();
  },
  removeGlobalPreset: (id) => {
    set((s) => ({
      config: {
        ...s.config,
        globalPresets: s.config.globalPresets.filter((p) => p.id !== id),
      },
    }));
    get().scheduleSave();
  },
  updateGlobalPreset: (id, partial) => {
    set((s) => ({
      config: {
        ...s.config,
        globalPresets: s.config.globalPresets.map((p) =>
          p.id === id ? { ...p, ...partial } : p
        ),
      },
    }));
    get().scheduleSave();
  },
  addTag: (tag) => {
    set((s) => ({
      config: { ...s.config, tags: [...s.config.tags, tag] },
    }));
    get().scheduleSave();
  },
  removeTag: (id) => {
    set((s) => ({
      config: {
        ...s.config,
        tags: s.config.tags.filter((t) => t.id !== id),
        apps: s.config.apps.map((a) => ({
          ...a,
          tags: a.tags.filter((t) => t !== id),
        })),
      },
    }));
    get().scheduleSave();
  },
  updateTag: (id, partial) => {
    set((s) => ({
      config: {
        ...s.config,
        tags: s.config.tags.map((t) =>
          t.id === id ? { ...t, ...partial } : t
        ),
      },
    }));
    get().scheduleSave();
  },
  addLaunchRecord: (record) => {
    set((s) => ({
      config: {
        ...s.config,
        launchHistory: [record, ...s.config.launchHistory].slice(0, 500),
      },
    }));
    get().scheduleSave();
  },
  clearHistory: () => {
    set((s) => ({
      config: { ...s.config, launchHistory: [] },
    }));
    get().scheduleSave();
  },
  updateSettings: (partial) => {
    set((s) => ({
      config: {
        ...s.config,
        settings: { ...s.config.settings, ...partial },
      },
    }));
    get().scheduleSave();
  },
  incrementStats: (appId, duration) => {
    set((s) => ({
      config: {
        ...s.config,
        apps: s.config.apps.map((a) => {
          if (a.id !== appId) return a;
          return {
            ...a,
            stats: {
              totalLaunches: a.stats.totalLaunches + 1,
              totalTime: a.stats.totalTime + (duration ?? 0),
              lastLaunched: Date.now(),
            },
          };
        }),
      },
    }));
    get().scheduleSave();
  },
}));
