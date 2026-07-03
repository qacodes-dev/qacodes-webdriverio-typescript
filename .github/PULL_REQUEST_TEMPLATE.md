## What & why

<!-- What does this change do, and why is it needed? Link any related issue. -->

## Type of change

- [ ] New test / coverage
- [ ] Page Object change
- [ ] Framework / config change (wdio.conf.ts, CI, reporters)
- [ ] Docs
- [ ] Bug fix
- [ ] Other:

## Verification

<!-- How did you verify this? Paste relevant output. -->

- [ ] `npm run typecheck` passes (strict, zero errors)
- [ ] `HEADLESS=true npx wdio run wdio.conf.ts` passes locally
- [ ] New/changed specs live in the right suite (`smoke` / `regression`)
- [ ] No assertions in Page Objects; no `browser.pause()` / hard waits
- [ ] Tests set up their own state and are order-agnostic (parallel safe)

## Notes

<!-- Screenshots, trade-offs, follow-ups, anything a reviewer should know. -->
