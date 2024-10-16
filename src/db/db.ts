import type { CategoryType, LogType, SubCategoryType } from "@/components/types"
import Database from "@tauri-apps/plugin-sql"

let db: Database

async function initializeDatabase() {
  db = await Database.load("sqlite:TimeSeriesSurvey.db")
}

initializeDatabase().catch(console.error)
export async function selectLogs() {
  return (await db.select(
    "SELECT logs.id, logs.category_id, logs.sub_category_id, logs.content, logs.date, logs.date_time, logs.run_state, logs_category.category, logs_sub_category.sub_category FROM logs LEFT JOIN logs_category ON logs.category_id = logs_category.id LEFT JOIN logs_sub_category ON logs.sub_category_id = logs_sub_category.id",
  )) as LogType[]
}

export async function selectLogsType() {
  return (await db.select(
    "SELECT id, category, color, sequence FROM logs_category ORDER BY sequence",
  )) as CategoryType[]
}

export async function selectLogsTitle() {
  return (await db.select(
    "SELECT id, category_id, sub_category, color, sequence FROM logs_sub_category ORDER BY sequence",
  )) as SubCategoryType[]
}

export async function insertLogs({
  id,
  category_id,
  sub_category_id,
  content,
  date,
  date_time,
  run_state,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: any) {
  const query = `
        INSERT INTO logs (id, category_id, sub_category_id, content, date, date_time, run_state)
        VALUES (?, ?, ?, ?, ?, ?, ?)`

  await db.execute(query, [
    id,
    category_id,
    sub_category_id,
    content,
    date,
    date_time,
    run_state,
  ])
}

export async function insertLogsType({
  id,
  category,
  color,
  sequence,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: any) {
  const query = `
        INSERT INTO logs_category (id, category, color, sequence)
        VALUES (?, ?, ? ,?)`

  await db.execute(query, [id, category, color, sequence])
}

export async function insertLogsTitle({
  id,
  category_id,
  sub_category,
  color,
  sequence,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: any) {
  const query = `
        INSERT INTO logs_sub_category (id, category_id, sub_category, color, sequence)
        VALUES (?, ?, ?, ?, ?)`
  await db.execute(query, [id, category_id, sub_category, color, sequence])
}

export async function updateLogs({
  id,
  category_id,
  sub_category_id,
  content,
  date,
  date_time,
  run_state,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: any) {
  const query = `
            UPDATE logs
            SET category_id = ?, sub_category_id = ?, content = ?, date = ?, date_time = ?, run_state = ?
            WHERE id = ?`
  await db.execute(query, [
    category_id,
    sub_category_id,
    content,
    date,
    date_time,
    run_state,
    id,
  ])
}

export async function updateLogsType({
  id,
  category,
  color,
  sequence,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: any) {
  const query = `
                UPDATE logs_category
                SET category = ?, color = ?, sequence = ?
                WHERE id = ?`
  await db.execute(query, [category, color, sequence, id])
}

export async function updateLogsTitle({
  id,
  category_id,
  sub_category,
  color,
  sequence,
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
}: any) {
  const query = `
                UPDATE logs_sub_category
                SET category_id = ?, sub_category = ?, color = ?, sequence = ?
                WHERE id = ?`
  await db.execute(query, [category_id, sub_category, color, sequence, id])
}

export async function deleteLogs(id: string) {
  const query = "DELETE FROM logs WHERE id = ?"
  await db.execute(query, [id])
}

export async function deleteLogsType(id: string) {
  const query = "DELETE FROM logs_category WHERE id = ?"
  await db.execute(query, [id])
}

export async function deleteLogsTitle(id: string) {
  const query = "DELETE FROM logs_sub_category WHERE id = ?"
  await db.execute(query, [id])
}
