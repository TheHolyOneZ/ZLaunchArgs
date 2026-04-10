<div align="center">

# ZLaunchArgs

**The cleanest way to manage launch arguments on Windows.**

*One app. Every game. Full control.*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows-0078d4?logo=windows)](https://github.com/TheHolyOneZ/ZLaunchArgs)
[![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri%202-ffc131?logo=tauri)](https://tauri.app)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)

</div>

---

## What is this?

ZLaunchArgs is a desktop utility for Windows that lets you define, organize, and launch custom argument profiles for any `.exe` — games, tools, emulators, whatever. No more editing shortcuts, no more forgetting which flags you had. Everything lives in one place, looks great doing it, and launches in one click.

Built with **Tauri 2** (Rust backend) and **React 18** (TypeScript frontend). Dark and light theme. System tray. Runs lean.

---

## Features

### App Library
- Add any `.exe` by browsing or typing the path directly
- Auto-scan for **Steam**, **Epic Games**, and **GOG** libraries
- **Pin favorites** — starred apps stay pinned to the top
- Filter by tag, favorite status, or currently running
- Color-coded tags, per-app assignment
- Inline rename, drag to reorder

### Argument Profiles
- Multiple named profiles per app (Default, Performance, Debug, Streaming — whatever you need)
- Four organized categories: **GPU**, **Resolution**, **Debug**, **Custom**
- Toggle arguments on/off individually — non-destructive, nothing is ever deleted
- Built-in preset library for the most common flags — one click to add
- Type any custom argument with a monospace input and Enter to add
- Inline validation warning if an arg looks malformed
- Duplicate profiles as a starting point

### Launch
- **Live command preview** — syntax-highlighted terminal box showing exactly what will run
  - Executable in white · `--flags` in blue · values in green
- One-click **Launch** button — assembles args and spawns the process
- **Batch launch** — fire multiple apps simultaneously
- **Environment variables** per profile — `DXVK_HUD=1`, `__GL_SHADER_DISK_CACHE=1`, etc. — injected at spawn time

### Process Monitor
- Live tracking of every process launched through ZLaunchArgs
- PID, app name, real-time uptime counter (polled every 3s)
- Kill button → `taskkill /F`
- Green pulse indicator in the sidebar sidebar for running apps

### Settings
| Setting | What it does |
|---|---|
| **Theme** | Dark or light — toggle from title bar or Settings |
| **Minimize to Tray** | X button hides the window; tray icon restores it |
| **Auto Backup** | Timestamped config backups on a 5 min – 24 hr interval |
| **Import / Export** | Full config round-trip as JSON |
| **Global Hotkeys** | Bind key combos to launch any app from anywhere |
| **Notifications** | Per-event toast controls (launch success, failure, process exit) |

### Everything else
- Launch history — every run logged with timestamp and profile name
- Per-app stats — total launches, last launched timestamp
- Notes field — free text per app, inline editable
- System tray — quick show/hide, quit from tray menu
- Config auto-saved on every change (debounced, no manual save needed)

---

## Stack

| | |
|---|---|
| **UI** | React 18 + TypeScript |
| **Styling** | Tailwind CSS v4 via Vite plugin |
| **State** | Zustand |
| **Routing** | react-router-dom v6 |
| **Icons** | Lucide React |
| **Backend** | Tauri 2.x · Rust |
| **Process info** | `sysinfo` crate |
| **Persistence** | JSON · `%APPDATA%\com.zlaunchargs.app\config.json` |

---

## Getting started

### Requirements

- [Rust](https://rustup.rs/) stable toolchain
- [Node.js](https://nodejs.org/) 18 or newer
- WebView2 — already installed on Windows 10 1803+ and all Windows 11 builds

### Dev

```sh
npm install
npm run tauri dev
```

### Pre-built installers

Download the latest release directly from the website — no build tools required:

**[https://zlogic.eu/zlaunchargs/](https://zlogic.eu/zlaunchargs/)**

Available as an NSIS `.exe` setup installer and an MSI package.

### Production bundle

```sh
npm run tauri build
```

Output: `src-tauri/target/release/bundle/`
- `nsis/` → `.exe` installer
- `msi/` → Windows Installer package

---

## Project structure

```
src/
├── components/
│   ├── layout/        TitleBar · Sidebar · CenterPanel · RightPanel · StatusBar
│   ├── library/       AppList · AppListItem · AddAppDialog · ScanDialog · SearchBar
│   ├── profiles/      ProfilePanel · ProfileSelector · ArgSection · ArgToggleRow
│   ├── launch/        LaunchButton · LaunchPreview · BatchLaunchButton
│   ├── monitor/       ProcessMonitor
│   ├── history/       LaunchHistory
│   ├── stats/         AppStats
│   ├── env/           EnvVariables
│   ├── settings/      ImportExport
│   └── shared/        Toast · Modal · TagBadge · EmptyState · ErrorBoundary
├── hooks/
│   ├── useLaunch.ts            arg assembly → spawn → history
│   ├── useProcessMonitor.ts    3s polling loop
│   ├── useAutoBackup.ts        interval-based backup
│   ├── useTheme.ts             data-theme attribute management
│   └── useNotifications.ts     toast queue
├── stores/
│   ├── appStore.ts             config CRUD + debounced auto-save
│   ├── uiStore.ts              selection · search · sidebar · theme
│   └── processStore.ts         live process list
├── services/
│   ├── tauriCommands.ts        typed invoke() wrappers
│   └── presets.ts              built-in argument templates
├── types/index.ts              all TypeScript types
└── pages/
    ├── LibraryPage.tsx         three-panel main layout
    └── SettingsPage.tsx        General · Import/Export · Hotkeys · Notifications

src-tauri/src/
├── commands/
│   ├── launch.rs       process spawn · kill · PID tracking
│   ├── process.rs      get_running_processes · check_process
│   ├── config.rs       load · save · export · import · backup
│   ├── scanner.rs      Steam · Epic · GOG · directory scan
│   └── apps.rs         validate_executable · extract_app_name
├── state.rs            shared Mutex<HashMap<PID, ProcessEntry>>
└── tray.rs             tray icon · left-click toggle · show/quit menu
```

---

## Config

Stored at `%APPDATA%\com.zlaunchargs.app\config.json`.

When auto-backup is enabled, timestamped copies are written to the same directory as `config_backup_<unix_ts>.json`.

---

## Known limitations

- Global hotkeys rely on `tauri-plugin-global-shortcut` — certain combinations may be intercepted by Windows or other running apps.
- Process uptime is tracked from when ZLaunchArgs launched the process, not the OS start time. App restarts are not detected.
- Auto-scan covers Steam (`libraryfolders.vdf`), Epic Games (manifest JSONs), and GOG (registry). Anything outside those paths needs to be added manually.

---

## License

MIT — see [LICENSE](./LICENSE)

---

<div align="center">
  Made by <a href="https://github.com/TheHolyOneZ"><strong>TheHolyOneZ</strong></a>
</div>
