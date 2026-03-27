# GitHub Secrets Setup

This guide explains how to securely configure secrets for the CI/CD pipeline.

## What are Secrets?

Secrets are encrypted environment variables that GitHub keeps secure. They're never exposed in logs and are only available during workflow execution.

## Required Secrets for This Project

### 1. FIREBASE_SERVICE_ACCOUNT_WEB_ENG_PROJECT_D657D

**Purpose:** Deploy to Firebase Hosting

**How to get it:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `web-eng-project-d657d`
3. Click ⚙️ (Settings) → **Project Settings**
4. Go to **Service Accounts** tab
5. Click **Generate New Private Key**
6. Copy the entire JSON content

**How to add to GitHub:**
1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `FIREBASE_SERVICE_ACCOUNT_WEB_ENG_PROJECT_D657D`
5. Value: Paste the entire JSON from Firebase
6. Click **Add secret**

### 2. GITHUB_TOKEN (Automatic)

**Purpose:** GitHub Actions automatic token (already provided by GitHub)

**Status:** ✅ No setup needed - GitHub provides this automatically

## Security Best Practices

### DO ✅
- Store all API keys as secrets
- Use environment-specific secrets
- Rotate secrets periodically
- Review which workflows can access secrets

### DON'T ❌
- Commit `.env` files
- Paste secrets in code
- Share secrets in pull requests or comments
- Log secrets in GitHub Actions output

## Verify Secrets Are Working

After adding secrets, trigger a workflow:
1. Make a commit to a feature branch
2. Create a Pull Request to `main`
3. Go to **Actions** tab
4. Click the workflow run
5. If secrets are working, the "Deploy" job won't fail with secret errors

## Adding Additional Secrets

If you add new secrets (e.g., API keys, database credentials):

1. Generate/get the secret value
2. Add it following steps from section 2 above
3. Update the YAML workflow file to use it: `${{ secrets.SECRET_NAME }}`
4. Update this documentation

## Troubleshooting

**Problem:** "Deployment failed - missing secrets"
- **Solution:** Check that the secret name in the YAML exactly matches the secret name in GitHub (case-sensitive)

**Problem:** "Secret contains invalid JSON"
- **Solution:** Make sure you copied the entire JSON without any extra characters

**Problem:** "Action cannot access secrets"
- **Solution:** Go to Actions settings and ensure the workflow has permissions to use secrets
