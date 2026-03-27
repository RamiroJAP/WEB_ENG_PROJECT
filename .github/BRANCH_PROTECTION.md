# Branch Protection Rules

This guide sets up GitHub's branch protection to prevent direct commits to `main`.

## Setup Instructions

1. Go to your repository on GitHub
2. Click **Settings** → **Branches**
3. Click **Add rule** under "Branch protection rules"
4. Under "Branch name pattern", enter: `main`

## Enable These Settings:

### ✅ Require a pull request before merging
- Check: "Require approvals"
- Set: 1 approval required

### ✅ Require status checks to pass before merging
- Check: "Require branches to be up to date before merging"
- Search and select these required jobs:
  - ✓ `Validate Code`
  - ✓ `Build Project`
  - ✓ `Run Tests`
  - ✓ `Security Check`

### ✅ Require code reviews before merging
- Check: "Require a pull request before merging"
- Check: "Dismiss stale pull request approvals when new commits are pushed"
- Check: "Require review from Code Owners"

### ✅ Restrict who can push to matching branches
- Check: "Restrict who can push to matching branches"
- Allow: Your admin/maintainers only

### ✅ Other Protections
- Check: "Allow force pushes" → **DISABLE**
- Check: "Include administrators" → **ENABLE** (admins must also follow rules)
- Check: "Require conversation resolution before merging" → **ENABLE**

## What This Does:

- ❌ No one can push directly to `main`
- ❌ No PR can merge without passing ALL tests
- ❌ No PR can merge without approval
- ❌ Secrets are scanned before deployment
- ✅ Only verified code reaches production

## For Developers:

All changes must go through this flow:
```
feature branch → PR → Tests Pass → Security Check → Approval → Merge → Auto Deploy
```

## Checking GitHub Actions Status

- Visit: `Settings → Branches → Branch protection rules for main`
- Under "Require status checks", the workflow checks must be passing
