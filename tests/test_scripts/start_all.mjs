#!/usr/bin/env node
/**
 * start_all.mjs — Start app server (single mode) in background
 *
 * Usage (run from project root):
 *   node tests/test_scripts/start_all.mjs [--port <n>] [--log]
 *
 * Options:
 *   --port <n>  Server port (default: 3000 or $PORT)
 *   --log       Redirect server stdout/stderr to tests/tmp/app.log
 *
 * Writes PID to tests/tmp/app.pid. Waits for /health (max 10 s).
 * Run build_all.mjs first so that dist/index.js exists.
 */
import { spawn }                            from 'node:child_process';
import { createWriteStream, mkdirSync,
         writeFileSync, existsSync }         from 'node:fs';
import { resolve }                           from 'node:path';

const args    = process.argv.slice(2);
const portIdx = args.indexOf('--port');
const PORT    = portIdx >= 0
  ? parseInt(args[portIdx + 1])
  : (parseInt(process.env.PORT || '0') || 3000);
const doLog   = args.includes('--log');

const APP_ENTRY = resolve('src/ts/dist/index.js');
const TMP_DIR   = 'tests/tmp';
const PID_FILE  = `${TMP_DIR}/app.pid`;
const LOG_FILE  = `${TMP_DIR}/app.log`;
const BASE      = `http://localhost:${PORT}`;
const MAX_WAIT  = 10_000;
const POLL_MS   = 500;

const ts  = () => new Date().toISOString();
const log = (msg) => console.log(`[${ts()}] ${msg}`);

if (!existsSync(APP_ENTRY)) {
  log(`ERROR: ${APP_ENTRY} not found. Run build_all.mjs first.`);
  process.exit(1);
}

mkdirSync(TMP_DIR, { recursive: true });

const env  = { ...process.env, PORT: String(PORT) };
const stdio = doLog ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'ignore', 'ignore'];

log(`Starting: node ${APP_ENTRY}`);
log(`Port: ${PORT}${doLog ? `  Server log: ${LOG_FILE}` : ''}`);

const child = spawn('node', [APP_ENTRY], { env, detached: true, stdio });

if (doLog) {
  const logStream = createWriteStream(LOG_FILE, { flags: 'a' });
  child.stdout?.pipe(logStream);
  child.stderr?.pipe(logStream);
}

child.unref();

const pid = child.pid;
writeFileSync(PID_FILE, String(pid), 'utf-8');
log(`PID ${pid}  →  ${PID_FILE}`);

// ── Poll /health ──────────────────────────────────────────────────────────────
log(`Waiting for ${BASE}/health (max ${MAX_WAIT / 1000} s)...`);
const t0 = Date.now();
let ready = false;

while (Date.now() - t0 < MAX_WAIT) {
  await new Promise(r => setTimeout(r, POLL_MS));
  try {
    const res = await fetch(`${BASE}/health`);
    if (res.ok) { ready = true; break; }
  } catch { /* server not ready yet */ }
}

if (ready) {
  log(`✓ Server ready at ${BASE}`);
} else {
  log(`ERROR: Server did not respond within ${MAX_WAIT / 1000} s — check ${LOG_FILE}`);
  process.exit(1);
}
