---
tmal-id: TEST-ENV-001
creator: tester
ai-assisted: true
verification-status: unverified
version: 0.1.0
---

# Environment Variables — CoffeeToGo Test Environment

This file documents all environment variables relevant for test runs.

**Note:** Never enter secrets into this file. This file only describes the variables and their defaults for testing. Production values are set via the shell or a non-committed `.env` file.

---

## Variables

| Variable | Default (Dev) | Required | Meaning |
|---|---|---|---|
| `PORT` | `3000` | no | Server port of the running application |
| `COFFEE_TO_GO_JWT_SECRET` | `coffee-to-go-dev-jwt-secret` | no | JWT secret for signing and verifying bearer tokens |
| `COFFEE_TO_GO_API_KEY` | `coffee-to-go-dev-api-key` | no | API key for external protection (not currently active in the demo scope) |

---

## Setting Variables

### Inline for a single command

```bash
PORT=4000 bash tests/test_scripts/start_all.sh --log
```

```bash
COFFEE_TO_GO_JWT_SECRET=my-secret bash tests/test_scripts/e2e_test.sh --log
```

### Export in the current shell session

```bash
export PORT=3000
export COFFEE_TO_GO_JWT_SECRET=coffee-to-go-dev-jwt-secret
```

### Via a local `.env` file (not committed)

```bash
# .env (project root, add to .gitignore)
PORT=3000
COFFEE_TO_GO_JWT_SECRET=coffee-to-go-dev-jwt-secret
```

Load in shell:
```bash
set -a && source .env && set +a
```

---

## Notes on Defaults

- The dev defaults are only suitable for local development and testing.
- `coffee-to-go-dev-jwt-secret` is a publicly known value and must not be used in production environments.
- For CI/CD pipelines, store the variables as protected pipeline secrets.
