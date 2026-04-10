use std::path::Path;
#[tauri::command]
pub fn validate_executable(path: String) -> bool {
    let p = Path::new(&path);
    p.exists() && p.is_file()
}
#[tauri::command]
pub fn extract_app_name(path: String) -> String {
    Path::new(&path)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("Unknown App")
        .to_string()
}
