#!/usr/bin/env node
/**
 * component_test.mjs — Run Vitest unit tests (no server required)
 *
 * Usage (run from project root):
 *   node tests/test_scripts/component_test.mjs [--log] [--component <name>]
 *
 * Options:
 *   --log               Write output to tests/test_runs/component_test_<timestamp>.log
 *   --component <name>  Run tests for one component only
 *
 * Valid component values:
 *   order_terminal · brewing_station · delivery_robot · process_control · web_channel
 */
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const VALID_COMPONENTS = [
  'order_terminal', 'brewing_station', 'delivery_robot', 'process_control', 'web_channel',
];

const SRC_DIR  = resolve('src/ts');
const LOG_DIR  = 'tests/test_runs';
const args     = process.argv.slice(2);
const doLog    = args.includes('--log');
const compIdx  = args.indexOf('--component');
const component = compIdx >= 0 ? args[compIdx + 1] : null;

if (component && !VALID_COMPONENTS.includes(component)) {
  console.error(`Invalid --component "${component}". Valid values: ${VALID_COMPONENTS.join(', ')}`);
  process.exit(1);
}

const lines = [];
const ts    = () => new Date().toISOString();

function log(msg) {
  const entry = `[${ts()}] ${msg}`;
  console.log(entry);
  lines.push(entry);
}

log('=== component_test.mjs started ===');
log(component ? `Component filter: ${component}` : 'Running all component tests');

// Build npm run args — vitest run [pattern]
const npmArgs = component
  ? ['run', 'test:run', '--', `tests/${component}.test.ts`]
  : ['run', 'test:run'];

const result = spawnSync('npm', npmArgs, {
  cwd: SRC_DIR, encoding: 'utf-8', shell: true,
});
if (result.stdout) { process.stdout.write(result.stdout); lines.push(result.stdout); }
if (result.stderr) { process.stderr.write(result.stderr); lines.push(result.stderr); }

const ok = result.status === 0;
log(ok
  ? '=== All tests passed ==='
  : `=== Tests FAILED (exit ${result.status}) ===`);

if (doLog) {
  mkdirSync(LOG_DIR, { recursive: true });
  const stamp   = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const logFile = join(LOG_DIR, `component_test_${stamp}.log`);
  writeFileSync(logFile, lines.join('\n') + '\n', 'utf-8');
  console.log(`Log written: ${logFile}`);
}

process.exit(result.status ?? 0);
