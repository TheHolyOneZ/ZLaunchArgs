use std::fs;
use std::path::{Path, PathBuf};
use crate::models::app::DiscoveredApp;
fn find_exes_in_dir(dir: &Path, depth: u32) -> Vec<PathBuf> {
    if depth == 0 || !dir.is_dir() {
        return vec![];
    }
    let mut found = vec![];
    if let Ok(entries) = fs::read_dir(dir) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_file() {
                if let Some(ext) = path.extension() {
                    if ext.to_ascii_lowercase() == "exe" {
                        found.push(path);
                    }
                }
            } else if path.is_dir() {
                found.extend(find_exes_in_dir(&path, depth - 1));
            }
        }
    }
    found
}
#[tauri::command]
pub fn scan_steam_games() -> Vec<DiscoveredApp> {
    let mut discovered = vec![];
    #[cfg(windows)]
    {
        use winreg::RegKey;
        use winreg::enums::*;
        let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
        let steam_path: Option<String> = hklm
            .open_subkey("SOFTWARE\\WOW6432Node\\Valve\\Steam")
            .or_else(|_| hklm.open_subkey("SOFTWARE\\Valve\\Steam"))
            .ok()
            .and_then(|key| key.get_value("InstallPath").ok());
        if let Some(steam_root) = steam_path {
            let vdf_path = PathBuf::from(&steam_root).join("steamapps").join("libraryfolders.vdf");
            let mut library_paths = vec![PathBuf::from(&steam_root).join("steamapps")];
            if let Ok(content) = fs::read_to_string(&vdf_path) {
                for line in content.lines() {
                    let trimmed = line.trim();
                    if trimmed.starts_with('"') {
                        let parts: Vec<&str> = trimmed.split('"').collect();
                        if parts.len() >= 4 {
                            let key = parts[1];
                            let val = parts[3];
                            if key == "path" && !val.is_empty() {
                                library_paths.push(PathBuf::from(val).join("steamapps"));
                            }
                        }
                    }
                }
            }
            for library in library_paths {
                if let Ok(entries) = fs::read_dir(&library) {
                    for entry in entries.flatten() {
                        let path = entry.path();
                        if path.extension().and_then(|e| e.to_str()) == Some("acf") {
                            if let Ok(content) = fs::read_to_string(&path) {
                                let mut install_dir = String::new();
                                let mut name = String::new();
                                for line in content.lines() {
                                    let trimmed = line.trim();
                                    let parts: Vec<&str> = trimmed.split('"').collect();
                                    if parts.len() >= 4 {
                                        match parts[1] {
                                            "name" => name = parts[3].to_string(),
                                            "installdir" => install_dir = parts[3].to_string(),
                                            _ => {}
                                        }
                                    }
                                }
                                if !install_dir.is_empty() && !name.is_empty() {
                                    let game_dir = library.join("common").join(&install_dir);
                                    let exes = find_exes_in_dir(&game_dir, 2);
                                    if let Some(exe) = exes.first() {
                                        discovered.push(DiscoveredApp {
                                            name,
                                            executable_path: exe.to_string_lossy().to_string(),
                                            source: "Steam".to_string(),
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    discovered
}
#[tauri::command]
pub fn scan_epic_games() -> Vec<DiscoveredApp> {
    let mut discovered = vec![];
    #[cfg(windows)]
    {
        let manifests_dir = PathBuf::from(r"C:\ProgramData\Epic\EpicGamesLauncher\Data\Manifests");
        if manifests_dir.exists() {
            if let Ok(entries) = fs::read_dir(&manifests_dir) {
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.extension().and_then(|e| e.to_str()) == Some("item") {
                        if let Ok(content) = fs::read_to_string(&path) {
                            if let Ok(json) = serde_json::from_str::<serde_json::Value>(&content) {
                                let name = json["DisplayName"].as_str().unwrap_or("").to_string();
                                let install_location =
                                    json["InstallLocation"].as_str().unwrap_or("").to_string();
                                let launch_exe =
                                    json["LaunchExecutable"].as_str().unwrap_or("").to_string();
                                if !name.is_empty() && !install_location.is_empty() {
                                    let exe_path = PathBuf::from(&install_location).join(&launch_exe);
                                    if exe_path.exists() {
                                        discovered.push(DiscoveredApp {
                                            name,
                                            executable_path: exe_path.to_string_lossy().to_string(),
                                            source: "Epic Games".to_string(),
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    discovered
}
#[tauri::command]
pub fn scan_gog_games() -> Vec<DiscoveredApp> {
    let mut discovered = vec![];
    #[cfg(windows)]
    {
        use winreg::RegKey;
        use winreg::enums::*;
        let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
        let gog_key = hklm
            .open_subkey("SOFTWARE\\WOW6432Node\\GOG.com\\Games")
            .or_else(|_| hklm.open_subkey("SOFTWARE\\GOG.com\\Games"));
        if let Ok(games_key) = gog_key {
            for game_id in games_key.enum_keys().flatten() {
                if let Ok(game_key) = games_key.open_subkey(&game_id) {
                    let name: String = game_key.get_value("GAMENAME").unwrap_or_default();
                    let exe: String = game_key.get_value("EXE").unwrap_or_default();
                    if !name.is_empty() && !exe.is_empty() && Path::new(&exe).exists() {
                        discovered.push(DiscoveredApp {
                            name,
                            executable_path: exe,
                            source: "GOG".to_string(),
                        });
                    }
                }
            }
        }
    }
    discovered
}
#[tauri::command]
pub fn scan_directory(path: String) -> Vec<DiscoveredApp> {
    let dir = Path::new(&path);
    find_exes_in_dir(dir, 3)
        .into_iter()
        .map(|exe| DiscoveredApp {
            name: exe
                .file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or("Unknown")
                .to_string(),
            executable_path: exe.to_string_lossy().to_string(),
            source: "Custom Scan".to_string(),
        })
        .collect()
}
