# Agent Notes

## Project Notes

- Browser targets such as Arc, Zen, Firefox Nightly, and Dia do not support `javascript:` bookmarklets for page inspection or verification.
- Do not use `osascript`.
- Use DevTools for browser inspection and verification.

## Branch Roles

- `dev` is the source and build branch. It tracks source files, build scripts, generated `dist/` artifacts, the root userscript release artifact, userstyle files, and project docs.
- `main` is the lean release branch. It should only track the release-facing files already present there, typically `README.md`, `[Chat] Template Text Folders.user.js`, `Icon.svg`, `LICENSE`, and `assets/`.

## Dev Push Flow

1. Work from `dev`.
2. Check the worktree before editing:
   ```sh
   git status --short --branch
   ```
3. Edit source files under `src/`, `userstyle/`, `README.md`, or build scripts as needed.
4. Run the build whenever source, userstyle, userscript metadata, or release artifact content changes:
   ```sh
   npm run build
   ```
5. Verify the change with targeted checks. Prefer `rg` for string checks, and inspect the generated userscript metadata when version, matches, or update-log entries change.
6. Stage only the intended tracked files:
   ```sh
   git add <intended-files>
   ```
7. Review staged changes:
   ```sh
   git diff --cached --stat
   git diff --cached --name-status
   ```
8. Commit with a concise message:
   ```sh
   git commit -m "<type>: <summary>"
   ```
9. Push `dev`:
   ```sh
   git push origin dev
   ```

## Main Release Flow

1. Fetch latest remote state:
   ```sh
   git fetch origin
   ```
2. Switch to `main`:
   ```sh
   git switch main
   ```
3. Restore only release files from `dev`, usually:
   ```sh
   git restore --source dev -- README.md '[Chat] Template Text Folders.user.js'
   ```
4. Do not add `src/`, `dist/`, `node_modules/`, or other dev-only untracked files to `main`.
5. Verify release metadata in `[Chat] Template Text Folders.user.js`, and verify README reflects the same public support surface.
6. Stage only release files:
   ```sh
   git add README.md '[Chat] Template Text Folders.user.js'
   ```
7. Commit with the release version:
   ```sh
   git commit -m "release: [YYYYMMDD] vX.Y.Z"
   ```
8. Push `main`:
   ```sh
   git push origin main
   ```
9. Switch back to `dev` after release work:
   ```sh
   git switch dev
   ```

## Verification Checklist

- Confirm the current branch before staging or pushing.
- Confirm `git status --short --branch` has no unexpected tracked modifications.
- Confirm staged files match the intended branch role.
- Confirm generated userscript metadata contains the expected `@version`, `@update-log`, and `@match` entries.
- Use targeted `rg` checks for removed domains, old URLs, or other strings that must not remain.
- Confirm the latest local commit matches the pushed remote branch:
  ```sh
  git log -1 --oneline --decorate
  git log -1 --oneline --decorate origin/<branch>
  ```
