mod commands;
mod models;
mod state;
mod tray;
use state::AppState;
use tauri::Manager;
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            if let Some(win) = app.get_webview_window("main") {
                let _ = win.show();
                let _ = win.set_focus();
            }
        }))
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_global_shortcut::Builder::default().build())
        .manage(AppState::new())
        .setup(|app| {
            tray::setup_tray(&app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::config::load_config,
            commands::config::save_config,
            commands::config::export_config,
            commands::config::import_config,
            commands::config::create_backup,
            commands::launch::launch_app,
            commands::launch::kill_process,
            commands::process::get_running_processes,
            commands::process::check_process,
            commands::apps::validate_executable,
            commands::apps::extract_app_name,
            commands::scanner::scan_steam_games,
            commands::scanner::scan_epic_games,
            commands::scanner::scan_gog_games,
            commands::scanner::scan_directory,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
