# CI/CD & Security Setup Guide

## Overview
Your repository now has a complete, security-focused CI/CD pipeline that prevents:
- Direct commits to main branch ❌
- Code with bugs or linting errors ❌
- Hardcoded secrets/credentials ❌
- Vulnerable dependencies ❌
- Unreviewed code ❌
- Unapproved deployments ❌

---

## Workflow Structure

### 1️⃣ **test.yml** - Code Quality
**When:** PR → main/develop, Push to main/develop
**What it does:**
- Runs ESLint for code quality
- Validates package.json
- Checks for dependency conflicts
- **BLOCKS merge if:** Linting fails or dependencies broken

```
✓ npm run lint
✓ npm ls (check dependencies)
✓ Validate package.json
```

---

### 2️⃣ **security.yml** - Secret & Vulnerability Scanning
**When:** PR → main/develop, Push to main/develop, Daily 2 AM UTC
**What it does:**
- Scans for hardcoded API keys, tokens, secrets
- Runs `npm audit` for vulnerable packages
- Checks for credentials in `.env` files
- Verifies `.gitignore` protection
- **BLOCKS merge if:** Secrets found or vulnerabilities detected

```
✓ TruffleHog secret detection
✓ Manual credential scanning
✓ npm audit --production
✓ .gitignore verification
```

❌ **BLOCKS if found:**
- Hardcoded `FIREBASE_KEY`, `API_KEY`, `SECRET`, `TOKEN`
- `.env` files committed
- High/Critical npm vulnerabilities

---

### 3️⃣ **build.yml** - Build Validation
**When:** PR → main/develop, Push to main/develop
**What it does:**
- Installs dependencies
- Runs `npm run build`
- Validates `dist/` output exists
- Checks `dist/index.html` created
- **BLOCKS merge if:** Build fails

```
✓ npm ci
✓ npm run build
✓ Verify dist/ directory
✓ Check dist/index.html
```

---

### 4️⃣ **pr-validation.yml** - Pull Request Checks
**When:** PR to main/develop
**What it does:**
- Ensures branch naming convention (feature/, bugfix/, etc.)
- Validates PR description provided
- Warns about critical file changes (package.json, firebase.json)
- Checks for merge conflicts
- **BLOCKS if:** No PR description or direct PR from main

```
✓ Branch name validation: feature/*, bugfix/*, hotfix/*
✓ PR description required
✓ Detects breaking changes
✓ Warns about config file modifications
```

---

### 5️⃣ **deploy.yml** - Production Deployment
**When:** Push to main (only after all checks pass)
**What it does:**
- Validates deploy prerequisites
- Checks all required secrets configured
- Rebuilds application
- Deploys to Firebase Hosting (web-eng-project-d657d)
- **BLOCKS if:** Not main branch or secrets missing

```
✓ Only main branch → Firebase
✓ Rebuild before deploy
✓ Verify secrets configured
✓ Deploy to Firebase Hosting
```

---

## GitHub Branch Protection Setup

### ⚙️ Configure for MAIN Branch:

Go to: **Settings → Branches → Add rule**

**Pattern:** `main`

**Required Settings:**

```
✅ Require a pull request before merging
   - Required approvals: 1
   - Dismiss stale PR approvals: YES
   - Require status checks to pass before merging: YES

✅ Require status checks to pass:
   - Run Tests & Linting (test.yml)
   - Security Scan (security.yml)
   - Build Validation (build.yml)

✅ Require branches to be up to date before merging: YES

✅ Restrict who can push to matching branches:
   - Only allow administrators: YES

✅ Include administrators in restrictions: YES

✅ Allow force pushes:
   - Do not allow force pushes

✅ Allow deletions: NO
```

### ⚙️ Configure for DEVELOP Branch (Optional):

**Pattern:** `develop`

**Relaxed Settings** (for faster development):
```
✅ Require a pull request: YES (but 0 approvals ok)
✅ Require status checks: YES (same as main)
✅ Require branches up to date: NO (faster merges)
✅ Allow force pushes: YES (for maintainers only)
```

---

## Development Workflow

### ✅ Correct Way:

