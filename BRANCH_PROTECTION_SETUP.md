# 🛡️ Branch Protection Rules Setup

Upang maiwasan ang direktang commits sa `main` at masiguro na lahat ng tests ay pumasa bago mag-merge, sundin ang mga hakbang na ito:

## Step 1: Go to Repository Settings
1. Bukas ang iyong GitHub repository
2. Click **Settings** tab
3. Click **Branches** sa left sidebar

## Step 2: Add Branch Protection Rule
1. Click **"Add rule"** button
2. Under **Branch name pattern**, i-type: `main` (o `Main` kung sa uppercase)

## Step 3: Enable Required Protections

### ✅ Require a pull request before merging
- Check: **"Require pull request reviews before merging"** (optional)
- Set: **0** approvals (walang kailangan ng review)
- Or leave unchecked kung gusto walang PR requirement

### ✅ Require status checks to pass before merging
- Check: **"Require branches to be up to date before merging"**
- Select these status checks:
  - `Lint - Code Quality Check`
  - `Build - Compile & Bundle`
  - `Security - Check for Secrets`
  - `Validation Summary`

### ✅ Require code reviews (Optional - Skip if not needed)
- Uncheck: **"Require code reviews before merging"** (walang mandatory review)

### ✅ Restrict who can push to matching branches
- Check: **"Restrict who can push to matching branches"** (optional para sa super security)

## Step 4: Save
Click **"Create"** o **"Update rule"** button

---

## Resulta (What Happens Now):

### ❌ **BAWAL na gawin:**
- ❌ Direct push sa `main` branch
- ❌ Merge without approval
- ❌ Merge kung may failing tests/linting
- ❌ Merge kung may security issues

### ✅ **Required Workflow:**
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes at commit
3. Push branch: `git push origin feature/your-feature`
4. Create Pull Request (PR) sa GitHub
5. Automatic checks runbaa na:
   - **Linting** - Code quality
   - **Build** - Compilation check
   - **Security** - Secret scanning
6. Kung lahat ng checks **PASS** ✅:
   - PR ready for review
   - Colleague mag-approve
   - Merge to main
   - Auto-deploy sa website 🚀

7. Kung may **FAIL** ❌:
   - Error message showing what went wrong
   - Fix the issue
   - Push another commit
   - Checks run again automatically

---

## 🔑 Secret Management (Bawal ma-leak!)

### Configured Secrets (Already Set):
- `FIREBASE_SERVICE_ACCOUNT_WEB_ENG_PROJECT_D657D` - Firebase credentials
- `GITHUB_TOKEN` - GitHub access token (automatic)

### Tips para sa security:
1. **Never commit secrets** sa code
2. **Use .gitignore** para sa:
   - `.env` files
   - `service-account.json`
   - API keys

3. **Only use in GitHub Actions** through `${{ secrets.NAME }}`
4. **Trufflehog scans** automatically para sa accidentally leaked secrets

---

## CI/CD Pipeline Overview

```
Feature Branch Push
        ↓
   Validate.yml runs:
   ├─ Linting ✓
   ├─ Build ✓
   └─ Security scan ✓
        ↓
   Create Pull Request
        ↓
   Code Review + Approval
        ↓
   Merge to Main
        ↓
   Deploy.yml runs:
   ├─ Pre-deployment Validation
   └─ Firebase Deploy
        ↓
   🚀 Live on website!
```

---

## 📝 Commands Reference

```bash
# Create new feature branch
git checkout -b feature/my-feature

# Make changes then commit
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push origin feature/my-feature

# Then create PR on GitHub.com

# After PR approved and tests pass:
git checkout main
git pull origin main
```

---

## ✅ Checklist
- [ ] Nag-setup ng branch protection rules
- [ ] Nag-enable ng status checks
- [ ] Nag-require ng PR reviews
- [ ] Nag-test ng workflow with feature branch
- [ ] Nag-verify ng secrets nasa GitHub (not in code)
