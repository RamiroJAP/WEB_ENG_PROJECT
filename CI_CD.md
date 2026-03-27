# 🚀 CI/CD Pipeline Documentation

This project uses **GitHub Actions** for automated testing, building, and deployment.

## Pipeline Overview

The CI/CD pipeline automatically runs checks on every pull request and push to the main branch:

```
┌─────────────────────────────────────────────────────────┐
│  Pull Request / Push to Main                            │
└────────────────┬────────────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │ Run in Parallel │
        └────────┬────────┘
        │
        ├─→ 1️⃣ Validation Layer
        │   ├─ Lint code (ESLint)
        │   ├─ Check for hardcoded secrets
        │   └─ Check dependency vulnerabilities
        │
        ├─→ 2️⃣ Build Layer
        │   ├─ Compile project (Vite)
        │   ├─ Verify build output
        │   └─ Check bundle size
        │
        ├─→ 3️⃣ Test Layer
        │   └─ Run automated tests
        │
        └─→ 4️⃣ Security Layer
            ├─ NPM audit
            ├─ TruffleHog secret scan
            └─ Dependency analysis

        All must PASS ✅ to continue
                 │
        ┌────────▼────────┐
        │ Code Review     │
        │ (1 Approval)    │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │ Merge to Main   │
        └────────┬────────┘
                 │
      (Only on successful push to main)
                 │
        ┌────────▼────────┐
        │ 5️⃣ Deploy Layer │
        │ Firebase Hosting│
        └─────────────────┘
                 │
            ✅ LIVE!
```

## Files Explanation

### 📋 Workflow Files

Each workflow file (`*.yml`) handles one aspect of the pipeline:

| File | Purpose | When it runs |
|------|---------|-------------|
| **1-validation.yml** | Lint, secrets, & dependencies | PR & Push to main |
| **2-build.yml** | Build the project | PR & Push to main |
| **3-test.yml** | Run test suite | PR & Push to main |
| **4-security.yml** | Security scanning | PR & Push + Daily |
| **5-deploy.yml** | Deploy to Firebase | Push to main only |

### 📝 Setup Files

- **BRANCH_PROTECTION_SETUP.md**: How to enable branch protection rules
- **CI_CD.md**: This file

---

## What Each Workflow Does

### 1️⃣ Validation (`1-validation.yml`)

**What it checks:**
- ✅ Code quality with ESLint
- ✅ No hardcoded secrets (API keys, passwords)
- ✅ No .env files tracked in Git
- ✅ No critical npm vulnerabilities

**Why it matters:**
- Prevents code quality issues
- Stops accidental secret leaks
- Finds dependency security issues early

**If it fails:**
```
❌ Linting failed!
   Fix the ESLint errors reported and push again

❌ Hardcoded secrets found!
   Remove secrets and use process.env.VARIABLE instead

❌ Critical vulnerabilities!
   Run: npm audit fix
```

---

### 2️⃣ Build (`2-build.yml`)

**What it does:**
- Runs `npm run build` to compile the project
- Verifies `dist/` folder has output
- Checks bundle size (warning if > 10MB)
- Saves build artifact for deployment

**Why it matters:**
- Makes sure code actually compiles
- Catches import/syntax errors
- Produces deployable artifact

**If it fails:**
```
❌ Build output is empty!
   Check if npm run build is configured in package.json
   Verify Vite setup is correct

⚠️  Build size warning (> 10MB)
   Consider code splitting or removing unused dependencies
```

---

### 3️⃣ Test (`3-test.yml`)

**What it does:**
- Runs `npm test` (if configured)
- Shows warning if no tests are set up
- Can track code coverage (when enabled)

**Why it matters:**
- Ensures features work correctly
- Prevents regressions
- Documents expected behavior

**If tests aren't set up:**
```
ℹ️  No test script found
    To add tests, install:
    npm install --save-dev vitest @testing-library/react
```

**To enable tests:**

1. Install testing library:
   ```bash
   npm install --save-dev vitest @testing-library/react @testing-library/user-event
   ```

2. Add to `package.json`:
   ```json
   "scripts": {
     "test": "vitest"
   }
   ```

3. Create test files: `src/**/*.test.jsx`
   ```javascript
   import { describe, it, expect } from 'vitest';
   import { render, screen } from '@testing-library/react';
   import MyComponent from './MyComponent';
   
   describe('MyComponent', () => {
     it('renders correctly', () => {
       render(<MyComponent />);
       expect(screen.getByText(/hello/i)).toBeInTheDocument();
     });
   });
   ```

---

### 4️⃣ Security (`4-security.yml`)

