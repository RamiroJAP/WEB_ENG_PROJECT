# 🔒 Branch Protection Setup Guide

This document explains how to set up branch protection rules to prevent direct commits to main and enforce all checks.

## Why Branch Protection?

- ❌ **No direct commits** to main branch  
- ✅ **Requires pull requests** for all changes
- 🤖 **All checks must pass** before merge  
- 👥 **Requires code review** approval
- 🔐 **Prevents force pushes** and deletions

## Setup Instructions

### Step 1: Go to Repository Settings

1. On GitHub, go to your repository
2. Click **Settings** (top right)
3. Click **Branches** (left sidebar)
4. Click **Add rule**

### Step 2: Configure Branch Protection Rule

**Branch name pattern:** `main`

### Step 3: Enable Required Settings

Check these boxes:

✅ **Require a pull request before merging**
   - Required approving reviews: **1**
   - Require review from code owners: (optional)
   - Dismiss stale pull request approvals: ✅

✅ **Require status checks to pass before merging**
   - Required status checks that must pass:
     - `Lint Code`
     - `Check for Hardcoded Secrets`
     - `Check Dependencies`
     - `Build Project`
     - `Run Tests`
     - `NPM Audit`
     - `Dependency Security Check`
     - `Secret Leakage Detection`

   ⚠️ **Make sure to search and select each of these:**
   ```
   1-validation.yml / Lint Code
   1-validation.yml / Check for Hardcoded Secrets
   1-validation.yml / Check Dependencies
   2-build.yml / Build Project
   3-test.yml / Run Tests
   4-security.yml / NPM Audit
   4-security.yml / Dependency Security Check
   4-security.yml / Secret Leakage Detection
   ```

✅ **Require branches to be up to date before merging**
   - Automatically dismiss stale PR approvals when new commits are pushed

✅ **Include administrators**
   - This applies to you too! Even admins need to follow the rules

✅ **Restrict who can push to matching branches** (optional but recommended)
   - Only admins can push directly

✅ **Lock branch** (optional for extra safety)
   - Prevent deletion

### Step 4: Save Changes

Click **Create** or **Update** to save the rule.

## How It Works

### For Pull Requests:

```
Your Feature Branch
        ↓
    [Create PR]  
        ↓
[All Checks Run in Parallel]
├─ ✅ Lint Code
├─ ✅ Check for Hardcoded Secrets
├─ ✅ Check Dependencies
├─ ✅ Build Project
├─ ✅ Run Tests
├─ ✅ NPM Audit
├─ ✅ Dependency Security Check
└─ ✅ Secret Leakage Detection
        ↓
[1+ Reviews Needed]
        ↓
  [Merge to Main]
        ↓
[Deploy Automatically]
        ↓
   [Live on Firebase]
```

### For Direct Push to Main:

❌ **BLOCKED** - You must use a Pull Request instead

```bash
# This will FAIL:
git push origin main

# You must do this instead:
git push origin feature-branch
# Then create PR on GitHub
```

## Environment Variables & Secrets

### How to Add Secrets Safely:

1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Add your secrets (used by deploy workflow):
   - `FIREBASE_SERVICE_ACCOUNT_WEB_ENG_PROJECT_D657D`: Your Firebase service account key (JSON)

### ⚠️ NEVER commit:

```
❌ .env
❌ .env.local
❌ firebase-key.json
❌ API keys
❌ Database passwords
```

Use `process.env.VARIABLE_NAME` instead:

```javascript
// ✅ CORRECT
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
};

// ❌ WRONG
const firebaseConfig = {
  apiKey: "AIza1234567890...",  // Never hardcode!
};
```

## Workflow Files Explained

| File | Purpose | Triggers |
|------|---------|----------|
| `1-validation.yml` | Linting & secrets detection | PR & Push |
| `2-build.yml` | Compiles the project | PR & Push |
| `3-test.yml` | Runs tests | PR & Push |
| `4-security.yml` | Security scanning | PR & Push & Daily |
| `5-deploy.yml` | Deploys to Firebase | Push to main only |

## What Happens When Tests Fail?

### Scenario 1: Linting Fails
```
❌ ESLint found issues
Action: Fix the code issues and push to same branch
Result: PR updates automatically, workflows re-run
```

### Scenario 2: Build Fails
```
❌ npm run build failed
Action: Fix the build error locally and push
Result: PR updates, workflows re-run
```

### Scenario 3: Security Issue Found
```
❌ Hardcoded secret detected!
Action: Remove the hardcoded value, use environment variable
Result: Push again, workflows pass
```

### Scenario 4: Dependency Vulnerability
```
❌ npm audit found critical vulnerability
Action: Run npm audit fix locally
Result: Commit the updated package-lock.json, push
```

## Merging Rules

### ✅ PR Can Be Merged When:

1. All status checks are **green** ✅
2. At least **1 approval** from code owner
3. Your branch is **up to date** with main
4. No merge conflicts

### ❌ PR CANNOT Be Merged When:

1. Any status check is **red** ❌ or **pending** ⏳
2. No approvals
3. Branch is **behind** main (stale)
4. Changes requested by reviewers

## Common Issues & Solutions

### Issue: "Merge button is disabled"
**Solution:** 
- Check repo settings for status check names (they must match exactly)
- Wait for all checks to complete
- Request approval if needed

### Issue: "Workflows not running on PR"
**Solution:**
- Make sure workflows are in `.github/workflows/` folder
- Workflows must have `on: pull_request:` trigger
- Wait a few seconds, they run automatically

### Issue: "Can't push to main directly"
**Solution:** 
✅ **This is correct!** Use a feature branch:
```bash
git checkout -b feature/my-feature
git commit -m "Add awesome feature"
git push origin feature/my-feature
# Create PR on GitHub instead
```

## Testing Locally Before Pushing

```bash
# Run linting locally
npm run lint

# Run linting and fix issues
npm run lint:fix

# Check for hardcoded secrets
grep -r "FIREBASE_KEY\|API_KEY" src/ --include="*.js" --include="*.jsx"

# Run build
npm run build

# Run tests (when available)
npm test
```

## Deployment Flow

```
Feature Branch → Create PR → All Checks Pass ✅ → Approval ✅ → Merge to Main → Auto Deploy 🚀
```

## Questions?

Refer to GitHub Docs:
- https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protection-rules-in-your-repository
- https://docs.github.com/en/developers/overview/about-githubs-apis
