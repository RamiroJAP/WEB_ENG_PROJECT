# Security Checklist for Developers

Before pushing code, verify these items:

## 🔐 Secrets & Credentials
- [ ] No hardcoded API keys (Firebase, Cloudinary, etc.)
- [ ] No `.env` files committed
- [ ] No private keys or tokens in code
- [ ] All sensitive values use `process.env.*`
- [ ] `.gitignore` includes: `.env*`, `*.pem`, `private_keys/`

## 🧪 Code Quality
- [ ] `npm run lint` passes without errors
- [ ] No `console.log` statements left in production code
- [ ] No commented-out debug code
- [ ] Code follows project conventions

## 🏗️ Build & Dependencies
- [ ] `npm run build` succeeds locally
- [ ] No duplicate or conflicting dependencies
- [ ] `npm audit` shows no critical vulnerabilities
- [ ] Added new dependencies to `package.json` documented

## 🐛 Testing
- [ ] Tested changes locally (`npm run dev`)
- [ ] Verified in responsive design
- [ ] Cross-browser tested if applicable
- [ ] No broken links or missing assets

## 📝 Git & PR
- [ ] Branch name follows convention: `feature/*`, `bugfix/*`, `hotfix/*`
- [ ] Commits have clear, descriptive messages
- [ ] PR description explains what and why
- [ ] No force push history
- [ ] Branch is up to date with main

## 🔄 Breaking Changes
- [ ] Document any breaking changes
- [ ] Update related documentation
- [ ] Update dependencies if needed
- [ ] Notify team of major changes

## Firebase Specific
- [ ] Firebase credentials NEVER hardcoded in code
- [ ] Firestore rules reviewed if modified
- [ ] Storage rules reviewed if modified
- [ ] Firebase config uses environment variables

---

**Don't commit until all items are checked!** ✅
