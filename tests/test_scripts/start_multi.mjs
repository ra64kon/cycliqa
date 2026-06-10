#!/usr/bin/env node
/**
 * start_multi.mjs — Start all 5 CoffeeToGo components in background (multi mode)
 *
 * Usage (run from project root):
 *   node tests/test_scripts/start_multi.mjs [--log]
 *
 * Options:
 *   --log   Redirect each server's stdout/stderr to tests/tmp/<component>.log
 *
 * What this script does:
 *   1. Force-kills any existing process on ports 3001–3005
 *   2. Starts all 5 components as detached background processes
 *   3. Polls each component's /health endpoint (max 15 s)
 *   4. Saves all PIDs to tests/tmp/multi_pids.json
 *
 * Prerequisites:
 *   Run build_all.mjs first so that dist/servers/*.js exists.
 *
 * Stop all components:
 *   node tests/test_scripts/kill_all.mjs --multi
 *   node tests/test_scripts/kill_all.mjs --multi --force
 *
 * Ports:
 *   web_channel     :3001   (public facade — JWT session + order proxy)
 *   order_terminal  :3002
 *   brewing_station :3003
 *   delivery_robot  :3004
 *   process_control :3005
 */
import { spawn, execSync }                           from 'node:child_process';
import { createWriteStream, mkdirSync,
         writeFileSync, existsSync }                  from 'node:fs';
import { resolve }                                    from 'node:path';

// ── Component definitions ─────────────────────────────────────────────────────
const INTERNAL = {
  ORDER_TERMINAL:  'http://localhost:3002',
  BREWING_STATION: 'http://localhost:3003',
  DELIVERY_ROBOT:  'http://localhost:3004',
  PROCESS_CONTROL: 'http://localhost:3005',
};

const COMPONENTS = [
  {
    name  : 'web_channel',
    port  : 3001,
    entry : resolve('src/ts/dist/servers/web_channel.js'),
    extra : {
      SERVICE_ORDER_TERMINAL_URL  : INTERNAL.ORDER_TERMINAL,
      SERVICE_BREWING_STATION_URL : INTERNAL.BREWING_STATION,
      SERVICE_DELIVERY_ROBOT_URL  : INTERNAL.DELIVERY_ROBOT,
      SERVICE_PROCESS_CONTROL_URL : INTERNAL.PROCESS_CONTROL,
    },
  },
  {
    name  : 'order_terminal',
    port  : 3002,
    entry : resolve('src/ts/dist/servers/order_terminal.js'),
    extra : {},
  },
  {
    name  : 'brewing_station',
    port  : 3003,
    entry : resolve('src/ts/dist/servers/brewing_station.js'),
    extra : {},
  },
  {
    name  : 'delivery_robot',
    port  : 3004,
    entry : resolve('src/ts/dist/servers/delivery_robot.js'),
    extra : {},
  },
  {
    name  : 'process_control',
    port  : 3005,
    entry : resolve('src/ts/dist/servers/process_control.js'),
    extra : {
      SERVICE_ORDER_TERMINAL_URL  : INTERNAL.ORDER_TERMINAL,
      SERVICE_BREWING_STATION_URL : INTERNAL.BREWING_STATION,
      SERVICE_DELIVERY_ROBOT_URL  : INTERNAL.DELIVERY_ROBOT,
    },
  },
];

// ── Config ────────────────────────────────────────────────────────────────────
const args     = process.argv.slice(2);
const doLog    = args.includes('--log');
const TMP_DIR  = 'tests/tmp';
const PIDS_FILE = `${TMP_DIR}/multi_pids.json`;
const IS_WIN   = process.platform === 'win32';
const JWT_SECRET = process.env.COFFEE_TO_GO_JWT_SECRET ?? 'coffee-to-go-dev-jwt-secret';
const MAX_WAIT = 15_000;
const POLL_MS  = 500;

const ts  = () => new Date().toISOString();
const log = (msg) => console.log(`[${ts()}] ${msg}`);

mkdirSync(TMP_DIR, { recursive: true });