**What it scans:**
- 🔍 NPM audit for vulnerabilities
- 🔍 Snyk analysis (requires token)
- 🔍 TruffleHog for secret leaks
- 📊 License compliance

**Why it matters:**
- Prevents security breaches
- Stops accidental credential leaks
- Keeps dependencies safe

**If vulnerabilities found:**
```bash
# Fix automatically
npm audit fix

# Or if that doesn't work, use force
npm audit fix --force

# View what changed
git diff

# Commit and push
git commit -am "fix: resolve npm vulnerabilities"
```

**To enable Snyk scanning:**
1. Sign up: https://snyk.io
2. Add token to GitHub Secrets: `SNYK_TOKEN`
3. Snyk will auto-scan on PR/push

---

### 5️⃣ Deploy (`5-deploy.yml`)

**What it does:**
- Waits for ALL checks to pass first
- Rebuilds the project
- Validates secrets are configured
- Deploys to Firebase Hosting
- Shows deployment status

**When it runs:**
- Only on **successful push to main**
- Not on PRs or feature branches
- Skips if any check failed

**If deployment fails:**
```
Previous stable version stays live!
Fix the issue locally and push again.
```

---

## 🔐 Secrets Management

### Adding Secrets to GitHub

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add required secrets:

```
FIREBASE_SERVICE_ACCOUNT_WEB_ENG_PROJECT_D657D
├─ This is your Firebase service account JSON
└─ Get it from: Firebase Console → Project Settings → Service Accounts
```

### ⚠️ NEVER Commit Secrets

**❌ Wrong:**
```javascript
const apiKey = "AIza1234567890abcdef...";  // NEVER!
```

**✅ Right:**
```javascript
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
```

**Setup `.env.local` for local development:**
```bash
REACT_APP_FIREBASE_API_KEY = "your_key_here"
REACT_APP_FIREBASE_AUTH_DOMAIN = "your_domain"
```

**Always add to `.gitignore`:**
```
.env
.env.local
.env.*.local
*.key
*.pem
firebase-key.json
```

---

## 🚫 Branch Protection Rules

This repo has **branch protection on main**. This means:

- ❌ You cannot push directly to `main`
- ✅ You must create a **Pull Request**
- ✅ All **status checks must pass**
- ✅ **1 approval** required before merge
- ✅ Branch must be **up to date** with main

See [BRANCH_PROTECTION_SETUP.md](./BRANCH_PROTECTION_SETUP.md) for full setup guide.

---

## 📊 Monitoring Workflows

### View Workflow Status

1. Go to **Actions** tab on GitHub
2. Click any workflow run
3. See each job and its logs

### Common Status Icons

| Icon | Meaning | Action |
|------|---------|--------|
| ✅ | Passed | Good to go! |
| ❌ | Failed | Fix the issue and push again |
| ⏳ | Running | Wait for completion |
| ⏭️ | Skipped | Skipped by workflow condition |

---

## 🔧 Troubleshooting

### Issue: Workflows not running

**Solution:**
- Workflows must be in `.github/workflows/` folder
- File must have `.yml` or `.yaml` extension  
- Must match trigger conditions (e.g., `on: pull_request`)
- Workflows run on GitHub's runner, not your machine

### Issue: Status checks won't pass

**Solution:**
```bash
# Run checks locally first
npm run lint
npm run build
npm test  # if tests exist

# Fix errors, then push
```

### Issue: "Can't merge" button disabled

**Solution:**
- Check if all status checks are green ✅
- Wait for workflow completion (can take 2-5 min)
- Request approval from code owner if needed
- Make sure branch is up to date with main

### Issue: Deployment stuck/failed

**Solution:**
1. Check deployment logs in **Actions** tab
2. Common issues:
   - Missing Firebase secrets
   - Build failed (check 2-build.yml logs)
   - Firebase project not configured

---

## 📖 Useful Links

- GitHub Actions Docs: https://docs.github.com/en/actions
- Vite Guide: https://vitejs.dev/
- Firebase Hosting: https://firebase.google.com/docs/hosting
- ESLint Rules: https://eslint.org/docs/rules/
- Vitest (Testing): https://vitest.dev/

---

## 🎯 Next Steps

1. **Enable Branch Protection:** See [BRANCH_PROTECTION_SETUP.md](./BRANCH_PROTECTION_SETUP.md)
2. **Add Tests:** Create tests in `src/**/*.test.jsx`
3. **Set Secrets:** Add Firebase token to GitHub Secrets
4. **Monitor Workflows:** Check **Actions** tab after each PR

---

**Need help?** Check GitHub Actions logs for detailed error messages!
