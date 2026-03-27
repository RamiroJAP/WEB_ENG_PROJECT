# CI/CD Pipeline Documentation

This project uses **GitHub Actions** for automated testing, building, and deployment with strict security checks.

## Pipeline Overview

```
Developer Commit
    ↓
Create Pull Request to main
    ↓
Validation Jobs (runs in parallel):
├─ ✓ Validate Code (secrets check)
├─ ✓ Build Project
├─ ✓ Run Tests
└─ ✓ Security Check
    ↓
All tests pass? → Manual review & approval required
    ↓
Merge PR to main
    ↓
Automatic Deployment to Firebase
    ↓
✅ Live on production website
```

## What Happens at Each Stage

### 1. Validate Stage
- ✓ Checks for hardcoded secrets in code
- ✓ Runs linting to find code issues
- ✅ **Fails if:** Secrets are found in source code

### 2. Build Stage
- ✓ Installs dependencies with `npm ci`
- ✓ Builds the project with `npm run build`
- ✓ Uploads build artifact
- ❌ **Fails if:** Build errors occur

### 3. Test Stage
- ✓ Runs unit tests with `npm test`
- ❌ **Fails if:** Test cases fail

### 4. Security Stage
- ✓ Audits dependencies for vulnerabilities
- ✓ Checks for known security issues
- ⚠️ **Warns if:** Moderate vulnerabilities found

### 5. Deploy Stage (Main branch only)
- ✓ Runs only after ALL other jobs pass
- ✓ Downloads build artifact
- ✓ Verifies Firebase secrets are configured
- ✓ Deploys to Firebase Hosting
- ❌ **Fails if:** Firebase credentials are missing

## Workflow Rules

### ✅ What WILL be deployed:
- Code on `main` branch
- After passing ALL tests
- After security checks pass
- After manual approval

### ❌ What WON'T be deployed:
- Feature branches
- Code with test failures
- Code with security issues
- Code with hardcoded secrets
- Code without approval

## For Developers: How to Contribute

### Step 1: Create feature branch
```bash
git checkout -b feature/my-feature
```

### Step 2: Make changes and commit
```bash
git add .
git commit -m "Add new feature"
```

### Step 3: Push to GitHub
```bash
git push origin feature/my-feature
```

### Step 4: Create Pull Request
- Go to GitHub → Your feature branch
- Click "Compare & pull request"
- Add description of changes

### Step 5: Tests run automatically
- GitHub Actions automatically runs all checks
- See results in the "Checks" tab on your PR

### Step 6: Address any failures
- If tests fail, the error message shows why
- Fix the issue locally
- Push your fix: `git push origin feature/my-feature`
- Tests run again automatically

### Step 7: Get approval
- Ask a team member to review
- They can approve once they're satisfied
- Project owner merges the PR

### Step 8: Automatic deployment
- Once merged to `main`, deployment starts automatically
- Check Actions tab to see deployment progress
- Changes go live when deployment completes ✅

## Error Messages & Solutions

### ❌ "Hardcoded secrets found in source code"
**What went wrong:** You committed API keys or tokens
**Fix:** Remove them, use environment variables instead

### ❌ "Build failed"
**What went wrong:** Your code doesn't compile
**Fix:** Check the error message, fix syntax errors, test locally with `npm run build`

### ❌ "Tests failed"
**What went wrong:** Unit tests didn't pass
**Fix:** Fix the code, run `npm test` locally to debug

### ❌ "Security audit failed"
**What went wrong:** A dependency has known vulnerabilities
**Fix:** Update the package: `npm update package-name`

### ❌ "Firebase credentials not found"
**What went wrong:** Secrets not configured in GitHub
**Fix:** See [SECRETS_SETUP.md](SECRETS_SETUP.md)

## Branch Protection

The `main` branch is protected:
- ❌ No direct commits allowed
- ✓ All PRs must pass tests
- ✓ Approval required before merge
- ✓ All checks must be passing

See [BRANCH_PROTECTION.md](BRANCH_PROTECTION.md) for details.

## Viewing Pipeline Status

1. Go to **Actions** tab on GitHub
2. See all workflow runs with status
3. Click on a run to see detailed logs
4. Click on a job to see specific step output

## Important Files

- `.github/workflows/ci-cd.yml` - Main workflow definition
- `.github/BRANCH_PROTECTION.md` - Branch protection setup
- `.github/SECRETS_SETUP.md` - Secret configuration guide
- `package.json` - Build and test scripts

## Scripts Used in Pipeline

From `package.json`:
```json
{
  "scripts": {
    "build": "vite build",
    "test": "vitest",
    "lint": "eslint src/**"
  }
}
```

These are the scripts that GitHub Actions runs at each stage.

## Need Help?

- Check the Actions tab for detailed logs
- Read the error message - it usually tells you what's wrong
- Make sure you're on a feature branch, not `main`
- Create a PR - tests will run automatically
- Ask a team member for review

---

**Summary:** This system ensures only quality, secure code reaches production. 🚀
