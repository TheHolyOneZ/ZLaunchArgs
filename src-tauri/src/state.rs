use std::collections::HashMap;
use std::sync::Mutex;
pub struct ProcessEntry {
    pub app_id: String,
    pub app_name: String,
    pub started_at: i64,
}
pub struct AppState {
    pub processes: Mutex<HashMap<u32, ProcessEntry>>,
}
impl AppState {
    pub fn new() -> Self {
        Self {
            processes: Mutex::new(HashMap::new()),
        }
    }
}
