// eco/userflow-after-login.mjs

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

  const href = await commands.js.run('return document.location.href');
  const title = await commands.js.run('return document.title');
  const text = await commands.js.run(
    'return (document.body && document.body.innerText) ? document.body.innerText.slice(0, 200) : ""'
  );
  console.log('After navigate:', { href, title, text });

  // --- Fill + submit (search document + same-origin iframes) ---
  await commands.js.run(`
    (function() {
      function docsToSearch() {
        const docs = [document];
        const iframes = Array.from(document.querySelectorAll('iframe'));
        for (const f of iframes) {
          try {
            if (f.contentDocument) docs.push(f.contentDocument);
          } catch (e) {
            // cross-origin iframe -> ignore
          }
        }
        return docs;
      }

      function setValInDocs(selector, value) {
        for (const doc of docsToSearch()) {
          const el = doc.querySelector(selector);
          if (!el) continue;

          el.focus();

          // React/Vue-safe native setter
          const proto = el.tagName === 'TEXTAREA'
            ? doc.defaultView.HTMLTextAreaElement.prototype
            : doc.defaultView.HTMLInputElement.prototype;

          const desc = Object.getOwnPropertyDescriptor(proto, 'value');
          if (desc && typeof desc.set === 'function') {
            desc.set.call(el, value);
          } else {
            el.value = value;
          }

          el.dispatchEvent(new doc.defaultView.Event('input', { bubbles: true }));
          el.dispatchEvent(new doc.defaultView.Event('change', { bubbles: true }));
          el.blur();
          return true;
        }
        return false;
      }

      function clickValidate() {
        for (const doc of docsToSearch()) {
          const buttons = Array.from(doc.querySelectorAll('button'));
          const btn = buttons.find(b => (b.innerText || '').trim() === 'Validate');
          if (btn) {
            btn.click();
            return true;
          }
        }
        return false;
      }

      const okEmail = setValInDocs('input[type="email"]', ${JSON.stringify(loginEmail)});
      const okPass  = setValInDocs('input[type="password"]', ${JSON.stringify(loginPassword)});

      // Helpful debug to surface in logs if needed (Browsertime may not return this, but keeps logic clear)
      if (!okEmail || !okPass) {
        // If you need deeper debug later, you can throw:
        // throw new Error('Could not find email/password inputs in document or same-origin iframes');
      }

      const okClick = clickValidate();
      if (!okClick) {
        // fallback: click first submit button in any doc (avoid Search by preferring "Validate", but as fallback...)
        for (const doc of docsToSearch()) {
          const submit = doc.querySelector('button[type="submit"], input[type="submit"]');
          if (submit) { submit.click(); break; }
        }
      }
    })();
  `);

  const postLoginHref = await waitForLoginSuccess(commands, loginUrl, 30000);
  console.log('Logged in, URL is now:', postLoginHref);

  // ---- Audit pages ----
  const auditedPages = [];

  for (const pageUrl of pages) {
    const alias = makeAlias(pageUrl);

    await commands.measure.start(alias);
    await commands.navigate(pageUrl);
    await commands.measure.stop();

    auditedPages.push(pageUrl);
  }

  console.log(`Pages audited (${auditedPages.length}): ${auditedPages.join(', ')}`);
}
