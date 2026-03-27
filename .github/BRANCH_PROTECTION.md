name: Branch Protection Rules

# This file documents the required branch protection setup
# Configure these in GitHub Settings > Branches > Protected branches

# MAIN BRANCH PROTECTION REQUIREMENTS:
# ===================================

# 1. Require Status Checks Before Merging:
#    Required workflows to pass:
#    - Test & Lint (test.yml)
#    - Security Scan (security.yml)
#    - Build Validation (build.yml)

# 2. Require Pull Request Reviews:
#    - Minimum 1 approval required
#    - Dismiss stale PR approvals when new commits are pushed
#    - Require review from code owners (if CODEOWNERS exists)

# 3. Require Code Owner Review:
#    - Enable if CODEOWNERS file is created

# 4. Require Conversation Resolution:
#    - All comments must be resolved before merge

# 5. Require Branches to be Up to Date Before Merging:
#    - Prevents merging outdated branches

# 6. Restrict Who Can Push to Matching Branches:
#    - Only allow administrators to force push
#    - No one can delete the branch

# ===================================

# TO CONFIGURE TEST/STAGING BRANCH (develop):
# - Same requirements as main but maybe 0 approvals for development speed
# - Still require all status checks to pass
# - Allow force pushes from maintainers if needed

# ===================================
# AUTOMATED ENFORCEMENT:
# ===================================

# The following checks will FAIL and BLOCK merge if:
# ✗ Code fails linting (ESLint)
# ✗ Build fails
# ✗ Security scan detects secrets/vulnerabilities
# ✗ Dependencies have known vulnerabilities
# ✗ Tests fail
# ✗ Hardcoded credentials found
# ✗ Commits directly to main/develop (PR required)

# ===================================
# FILE PROTECTION:
# ===================================

# Protected from direct modification:
# - package.json (requires review)
# - firebase.json (requires review)
# - .github/workflows/* (requires approval)
# - src/firebase.js (requires security review)
