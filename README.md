## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Precommit hook

```bash
npm run check
npm run lint
npm run type-check
npm run test:notest
commit message check validation
```

## Commit message format

```bash
build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
ci: Changes to our CI configuration files and scripts (example scopes: Gitlab, Travis, Circle, BrowserStack, SauceLabs)
docs: Documentation only changes
feat: A new feature
fix: A bug fix
perf: A code change that improves performance
refactor: A code change that neither fixes a bug nor adds a feature
style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
test: Adding missing tests or correcting existing tests
chore: Other changes that don't modify source or test files (.gitignore, .gitattributes etc).
```
