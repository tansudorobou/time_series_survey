use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Log {
    pub id: String,
    pub type_id: String,
    pub title_id: String,
    pub content: String,
    pub date: String,
    pub date_time: String,
    pub run_state: i32,
}

#[derive(Serialize, Deserialize)]
pub struct LogType {
    pub id: String,
    pub type_name: String,
    pub color: String,
}

#[derive(Serialize, Deserialize)]
pub struct LogTitle {
    pub id: String,
    pub type_id: String,
    pub title: String,
    pub color: String,
}
