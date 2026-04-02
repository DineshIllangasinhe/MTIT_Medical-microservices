/**
 * Kills processes listening on dev ports so `npm start` avoids EADDRINUSE.
 * Windows: netstat + taskkill. macOS/Linux: lsof + SIGKILL.
 */
const { execSync } = require('child_process');

const PORTS = [3001, 3002, 3003, 3004, 5000];

function killPid(pid) {
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
    } else {
      process.kill(Number(pid), 'SIGKILL');
    }
    console.log(`[free-dev-ports] stopped PID ${pid}`);
  } catch {
    // process may have exited
  }
}

function pidsOnPortWindows(port) {
  const out = execSync('netstat -ano -p TCP', { encoding: 'utf8' });
  const pids = new Set();
  const suffix = `:${port}`;
  for (const line of out.split('\n')) {
    if (!line.includes('LISTENING')) continue;
    const parts = line.trim().split(/\s+/);
    if (parts.length < 5) continue;
    const local = parts[1];
    if (!local.endsWith(suffix)) continue;
    const pid = parts[parts.length - 1];
    if (/^\d+$/.test(pid)) pids.add(pid);
  }
  return [...pids];
}

function pidsOnPortUnix(port) {
  try {
    const out = execSync(`lsof -i :${port} -t -sTCP:LISTEN`, { encoding: 'utf8' });
    return [...new Set(out.trim().split(/\n/).filter(Boolean))];
  } catch {
    return [];
  }
}

let any = false;
for (const port of PORTS) {
  const pids = process.platform === 'win32' ? pidsOnPortWindows(port) : pidsOnPortUnix(port);
  for (const pid of pids) {
    any = true;
    killPid(pid);
  }
}
if (!any) {
  console.log('[free-dev-ports] ports already free:', PORTS.join(', '));
}