// ── Step 1: Kill existing processes on all ports ──────────────────────────────
log('Step 1: Clearing ports 3001–3005...');
for (const { port } of COMPONENTS) {
  try {
    if (IS_WIN) {
      const out = execSync('netstat -ano', { encoding: 'utf-8' });
      const pids = new Set(
        out.split('\n')
          .filter(l => l.includes(`:${port}`) && l.includes('LISTENING'))
          .map(l => l.trim().split(/\s+/).at(-1))
          .filter(Boolean),
      );
      for (const p of pids) {
        try { execSync(`taskkill /PID ${p} /T /F`, { encoding: 'utf-8' }); } catch { /* gone */ }
        log(`  Killed existing process on :${port} (PID ${p})`);
      }
    } else {
      const out = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf-8' });
      for (const p of out.trim().split('\n').filter(Boolean)) {
        try { execSync(`kill -9 ${p}`); } catch { /* gone */ }
        log(`  Killed existing process on :${port} (PID ${p})`);
      }
    }
  } catch { /* port was free — nothing to kill */ }
}
log('Ports cleared.\n');

// ── Step 2: Check dist/ files exist ──────────────────────────────────────────
log('Step 2: Checking dist/ entry points...');
let missing = false;
for (const c of COMPONENTS) {
  if (!existsSync(c.entry)) {
    log(`  MISSING: ${c.entry}`);
    missing = true;
  } else {
    log(`  OK: ${c.entry}`);
  }
}
if (missing) {
  log('\nERROR: Some dist files are missing. Run build_all.mjs first.');
  process.exit(1);
}
log('All entry points present.\n');

// ── Step 3: Start all components ─────────────────────────────────────────────
log('Step 3: Starting components...');
const pids = {};

for (const c of COMPONENTS) {
  const env = {
    ...process.env,
    PORT        : String(c.port),
    DEPLOY_MODE : 'multi',
    COFFEE_TO_GO_JWT_SECRET: JWT_SECRET,
    ...c.extra,
  };

  const stdio = doLog ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'ignore', 'ignore'];
  const child = spawn('node', [c.entry], { env, detached: true, stdio });

  if (doLog) {
    const logStream = createWriteStream(`${TMP_DIR}/${c.name}.log`, { flags: 'a' });
    child.stdout?.pipe(logStream);
    child.stderr?.pipe(logStream);
  }

  child.unref();
  pids[c.name] = child.pid;
  log(`  ${c.name.padEnd(18)} :${c.port}  PID ${child.pid}${doLog ? `  log: ${TMP_DIR}/${c.name}.log` : ''}`);
}

writeFileSync(PIDS_FILE, JSON.stringify(pids, null, 2), 'utf-8');
log(`PIDs saved → ${PIDS_FILE}\n`);

// ── Step 4: Wait for all /health endpoints ────────────────────────────────────
log('Step 4: Waiting for all health endpoints (max 15 s each)...');
const results = [];

for (const c of COMPONENTS) {
  const url = `http://localhost:${c.port}/health`;
  const t0  = Date.now();
  let   ok  = false;

  while (Date.now() - t0 < MAX_WAIT) {
    await new Promise(r => setTimeout(r, POLL_MS));
    try {
      const res = await fetch(url);
      if (res.ok) { ok = true; break; }
    } catch { /* not ready yet */ }
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  results.push({ name: c.name, port: c.port, ok, elapsed });
  log(ok
    ? `  ✓ ${c.name.padEnd(18)} :${c.port}  ready in ${elapsed} s`
    : `  ✗ ${c.name.padEnd(18)} :${c.port}  NOT ready after ${elapsed} s`);
}

const failed = results.filter(r => !r.ok);
if (failed.length > 0) {
  log(`\nERROR: ${failed.length} component(s) did not start: ${failed.map(r => r.name).join(', ')}`);
  if (doLog) log(`Check logs in ${TMP_DIR}/`);
  process.exit(1);
}

log(`\n✓ All 5 components are running.`);
log(`  Web Channel  → http://localhost:3001`);
log(`  Demo App     → http://localhost:3001/app`);
log(`\nStop: node tests/test_scripts/kill_all.mjs --multi`);
