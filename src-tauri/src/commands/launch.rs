use std::collections::HashMap;
use std::process::Command;
use tauri::State;
use crate::state::{AppState, ProcessEntry};
#[tauri::command]
pub fn launch_app(
    executable_path: String,
    args: Vec<String>,
    env_vars: HashMap<String, String>,
    app_id: String,
    app_name: String,
    state: State<AppState>,
) -> Result<u32, String> {
    let mut cmd = Command::new(&executable_path);
    cmd.args(&args);
    for (key, val) in &env_vars {
        cmd.env(key, val);
    }
    let child = cmd.spawn().map_err(|e| format!("Failed to launch: {}", e))?;
    let pid = child.id();
    let started_at = chrono::Utc::now().timestamp();
    let entry = ProcessEntry {
        app_id,
        app_name,
        started_at,
    };
    if let Ok(mut processes) = state.processes.lock() {
        processes.insert(pid, entry);
    }
    Ok(pid)
}
#[tauri::command]
pub fn kill_process(pid: u32, state: State<AppState>) -> Result<(), String> {
    #[cfg(windows)]
    {
        use std::process::Command;
        Command::new("taskkill")
            .args(["/PID", &pid.to_string(), "/F"])
            .output()
            .map_err(|e| e.to_string())?;
    }
    #[cfg(not(windows))]
    {
        use std::process::Command;
        Command::new("kill")
            .args(["-9", &pid.to_string()])
            .output()
            .map_err(|e| e.to_string())?;
    }
    if let Ok(mut processes) = state.processes.lock() {
        processes.remove(&pid);
    }
    Ok(())
}
