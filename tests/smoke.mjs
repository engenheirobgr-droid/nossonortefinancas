import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer';

const port = 4174;
const baseUrl = `http://127.0.0.1:${port}`;
const browserCandidates = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];
const executablePath = process.platform === 'win32'
  ? browserCandidates.find(candidate => existsSync(candidate))
  : undefined;

function waitForServer(url, timeoutMs = 30_000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          resolve();
          return;
        }
      } catch {
        // Keep polling until Vite is ready.
      }

      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Timed out waiting for ${url}`));
        return;
      }

      setTimeout(poll, 500);
    };

    poll();
  });
}

const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port)],
  { stdio: ['ignore', 'pipe', 'pipe'] }
);

let browser;

try {
  await waitForServer(baseUrl);

  browser = await puppeteer.launch({
    headless: 'new',
    executablePath,
    args: ['--disable-dev-shm-usage']
  });

  const page = await browser.newPage();
  const browserMessages = [];

  page.on('console', message => {
    if (['error', 'warning'].includes(message.type())) {
      browserMessages.push(`${message.type()}: ${message.text()}`);
    }
  });

  page.on('pageerror', error => {
    browserMessages.push(`pageerror: ${error.message}`);
  });

  await page.goto(baseUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
  await page.waitForFunction(
    () => document.body.innerText.includes('Nosso Norte') && document.body.innerText.includes('Sou Bruno'),
    { timeout: 30_000 }
  );

  const bodyText = await page.evaluate(() => document.body.innerText);

  if (!bodyText.includes('Sou Maiara')) {
    throw new Error('Login screen did not render both configured users.');
  }

  await page.evaluate(() => {
    const button = [...document.querySelectorAll('button')]
      .find(element => element.innerText.includes('Sou Bruno'));
    button?.click();
  });

  await page.waitForFunction(
    () => document.body.innerText.includes('Olá, Bruno'),
    { timeout: 10_000 }
  );

  for (const digit of ['1', '3', '5', '8']) {
    await page.evaluate(value => {
      const button = [...document.querySelectorAll('button')]
        .find(element => element.innerText.trim() === value);
      button?.click();
    }, digit);
  }

  await page.evaluate(() => {
    const button = [...document.querySelectorAll('button')]
      .find(element => element.innerText.includes('Entrar'));
    button?.click();
  });

  await page.waitForFunction(
    () => document.body.innerText.includes('Meu Norte') || document.body.innerText.includes('Nosso Norte'),
    { timeout: 30_000 }
  );

  const blockingMessages = browserMessages.filter(message =>
    !message.includes('Download the React DevTools') &&
    !message.includes('Tailwind')
  );

  if (blockingMessages.length > 0) {
    throw new Error(`Browser reported errors:\n${blockingMessages.join('\n')}`);
  }

  console.log('Smoke test passed: Vite app renders and completes Bruno login.');
} finally {
  if (browser) {
    await browser.close();
  }
  if (process.platform === 'win32' && server.pid) {
    spawn('taskkill', ['/pid', String(server.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    server.kill();
  }
}
