import { useCallback } from "react";
import { commands } from "../services/tauriCommands";
import { useAppStore } from "../stores/appStore";
import { useNotifications } from "./useNotifications";
import type { AppEntry, ArgProfile, LaunchRecord } from "../types";
function buildArgs(profile: ArgProfile): string[] {
  return profile.arguments
    .filter((a) => a.enabled && a.value.trim())
    .sort((a, b) => a.order - b.order)
    .flatMap((a) => a.value.trim().split(/\s+/));
}
function buildEnvVars(profile: ArgProfile): Record<string, string> {
  return Object.fromEntries(
    profile.envVariables
      .filter((e) => e.enabled && e.key.trim() && e.value.trim())
      .map((e) => [e.key.trim(), e.value.trim()])
  );
}
export function useLaunch() {
  const addLaunchRecord = useAppStore((s) => s.addLaunchRecord);
  const incrementStats = useAppStore((s) => s.incrementStats);
  const { notifySuccess, notifyError } = useNotifications();
  const launch = useCallback(
    async (app: AppEntry, profile: ArgProfile) => {
      const args = buildArgs(profile);
      const envVars = buildEnvVars(profile);
      try {
        const pid = await commands.launchApp({
          executablePath: app.executablePath,
          args,
          envVars,
          appId: app.id,
          appName: app.name,
        });
        const record: LaunchRecord = {
          id: crypto.randomUUID(),
          appId: app.id,
          appName: app.name,
          profileId: profile.id,
          profileName: profile.name,
          args,
          timestamp: Date.now(),
        };
        addLaunchRecord(record);
        incrementStats(app.id);
        notifySuccess(`Launched ${app.name} (PID: ${pid})`);
        return pid;
      } catch (err) {
        notifyError(`Failed to launch ${app.name}: ${err}`);
        return null;
      }
    },
    [addLaunchRecord, incrementStats, notifySuccess, notifyError]
  );
  const launchBatch = useCallback(
    async (apps: { app: AppEntry; profile: ArgProfile }[]) => {
      const results = await Promise.allSettled(
        apps.map(({ app, profile }) => launch(app, profile))
      );
      const succeeded = results.filter(
        (r) => r.status === "fulfilled" && r.value !== null
      ).length;
      notifySuccess(`Launched ${succeeded}/${apps.length} apps`);
    },
    [launch, notifySuccess]
  );
  return { launch, launchBatch, buildArgs, buildEnvVars };
}
