#!/usr/bin/env node
/**
 * kill_all.mjs — Stop background app server(s)
 *
 * Usage (run from project root):
 *   node tests/test_scripts/kill_all.mjs [--multi] [--force] [--port <n>]
 *
 * Options:
 *   (no flag)     Kill single-mode server (reads tests/tmp/app.pid)
 *   --multi       Kill all multi-mode components (reads tests/tmp/multi_pids.json)
 *   --force       Also kill any process still found on the relevant port(s) by netstat/lsof
 *   --port <n>    Port used by --force in single mode (default: 3000)
 *
 * Cross-platform: uses taskkill on Windows, kill/lsof on Unix.
 */
import { readFileSync, existsSync, unlinkSync } from 'node:fs';
import { execSync }                              from 'node:child_process';

const args    = process.argv.slice(2);
const multi   = args.includes('--multi');
const force   = args.includes('--force');
const portIdx = args.indexOf('--port');
const PORT    = portIdx >= 0 ? parseInt(args[portIdx + 1]) : 3000;
const IS_WIN  = process.platform === 'win32';

const SINGLE_PID_FILE = 'tests/tmp/app.pid';
const MULTI_PIDS_FILE = 'tests/tmp/multi_pids.json';
// Ports used by multi-mode components (for --force)
const MULTI_PORTS     = [3001, 3002, 3003, 3004, 3005];

const ts  = () => new Date().toISOString();
const log = (msg) => console.log(`[${ts()}] ${msg}`);

let killed = false;

// ── Helper: kill a single PID (cross-platform) ────────────────────────────────
function killPid(pid, label = '') {
  try {
    if (IS_WIN) {
      execSync(`taskkill /PID ${pid} /T /F`, { encoding: 'utf-8' });
    } else {
      process.kill(pid, 'SIGTERM');
    }
    log(`  PID ${pid} killed${label ? ' (' + label + ')' : ''}`);
    return true;
  } catch (e) {
    log(`  Could not kill PID ${pid}: ${e.message}`);
    return false;
  }
}

// ── Helper: kill all processes found on a port ────────────────────────────────
function killByPort(port) {
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
        log(`  Force-killed port-${port} PID ${p}`);
        killed = true;
      }
    } else {
      const out = execSync(`lsof -ti tcp:${port}`, { encoding: 'utf-8' });
      for (const p of out.trim().split('\n').filter(Boolean)) {
        try { execSync(`kill -9 ${p}`); } catch { /* gone */ }
        log(`  Force-killed port-${port} PID ${p}`);
        killed = true;
      }
    }
  } catch { /* port was already free */ }
}

// ── Multi mode ────────────────────────────────────────────────────────────────
if (multi) {
  log('Mode: multi — reading ' + MULTI_PIDS_FILE);
  if (existsSync(MULTI_PIDS_FILE)) {
    const pids = JSON.parse(readFileSync(MULTI_PIDS_FILE, 'utf-8'));
    for (const [name, pid] of Object.entries(pids)) {
      if (killPid(pid, name)) killed = true;
    }
    try { unlinkSync(MULTI_PIDS_FILE); } catch { /* ignore */ }
  } else {
    log(`PID file not found: ${MULTI_PIDS_FILE}`);
  }
  if (force) {
    log('Force mode: sweeping ports 3001–3005...');
    for (const p of MULTI_PORTS) killByPort(p);
  }

// ── Single mode (default) ─────────────────────────────────────────────────────
} else {
  log('Mode: single — reading ' + SINGLE_PID_FILE);
  if (existsSync(SINGLE_PID_FILE)) {
    const pid = parseInt(readFileSync(SINGLE_PID_FILE, 'utf-8').trim(), 10);
    if (killPid(pid, 'app')) killed = true;
    try { unlinkSync(SINGLE_PID_FILE); } catch { /* ignore */ }
  } else {
    log(`PID file not found: ${SINGLE_PID_FILE}`);
  }
  if (force) {
    log(`Force mode: sweeping port ${PORT}...`);
    killByPort(PORT);
  }
}

if (!killed) log('Nothing was killed.');
log('=== kill_all.mjs done ===');
