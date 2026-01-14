// eco/userflow-after-login.mjs

import buildLoginScript from './login-script.mjs';

const DEFAULT_PAGES = ['/login', '/', '/library', '/profile', '/edition/dashboard/', '/edition/editor'];

function makeAlias(url) {
  return new URL(url).pathname.replace(/\//g, '_').replace(/^_/, '') || 'home';
}

async function waitForLoginSuccess(commands, loginUrl, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const href = await commands.js.run('return document.location.href');
    if (href && href !== loginUrl) return href;
    await commands.wait.byTime(250);
  }

  const snapshot = await commands.js.run(`
    (function() {
      const href = document.location.href;
      const title = document.title;
      const text = (document.body && document.body.innerText) ? document.body.innerText.slice(0, 500) : '';
      const iframeCount = document.querySelectorAll('iframe').length;
      return { href, title, iframeCount, text };
    })();
  `);

  throw new Error(`Login did not succeed within timeout. Snapshot: ${JSON.stringify(snapshot)}`);
}

export default async function userFlow(context, commands) {
  const options = context?.options ?? {};
  const browsertimeOptions = options.browsertime ?? options;

  const baseUrl = browsertimeOptions.baseUrl;
  const loginEmail = browsertimeOptions.loginEmail;
  const loginPassword = browsertimeOptions.loginPassword;

  if (!baseUrl) throw new Error('Missing --browsertime.baseUrl');
  if (!loginEmail || !loginPassword) {
    throw new Error('Missing login credentials. Provide --browsertime.loginEmail and --browsertime.loginPassword');
  }

  const loginUrl = new URL('/login', baseUrl).toString();
  const pages = DEFAULT_PAGES.map((path) => new URL(path, baseUrl).toString());

  await commands.navigate(loginUrl);
  await commands.wait.byTime(1000);

  await commands.js.run(buildLoginScript({ loginEmail, loginPassword }));

  const postLoginHref = await waitForLoginSuccess(commands, loginUrl, 30000);
  console.log('Logged in, URL is now:', postLoginHref);

  for (const pageUrl of pages) {
    const alias = makeAlias(pageUrl);

    await commands.measure.start(alias);
    await commands.navigate(pageUrl);
    await commands.measure.stop();
  }

  console.log(`Pages audited (${pages.length}): ${pages.join(', ')}`);
}
