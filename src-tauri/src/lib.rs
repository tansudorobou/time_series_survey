use tauri_plugin_sql::{Migration, MigrationKind};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "Initial database schema",
        sql: r#"
            CREATE TABLE logs (
                id TEXT PRIMARY KEY,
                category_id TEXT NOT NULL,
                sub_category_id TEXT NOT NULL,
                content TEXT,
                date TEXT NOT NULL,
                date_time DATETIME NOT NULL,
                run_state INTEGER
            );
            CREATE TABLE logs_category (
                id TEXT PRIMARY KEY,
                category TEXT NOT NULL,
                color TEXT,
                sequence INTEGER
            );
            CREATE TABLE logs_sub_category (
                id TEXT PRIMARY KEY,
                category_id TEXT NOT NULL,
                sub_category TEXT NOT NULL,
                color TEXT,
                sequence INTEGER
            );
            CREATE INDEX idx_date ON logs (date);
        "#,
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:TimeSeriesSurvey.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
