# ⚡ Quick Reference - CI/CD & Security

## 🚀 Start Development

```bash
# Clone & setup
git clone <repo>
cd <project>
npm install
cp .env.example .env.local
# Edit .env.local with your Firebase keys

# Start dev server
npm run dev
```

## 📝 Before Pushing Code

```bash
npm run lint        # Check code quality
npm run lint:fix    # Fix issues automatically  
npm run build       # Test build
npm test           # Run tests (if available)

# Only push if all pass!
```

## 🔀 How to Create PR

```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes & commit
git add .
git commit -m "feat: add awesome feature"

# 3. Push to GitHub
git push origin feature/my-feature

# 4. Go to GitHub and create PR
# Workflows run automatically
```

## ❌ PR Checks Failed?

| Error | Fix |
|-------|-----|
| **Lint failed** | `npm run lint:fix` then push |
| **Build failed** | Fix syntax errors, then push |
| **Secrets found** | Remove hardcoded values, use `process.env.VAR` |
| **npm audit failed** | `npm audit fix` then push |

## 🔐 Don't Commit

```
❌ .env
❌ .env.local  
❌ firebase-key.json
❌ *.key
❌ *.pem
```

Use `process.env` instead:
```javascript
// ✅ CORRECT
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;

// ❌ WRONG  
const apiKey = "AIza1234567890...";
```

## 📊 Workflow Status

All must be ✅ to merge:

- ✅ **1️⃣ Validation** - Linting, secrets, dependencies
- ✅ **2️⃣ Build** - Project compiles
- ✅ **3️⃣ Test** - Tests pass
- ✅ **4️⃣ Security** - No vulnerabilities
- ✅ **5️⃣ Deploy** - Automatically deploys after merge to main

## 🔀 Flow Recap

```
Your Feature Branch
        ↓
   Create PR
        ↓
All 5 Workflows Run
        ↓
All Pass? ✅
        ↓
    + Code Review
        ↓
   Merge to Main
        ↓
Auto-Deploy 🚀
```

## 🔒 Branch Protection

- ❌ Can't push directly to main
- ✅ Must create PR
- ✅ All checks must pass
- ✅ Need 1 approval

## 📚 Full Documentation

- [CI_CD.md](./CI_CD.md) - Detailed workflows
- [BRANCH_PROTECTION_SETUP.md](./BRANCH_PROTECTION_SETUP.md) - Setup branch protection
- [SECURITY_AND_CICD_SETUP.md](./SECURITY_AND_CICD_SETUP.md) - Complete setup

## 🆘 Common Issues

**"Can't push to main"** → ✅ This is correct! Use feature branch

**"Failing checks"** → Run `npm run lint:fix && npm run build`

**"Deploy not working"** → Check GitHub secrets: `FIREBASE_SERVICE_ACCOUNT_WEB_ENG_PROJECT_D657D`

---

**Stay secure! 🔐**