```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/my-feature

# 2. Make changes
# 3. Commit with good messages
git commit -m "feat: add user authentication"

# 4. Push to feature branch
git push origin feature/my-feature

# 5. Create Pull Request on GitHub
# 6. Add descriptive PR description
# 7. Wait for all checks to pass ✅

# 8. Request review
# 9. After approval, merge PR
# 10. Auto-deploy to Firebase (on main)
```

### ❌ What Will FAIL:

```bash
# ❌ Direct push to main
git push origin main
# ERROR: Permission denied - branch protected

# ❌ Commit with secrets
echo "API_KEY=sk-1234567890abcdef" >> src/config.js
git commit -m "add config"
git push origin feature/something
# ERROR: Security scan detected hardcoded credentials

# ❌ Commit build fails
npm run lint  # errors!
git commit -m "fix bugs"
git push origin develop  # PR created
# ERROR: Build failed - PR cannot merge

# ❌ Commit with .env file
git add .env
git commit -m "add env"
# ERROR: Security scan detected .env file
```

---

## Common Issues & Solutions

### 🚨 Issue: "ESLint errors found"
```bash
# Fix linting errors
npm run lint:fix
git add .
git commit -m "fix: linting errors"
git push origin feature/my-feature
```

### 🚨 Issue: "Hardcoded secrets detected"
```bash
# Remove secrets, use environment variables
# Before:
const API_KEY = "sk-12345";

# After:
const API_KEY = process.env.VITE_FIREBASE_API_KEY;

# Add to .gitignore
echo ".env.local" >> .gitignore
git commit -m "fix: use environment variables for secrets"
```

### 🚨 Issue: "Build failed"
```bash
# Check build errors locally
npm run build
# Fix compilation errors
git add .
git commit -m "fix: build errors"
git push origin feature/my-feature
```

### 🚨 Issue: "npm audit found vulnerabilities"
```bash
# Check vulnerabilities
npm audit

# Fix if possible
npm audit fix --production

# If can't fix, require review and approval
# Document why vulnerability is acceptable
```

---

## Secrets Management

### ✅ DO:
- Use environment variables: `process.env.VITE_*`
- Add secrets to GitHub Settings → Secrets → New repository secret
- Use `.env.local` locally (add to `.gitignore`)
- Reference secrets in workflows: `${{ secrets.SECRET_NAME }}`

### ❌ DON'T:
- Hardcode API keys in source code
- Commit `.env` files
- Share secrets in PR descriptions
- Use secrets in workflow logs
- Put secrets in comments

### 📝 Firebase Secrets Required:
```
Named: FIREBASE_SERVICE_ACCOUNT_WEB_ENG_PROJECT_D657D
Value: [Your Firebase service account JSON]
Setting: Repository secret (used in deploy.yml)
```

---

## Viewing Workflow Results

### 📊 In GitHub UI:
1. Go to repository
2. Click "Actions" tab
3. See all workflow runs
4. Click a run to see details
5. Expand jobs to see logs

### 📊 For Failed Workflows:
1. Click the failed workflow
2. Click "Jobs" section
3. Expand the failed job
4. Read error message
5. Fix locally
6. Push to update PR

---

## Disabling Workflows (Temporary)

If you need to pause workflows:

```yaml
# In the .yml file, change:
on:
  pull_request:

# To disable, comment out:
# on:
#   pull_request:
```

⚠️ **NOT RECOMMENDED** - These protections keep your code safe!

---

## Summary of Protection

| Check | Location | Blocks Merge? | Runs On |
|-------|----------|---------------|---------|
| Linting | test.yml | ✅ YES | PR/Push |
| Build | build.yml | ✅ YES | PR/Push |
| Security | security.yml | ✅ YES | PR/Push/Daily |
| PR Validation | pr-validation.yml | ✅ YES | PR only |
| Review | Branch Protection | ✅ YES | Before merge |
| Deploy | deploy.yml | ✅ Main only | After merge |

---

## Questions?

Each workflow has detailed logging. Check the "Actions" tab in GitHub for full logs and error messages.

**Happy secure coding! 🔐**
