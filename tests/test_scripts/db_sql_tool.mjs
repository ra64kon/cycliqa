#!/usr/bin/env node
/**
 * db_sql_tool.mjs — SQL tool for DB checks and migrations
 *
 * Usage (run from project root):
 *   node tests/test_scripts/db_sql_tool.mjs --mode node|api [options]
 *
 * Options:
 *   --mode node        Run SQL locally via Node.js + sql.js (no server required)
 *   --mode api         Run SQL via server endpoint (requires running server)
 *   --sql "<stmt>"     Inline SQL statement
 *   --file <file>      Load SQL from file
 *   --port <n>         Server port for API mode (default: 3000)
 *   --log              Write output to tests/test_runs/db_<timestamp>.log
 *   --out <file>       Also write output to a file
 *
 * In --mode node a fresh in-memory sql.js DB is initialised with the full
 * application schema (orders, process_instances, process_steps,
 * delivery_attempts) and the provided SQL is executed against it.
 *
 * sql.js is loaded from src/ts/node_modules/sql.js (same version the app uses).
 */
import { createRequire }                        from 'node:module';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, resolve }                         from 'node:path';

// ── Parse args ────────────────────────────────────────────────────────────────
const args    = process.argv.slice(2);
const modeIdx = args.indexOf('--mode');
const mode    = modeIdx >= 0 ? args[modeIdx + 1] : null;
const sqlIdx  = args.indexOf('--sql');
const sqlStmt = sqlIdx  >= 0 ? args[sqlIdx  + 1] : null;
const fileIdx = args.indexOf('--file');
const sqlFile = fileIdx >= 0 ? args[fileIdx + 1] : null;
const portIdx = args.indexOf('--port');
const PORT    = portIdx >= 0 ? parseInt(args[portIdx + 1]) : 3000;
const doLog   = args.includes('--log');
const outIdx  = args.indexOf('--out');
const outFile = outIdx  >= 0 ? args[outIdx  + 1] : null;
const LOG_DIR = 'tests/test_runs';

if (!mode || !['node', 'api'].includes(mode)) {
  console.error('ERROR: --mode node|api is required');
  process.exit(1);
}
if (!sqlStmt && !sqlFile) {
  console.error('ERROR: Provide --sql "<statement>" or --file <path>');
  process.exit(1);
}

// ── Logging ───────────────────────────────────────────────────────────────────
const lines = [];
const ts    = () => new Date().toISOString();

function log(msg) {
  const entry = `[${ts()}] ${msg}`;
  console.log(entry);
  lines.push(entry);
}

// ── Load SQL ──────────────────────────────────────────────────────────────────
let sql = '';
if (sqlStmt) {
  sql = sqlStmt;
} else {
  try {
    sql = readFileSync(sqlFile, 'utf-8');
  } catch (e) {
    console.error(`ERROR: Cannot read SQL file "${sqlFile}": ${e.message}`);
    process.exit(1);
  }
}

log('=== db_sql_tool.mjs started ===');
log(`Mode       : ${mode}`);
log(`SQL source : ${sqlFile ?? 'inline'}`);

// ── NODE mode ─────────────────────────────────────────────────────────────────
if (mode === 'node') {
  // Load sql.js from the app's own node_modules so the version is aligned.
  const sqlJsDir = resolve('src/ts/node_modules/sql.js');
  const require  = createRequire(resolve('src/ts/package.json'));
  let initSqlJs;
  try {
    initSqlJs = require(sqlJsDir);
  } catch (e) {
    log(`ERROR: Cannot load sql.js from "${sqlJsDir}": ${e.message}`);
    log('Make sure you have run build_all.mjs (npm install) first.');
    flush(); process.exit(1);
  }

  const SQL = await initSqlJs();
  const db  = new SQL.Database();
  log('sql.js initialised (in-memory DB)');

  // ── Initialise schema (mirrors src/ts/src/config/db.ts) ─────────────────────
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      order_id      TEXT    PRIMARY KEY,
      beverage_type TEXT    NOT NULL,
      with_milk_foam INTEGER NOT NULL DEFAULT 0,
      customer_name TEXT    NOT NULL,
      status        TEXT    NOT NULL DEFAULT 'accepted',
      created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS process_instances (
      process_id          TEXT PRIMARY KEY,
      order_id            TEXT NOT NULL,
      process_status      TEXT NOT NULL DEFAULT 'running',
      last_completed_step TEXT,
      started_at          TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at        TEXT,
      FOREIGN KEY (order_id) REFERENCES orders(order_id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS process_steps (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      process_id  TEXT    NOT NULL,
      step_name   TEXT    NOT NULL,
      step_status TEXT    NOT NULL DEFAULT 'pending',
      executed_at TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (process_id) REFERENCES process_instances(process_id)
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS delivery_attempts (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id       TEXT    NOT NULL,
      attempt_number INTEGER NOT NULL,
      status         TEXT    NOT NULL DEFAULT 'attempted',
      failure_reason TEXT,
      attempted_at   TEXT    NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (order_id) REFERENCES orders(order_id)
    )
  `);
  log('Schema ready (4 tables)');

  // ── Execute SQL ───────────────────────────────────────────────────────────────
  // Split on ";" — skip blank lines and comment-only lines
  const stmts = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.split('\n').every(l => l.trim() === '' || l.trim().startsWith('--')));

  for (const stmt of stmts) {
    const preview = stmt.replace(/\s+/g, ' ').slice(0, 100);
    log(`\nSQL ▶ ${preview}${stmt.length > 100 ? '…' : ''}`);
    try {
      const result = db.exec(stmt);
      if (result.length > 0) {
        for (const r of result) {
          log('  Columns: ' + r.columns.join(' | '));
          for (const row of r.values) {
            log('  ' + row.map(v => (v === null ? 'NULL' : String(v))).join(' | '));
          }
          log(`  (${r.values.length} row${r.values.length === 1 ? '' : 's'})`);
        }
      } else {
        log('  OK — no rows returned');
      }
    } catch (e) {
      log(`  ERROR: ${e.message}`);
    }
  }

  db.close();
  log('\n=== db_sql_tool.mjs completed ===');
  flush();

// ── API mode ──────────────────────────────────────────────────────────────────
} else if (mode === 'api') {
  log(`API mode — server: http://localhost:${PORT}`);
  log('NOTE: The app does not currently expose an internal SQL endpoint.');
  log('Use --mode node for local DB checks and migration testing.');
  flush();
  process.exit(1);
}

// ── Output ────────────────────────────────────────────────────────────────────
function flush() {
  const content = lines.join('\n') + '\n';
  if (doLog) {
    mkdirSync(LOG_DIR, { recursive: true });
    const stamp   = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const logPath = join(LOG_DIR, `db_${stamp}.log`);
    writeFileSync(logPath, content, 'utf-8');
    console.log(`Log written : ${logPath}`);
  }
  if (outFile) {
    writeFileSync(outFile, content, 'utf-8');
    console.log(`Output file : ${outFile}`);
  }
}
