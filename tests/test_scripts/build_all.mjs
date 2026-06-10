#!/usr/bin/env node
/**
 * build_all.mjs — Compile TypeScript to dist/
 *
 * Usage (run from project root):
 *   node tests/test_scripts/build_all.mjs [--log]
 *
 * Options:
 *   --log   Write build output to tests/test_runs/build_<timestamp>.log
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SRC_DIR  = resolve('src/ts');
const LOG_DIR  = 'tests/test_runs';
const args     = process.argv.slice(2);
const doLog    = args.includes('--log');

const lines = [];
const ts    = () => new Date().toISOString();

function log(msg) {
  const entry = `[${ts()}] ${msg}`;
  console.log(entry);
  lines.push(entry);
}

function addOutput(out, err) {
  if (out) { process.stdout.write(out); lines.push(out); }
  if (err) { process.stderr.write(err); lines.push(err); }
}

log('=== build_all.mjs started ===');
log(`Source dir: ${SRC_DIR}`);

// ── npm install ───────────────────────────────────────────────────────────────
log('Running: npm install...');
const install = spawnSync('npm', ['install'], {
  cwd: SRC_DIR, encoding: 'utf-8', shell: true,
});
addOutput(install.stdout, install.stderr);
if (install.status !== 0) {
  log(`ERROR: npm install failed (exit ${install.status})`);
  flush(); process.exit(1);
}
log('npm install OK');

// ── npm run build ─────────────────────────────────────────────────────────────
log('Running: npm run build (tsc)...');
const build = spawnSync('npm', ['run', 'build'], {
  cwd: SRC_DIR, encoding: 'utf-8', shell: true,
});
addOutput(build.stdout, build.stderr);
if (build.status !== 0) {
  log(`ERROR: build failed (exit ${build.status})`);
  flush(); process.exit(1);
}
log('Build OK');
log('=== build_all.mjs completed ===');
flush();

function flush() {
  if (!doLog) return;
  mkdirSync(LOG_DIR, { recursive: true });
  const stamp   = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const logFile = join(LOG_DIR, `build_${stamp}.log`);
  writeFileSync(logFile, lines.join('\n') + '\n', 'utf-8');
  console.log(`Log written: ${logFile}`);
}
