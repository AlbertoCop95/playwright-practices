import { test as base } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';

type LogLevel = 'debug'|'info'|'warn'|'error';
type Logger = {
  level: LogLevel;
  traceId: string;                       // per-test trace/correlation id
  log: (level: LogLevel, ev: Record<string, unknown>) => void;
  info: (ev: Record<string, unknown>) => void;
  debug: (ev: Record<string, unknown>) => void;
  warn: (ev: Record<string, unknown>) => void;
  error: (ev: Record<string, unknown>) => void;
  attach: () => Promise<void>;           // attach file to PW report
};

export const test = base.extend<{ logger: Logger }>({
  logger: async ({}, use, info) => {
    const level = (process.env.LOG_LEVEL as LogLevel) ?? 'info';
    const fileSafe = info.file.replace(/[^\w.-]+/g, '_');
    const dir = path.join('reports', 'logs');
    fs.mkdirSync(dir, { recursive: true });
    const logfile = path.join(dir, `${fileSafe}.jsonl`);

    const traceId = randomBytes(8).toString('hex'); // per-test id

    const write = (line: unknown) => fs.appendFileSync(logfile, JSON.stringify(line) + '\n');

    const baseFields = {
      testId: `${path.basename(info.file)}:${info.line ?? 0}`,
      testName: info.titlePath.join(' › ')
    };

    const logger: Logger = {
      level,
      traceId,
      log(lvl, ev) {
        const ts = new Date().toISOString();
        const payload = { ts, level: lvl, traceId, ...baseFields, ...ev };
        write(payload);
        // Console echo (compact) for quick CI read
        if (['info','warn','error'].includes(lvl)) {
          console.log(`${ts} [${lvl}] ${ev['msg'] ?? ''} ${JSON.stringify(ev)}`);
        } else if (level === 'debug') {
          console.debug(`${ts} [debug] ${JSON.stringify(ev)}`);
        }
      },
      info(ev){ this.log('info', ev); },
      debug(ev){ if (this.level === 'debug') this.log('debug', ev); },
      warn(ev){ this.log('warn', ev); },
      error(ev){ this.log('error', ev); },
      async attach(){
        await info.attach('api-logs', { path: logfile, contentType: 'text/plain' });
      }
    };

    await use(logger);
    await logger.attach();
  }
});

export const expect = test.expect;
