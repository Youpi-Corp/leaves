export default function buildLoginScript({ loginEmail, loginPassword }) {
  return `
    (function() {
      function docsToSearch() {
        const docs = [document];
        const iframes = Array.from(document.querySelectorAll('iframe'));
        for (const f of iframes) {
          try {
            if (f.contentDocument) docs.push(f.contentDocument);
          } catch (e) {
          }
        }
        return docs;
      }

      function setValInDocs(selector, value) {
        for (const doc of docsToSearch()) {
          const el = doc.querySelector(selector);
          if (!el) continue;

          el.focus();

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

      setValInDocs('input[type="email"]', ${JSON.stringify(loginEmail)});
      setValInDocs('input[type="password"]', ${JSON.stringify(loginPassword)});

      const okClick = clickValidate();
      if (!okClick) {
        for (const doc of docsToSearch()) {
          const submit = doc.querySelector('button[type="submit"], input[type="submit"]');
          if (submit) { submit.click(); break; }
        }
      }
    })();
  `;
}
