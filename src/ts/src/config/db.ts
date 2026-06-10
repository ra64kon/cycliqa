import initSqlJs, { type SqlJsStatic, type Database } from "sql.js";

let db: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (!db) {
    const SQL = await initSqlJs();
    db = new SQL.Database();
  }
  return db;
}

export async function initializeDatabase(): Promise<void> {
  const database = await getDatabase();
  database.run(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id TEXT PRIMARY KEY,
      beverage_type TEXT NOT NULL,
      with_milk_foam INTEGER NOT NULL DEFAULT 0,
      customer_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'accepted',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  database.run(`
    CREATE TABLE IF NOT EXISTS process_instances (
      process_id TEXT PRIMARY KEY,
      order_id TEXT NOT NULL,
      process_status TEXT NOT NULL DEFAULT 'running',
      last_completed_step TEXT,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(order_id)
    )
  `);

  database.run(`
    CREATE TABLE IF NOT EXISTS process_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      process_id TEXT NOT NULL,
      step_name TEXT NOT NULL,
      step_status TEXT NOT NULL DEFAULT 'pending',
      executed_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (process_id) REFERENCES process_instances(process_id)
    )
  `);

  database.run(`
    CREATE TABLE IF NOT EXISTS delivery_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      attempt_number INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'attempted',
      failure_reason TEXT,
      attempted_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (order_id) REFERENCES orders(order_id)
    )
  `);
}
