# 🚀 Quick Start: GitHub Actions Deployment

## Overview
Your AWS infrastructure is now set up for automated deployment:
- **Staging Branch** → Auto-deploys to staging AWS environment
- **Main Branch** → Auto-deploys to production AWS environment

## ⚡ 5-Minute Setup

### Step 1: Run AWS Setup Script (10 min)
```bash
# On your local machine with AWS CLI configured
chmod +x aws-setup.sh
./aws-setup.sh
```

This script will:
- ✅ Create S3 buckets for client hosting
- ✅ Create IAM role for GitHub Actions
- ✅ Output secrets to add to GitHub

### Step 2: Add GitHub Secrets (2 min)
Go to your GitHub repository:
1. **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets (from the script output):
   - `AWS_ROLE_TO_ASSUME` = (provided by script)
   - `AWS_ACCOUNT_ID` = (provided by script)
   - `COGNITO_USER_POOL_ARN` = (your Cognito pool ARN)
   - `STRIPE_SECRET_KEY` = (test key for staging, live for production)

### Step 3: Configure GitHub Environments (1 min)
1. Go to **Settings** → **Environments**
2. Create `staging` environment
3. Create `production` environment
   - Add deployment branch rule: `main` only

### Step 4: Test It Out! (1 min)
```bash
# Create a new branch from staging
git fetch origin
git checkout staging
git push origin staging

# Watch deployment in real-time
# Go to GitHub: Actions tab → Watch the workflow run
```

## ✨ That's It!

Now when you:
- **Push to `staging` branch** → Auto-deploys to staging
- **Push to `main` branch** → Auto-deploys to production

## 📊 Monitor Deployments

GitHub Actions tab shows:
- ✅ Build & test status
- ✅ Deployment logs
- ✅ API endpoint outputs
- ✅ Error messages (if any)

## 🔄 Typical Workflow

```bash
# Feature development
git checkout staging
git pull origin staging
git checkout -b feature/my-feature
# Make changes...
git push origin feature/my-feature
# Create PR, merge to staging
git merge feature/my-feature

# Staging auto-deploys
# Test in staging environment

# When ready for production
git checkout main
git pull origin main
git merge staging
git push origin main

# Production auto-deploys
```

## 🛠️ Manual Deployment (If GitHub Actions Fails)

```bash
cd server
sam build
sam deploy --config-env staging  # or production
```

## 📖 Full Documentation

See [GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md) for:
- Detailed AWS setup
- Troubleshooting guide
- Security best practices
- Rollback procedures

## ❓ Common Issues

| Issue | Solution |
|-------|----------|
| "AssumeRole Not authorized" | Check IAM trust policy includes your repo |
| Deployment fails silently | Check GitHub Actions logs for exact error |
| S3 upload fails | Verify S3 bucket names and IAM permissions |
| API not responding | Check CloudFormation events in AWS console |

## 🎯 Next Steps

1. ✅ Run `aws-setup.sh`
2. ✅ Add secrets to GitHub
3. ✅ Create GitHub Environments
4. ✅ Make a test commit to `staging` branch
5. ✅ Monitor first deployment!

---

**Questions?** Check the full setup guide or AWS CloudFormation events tab for details.
