use serde::{Deserialize, Serialize};
use sysinfo::System;
use tauri::State;
use crate::state::AppState;
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RunningProcess {
    pub pid: u32,
    pub app_id: String,
    pub app_name: String,
    pub started_at: i64,
    pub alive: bool,
    pub uptime_secs: u64,
}
#[tauri::command]
pub fn get_running_processes(state: State<AppState>) -> Vec<RunningProcess> {
    let mut sys = System::new();
    sys.refresh_processes(sysinfo::ProcessesToUpdate::All, true);
    let now = chrono::Utc::now().timestamp();
    if let Ok(mut processes) = state.processes.lock() {
        let mut dead = vec![];
        let mut result = vec![];
        for (pid, entry) in processes.iter() {
            let alive = sys.process(sysinfo::Pid::from_u32(*pid)).is_some();
            if !alive {
                dead.push(*pid);
            }
            let uptime_secs = if alive {
                (now - entry.started_at).max(0) as u64
            } else {
                0
            };
            result.push(RunningProcess {
                pid: *pid,
                app_id: entry.app_id.clone(),
                app_name: entry.app_name.clone(),
                started_at: entry.started_at,
                alive,
                uptime_secs,
            });
        }
        for pid in dead {
            processes.remove(&pid);
        }
        result
    } else {
        vec![]
    }
}
#[tauri::command]
pub fn check_process(pid: u32) -> bool {
    let mut sys = System::new();
    sys.refresh_processes(sysinfo::ProcessesToUpdate::All, true);
    sys.process(sysinfo::Pid::from_u32(pid)).is_some()
}
