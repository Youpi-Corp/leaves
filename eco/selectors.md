# Selectors to adapt

This flow relies on generic selectors. If a selector does not match, update them in `eco/userflow-after-login.mjs`.

## Default selectors (login)

- Email:
  - `input[data-testid="login-email"]`
  - `input[name="email"]`
  - `input[type="email"]`
  - `#email`
  - `input[autocomplete="email"]`
- Password:
  - `input[data-testid="login-password"]`
  - `input[name="password"]`
  - `input[type="password"]`
  - `#password`
  - `input[autocomplete="current-password"]`
- Submit button:
  - `button[data-testid="login-submit"]`
  - `button[type="submit"]`
  - `form button[type="submit"]`
  - `input[type="submit"]`
- Login proof (after submit):
  - `[data-testid="navbar-avatar"]`
  - `[data-testid="user-avatar"]`
  - `[aria-label="User menu"]`
  - `img[alt*="avatar"]`
  - `nav [role="button"][aria-haspopup="menu"]`

## data-testid recommendations

Adding explicit `data-testid` values helps stabilize the flow.

- `data-testid="login-email"`
- `data-testid="login-password"`
- `data-testid="login-submit"`
- `data-testid="navbar-avatar"` (or any stable element after login)

## Other pages

If routes change, update the `pages` list in `eco/userflow-after-login.mjs`.
For SPA pages that load slower data, you can add a specific `commands.wait.bySelector(...)` after each `commands.measure.start(url)`.
