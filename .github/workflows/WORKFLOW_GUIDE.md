# 📋 CI/CD Workflow Files Guide

## Overview
Ang CI/CD pipeline ay naka-split sa 2 separate workflow files para mas organized at madaling maintindihan.

---

## 1️⃣ `validate.yml` - Validation Pipeline
**Tumatatak sa:** Every push sa any branch, at pull requests to main

### Jobs:
- **Lint** ✓ - Checks code quality (ESLint)
- **Build** ✓ - Compiles at bundles ang code
- **Security-check** ✓ - Scans para sa accidentally leaked secrets
- **Summary** ✓ - Final validation report

### Flow:
```
Push code → Lint runs → Build runs → Security scan → Report result
```

### If something fails ❌:
- GitHub Actions shows error message
- Developer can see exactly what's wrong
- Need mag-fix at mag-push ulit

---

## 2️⃣ `deploy.yml` - Deployment Pipeline
**Tumatatak sa:** Push lang sa `main` o `Main` branch

### Jobs:
- **Validate** ✓ - Final pre-deployment check
- **Deploy** ✓ - Uploads sa Firebase Hosting
- **Rollback-on-failure** ✓ - Notification kung may issue

### Flow:
```
Firebase secrets verified
         ↓
Pre-deployment validation
         ↓
Build project
         ↓
Deploy sa Firebase
         ↓
Website updated 🚀
```

---

## Environment Variables & Secrets

### Secure Storage (In GitHub Settings):
```
Settings → Secrets and variables → Actions → Repository secrets
```

Configured:
- `FIREBASE_SERVICE_ACCOUNT_WEB_ENG_PROJECT_D657D`
- `GITHUB_TOKEN` (automatic)

### Never Put In Code:
- API keys
- Passwords
- Service account files
- Tokens

---

## Auto-Reject Features

### ❌ Automatic Rejection Triggers:
1. **Lint fails** → Code quality issue
2. **Build fails** → Compilation error
3. **Security scan detects secrets** → Exposure risk
4. **Tests fail** → Functionality broken

### Feedback Messages:
Kada failure ay may automatic message kung ano ang problema:

```
❌ Linting failed! Fix code quality issues before pushing.
❌ Build failed! Check for missing files or syntax errors.
⚠️ Security check failed! Verify no secrets were exposed.
✅ All validations passed! Ready for deployment.
```

---

## Workflow Status Badges (Optional)

Pwedeng i-add sa README.md:

```markdown
![Validate](https://github.com/your-username/WEB_ENG_PROJECT/workflows/Validate%20Code/badge.svg)
![Deploy](https://github.com/your-username/WEB_ENG_PROJECT/workflows/Deploy%20to%20Firebase/badge.svg)
```

---

## Troubleshooting

### Issue: "Deploy workflow doesn't run"
**Solution:** Siguraduhin na branch protection rule ay set sa `main`

### Issue: "Secrets not accessible in workflow"
**Solution:** Double-check secret names sa GitHub Settings

### Issue: "Build test passing locally but failing in GitHub Actions"
**Solution:** May environment difference (Node version, cache, etc)
- Check Node version: `node-version: 20`
- Clear npm cache: `npm ci` (clean install)

---

## Testing Locally

```bash
# Simulate ESLint check
npm run lint

# Simulate build
npm run build

# Check if dist folder created
ls -la dist/
```

---

## Summary
✅ Secure - No secrets exposed
✅ Automated - No manual deploys
✅ Validated - All tests pass first
✅ Organized - Separate workflow files
✅ Feedback - Clear error messages
