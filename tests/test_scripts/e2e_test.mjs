#!/usr/bin/env node
/**
 * e2e_test.mjs — End-to-end test against the running server
 *
 * Usage (run from project root):
 *   node tests/test_scripts/e2e_test.mjs [--port <n>] [--log] [--data <json-file>]
 *
 * Options:
 *   --port <n>    Server port (default: 3000 or $PORT)
 *   --log         Write result to tests/test_runs/e2e_<timestamp>.log
 *   --data <file> JSON test data file (default: tests/test_data/order_happy_path.json)
 *
 * Test steps:
 *   0. GET  /health                            — server reachable
 *   1. POST /api/v1/web-channel/session        — obtain JWT
 *   2. POST /api/v1/web-channel/orders         — place order
 *   3. GET  /api/v1/web-channel/processes/:id  — poll until completed (max 15 s)
 *   4. GET  /api/v1/web-channel/orders/:id     — verify final order status
 */
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join }                                    from 'node:path';

const args    = process.argv.slice(2);
const portIdx = args.indexOf('--port');
const PORT    = portIdx >= 0
  ? parseInt(args[portIdx + 1])
  : (parseInt(process.env.PORT || '0') || 3000);
const doLog   = args.includes('--log');
const dataIdx = args.indexOf('--data');
const dataFile = dataIdx >= 0 ? args[dataIdx + 1] : 'tests/test_data/order_happy_path.json';

const BASE    = `http://localhost:${PORT}`;
const LOG_DIR = 'tests/test_runs';

// ── Logging / assertion helpers ───────────────────────────────────────────────
const lines  = [];
let passed   = 0;
let failed   = 0;
const ts     = () => new Date().toISOString();

function log(msg) {
  const entry = `[${ts()}] ${msg}`;
  console.log(entry);
  lines.push(entry);
}

function pass(label, detail = '') {
  passed++;
  log(`  ✓ ${label}${detail ? ': ' + detail : ''}`);
}

function fail(label, detail = '') {
  failed++;
  log(`  ✗ FAIL ${label}${detail ? ': ' + detail : ''}`);
}

function assert(label, condition, detail = '') {
  condition ? pass(label, detail) : fail(label, detail);
}

// ── Load test data ─────────────────────────────────────────────────────────────
let orderData;
try {
  orderData = JSON.parse(readFileSync(dataFile, 'utf-8'));
} catch (e) {
  log(`ERROR: Cannot read test data file "${dataFile}": ${e.message}`);
  process.exit(1);
}

log('=== e2e_test.mjs started ===');
log(`Server  : ${BASE}`);
log(`Data    : ${dataFile}`);
log(`Payload : ${JSON.stringify(orderData)}`);

// ── Step 0: GET /health ───────────────────────────────────────────────────────
log('\nStep 0: GET /health');
try {
  const r = await fetch(`${BASE}/health`);
  const d = await r.json();
  assert('HTTP 200', r.ok,           `status=${r.status}`);
  assert('status=ok', d.status === 'ok', `got="${d.status}"`);
} catch (e) {
  fail('GET /health', e.message);
}

// ── Step 1: POST /api/v1/web-channel/session ──────────────────────────────────
log('\nStep 1: POST /api/v1/web-channel/session');
let token = null;
try {
  const r = await fetch(`${BASE}/api/v1/web-channel/session`, { method: 'POST' });
  const d = await r.json();
  assert('HTTP 200', r.ok,                          `status=${r.status}`);
  assert('access_token present', typeof d.access_token === 'string' && d.access_token.length > 0);
  assert('token_type=Bearer', d.token_type === 'Bearer', `got="${d.token_type}"`);
  assert('expires_in present', typeof d.expires_in  === 'number');
  if (d.access_token) token = `Bearer ${d.access_token}`;
} catch (e) {
  fail('POST /session', e.message);
}

if (!token) {
  log('ABORT: No session token — cannot continue');
  summarise(); process.exit(1);
}

// ── Step 2: POST /api/v1/web-channel/orders ───────────────────────────────────
log('\nStep 2: POST /api/v1/web-channel/orders');
let orderId   = null;
let processId = null;
try {
  const r = await fetch(`${BASE}/api/v1/web-channel/orders`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    body   : JSON.stringify(orderData),
  });
  const d = await r.json();
  assert('HTTP 201',         r.status === 201,             `status=${r.status}`);
  assert('order_id present', typeof d.order_id   === 'string', `got=${d.order_id}`);
  assert('process_id present', typeof d.process_id === 'string', `got=${d.process_id}`);
  assert('status=accepted',  d.status === 'accepted',      `got="${d.status}"`);
  orderId   = d.order_id;
  processId = d.process_id;
  log(`  order_id=${orderId}  process_id=${processId}`);
} catch (e) {
  fail('POST /orders', e.message);
}

if (!orderId || !processId) {
  log('ABORT: Missing order_id/process_id — cannot continue');
  summarise(); process.exit(1);
}

// ── Step 3: Poll GET /api/v1/web-channel/processes/:id ───────────────────────
log(`\nStep 3: Polling GET /api/v1/web-channel/processes/${processId} (max 15 s)`);
const POLL_INTERVAL = 1_000;
const MAX_WAIT      = 15_000;
let   finalStatus   = null;
const t0            = Date.now();

while (Date.now() - t0 < MAX_WAIT) {
  await new Promise(r => setTimeout(r, POLL_INTERVAL));
  try {
    const r = await fetch(
      `${BASE}/api/v1/web-channel/processes/${encodeURIComponent(processId)}`,
      { headers: { Authorization: token } },
    );
    const d = await r.json();
    const elapsed = Math.floor((Date.now() - t0) / 1000);
    log(`  [${elapsed}s] process_status=${d.process_status}  last_step=${d.last_completed_step ?? '—'}`);
    if (d.process_status === 'completed' || d.process_status === 'escalated') {
      finalStatus = d.process_status;
      break;
    }
  } catch (e) {
    log(`  Poll error: ${e.message}`);
  }
}
assert('process finished within 15 s', finalStatus !== null,         'timed out');
assert('process_status=completed',      finalStatus === 'completed',  `got="${finalStatus}"`);

// ── Step 4: GET /api/v1/web-channel/orders/:id ───────────────────────────────
log(`\nStep 4: GET /api/v1/web-channel/orders/${orderId}`);
try {
  const r = await fetch(
    `${BASE}/api/v1/web-channel/orders/${encodeURIComponent(orderId)}`,
    { headers: { Authorization: token } },
  );
  const d = await r.json();
  assert('HTTP 200',              r.ok,                               `status=${r.status}`);
  assert('order_id matches',      d.order_id    === orderId);
  assert('status=delivered',      d.status      === 'delivered',      `got="${d.status}"`);
  assert('beverage_type matches', d.beverage_type === orderData.beverage_type);
  assert('customer_name matches', d.customer_name === orderData.customer_name);
} catch (e) {
  fail('GET /orders/:id', e.message);
}

summarise();
process.exit(failed > 0 ? 1 : 0);

// ─────────────────────────────────────────────────────────────────────────────
function summarise() {
  log(`\n=== Results: ${passed} passed, ${failed} failed ===`);
  if (doLog) {
    mkdirSync(LOG_DIR, { recursive: true });
    const stamp   = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const logFile = join(LOG_DIR, `e2e_${stamp}.log`);
    writeFileSync(logFile, lines.join('\n') + '\n', 'utf-8');
    console.log(`Log written: ${logFile}`);
  }
}
