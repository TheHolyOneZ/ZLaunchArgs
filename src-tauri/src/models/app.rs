use serde::{Deserialize, Serialize};
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
pub enum ArgCategory {
    Gpu,
    Resolution,
    Debug,
    Custom,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Argument {
    pub id: String,
    pub label: String,
    pub value: String,
    pub enabled: bool,
    pub category: ArgCategory,
    pub order: u32,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EnvVariable {
    pub id: String,
    pub key: String,
    pub value: String,
    pub enabled: bool,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ArgProfile {
    pub id: String,
    pub name: String,
    pub arguments: Vec<Argument>,
    pub env_variables: Vec<EnvVariable>,
    pub created_at: i64,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppStats {
    #[serde(rename = "totalLaunches")]
    pub total_launches: u64,
    #[serde(rename = "totalTime")]
    pub total_time: u64,
    #[serde(rename = "lastLaunched")]
    pub last_launched: Option<i64>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppEntry {
    pub id: String,
    pub name: String,
    pub executable_path: String,
    pub icon_path: Option<String>,
    pub profiles: Vec<ArgProfile>,
    pub active_profile_id: String,
    pub tags: Vec<String>,
    pub notes: String,
    pub favorite: bool,
    pub order: u32,
    pub added_at: i64,
    pub stats: AppStats,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Tag {
    pub id: String,
    pub name: String,
    pub color: String,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GlobalPreset {
    pub id: String,
    pub name: String,
    pub description: String,
    pub arguments: Vec<Argument>,
    pub env_variables: Vec<EnvVariable>,
    pub color: String,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct LaunchRecord {
    pub id: String,
    pub app_id: String,
    pub app_name: String,
    pub profile_id: String,
    pub profile_name: String,
    pub args: Vec<String>,
    pub timestamp: i64,
    pub duration: Option<u64>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HotkeyBinding {
    pub id: String,
    pub app_id: String,
    pub profile_id: Option<String>,
    pub shortcut: String,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppSettings {
    pub theme: String,
    pub auto_backup: bool,
    pub auto_backup_interval: u64,
    pub scan_paths: Vec<String>,
    pub hotkeys: Vec<HotkeyBinding>,
    pub minimize_to_tray: bool,
}
impl Default for AppSettings {
    fn default() -> Self {
        Self {
            theme: "dark".to_string(),
            auto_backup: false,
            auto_backup_interval: 3600,
            scan_paths: vec![],
            hotkeys: vec![],
            minimize_to_tray: true,
        }
    }
}
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AppConfig {
    pub version: u32,
    pub apps: Vec<AppEntry>,
    pub global_presets: Vec<GlobalPreset>,
    pub tags: Vec<Tag>,
    pub launch_history: Vec<LaunchRecord>,
    pub settings: AppSettings,
}
impl Default for AppConfig {
    fn default() -> Self {
        Self {
            version: 1,
            apps: vec![],
            global_presets: vec![],
            tags: vec![],
            launch_history: vec![],
            settings: AppSettings::default(),
        }
    }
}
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DiscoveredApp {
    pub name: String,
    pub executable_path: String,
    pub source: String,
}
