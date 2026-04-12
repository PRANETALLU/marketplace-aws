# GitHub Actions Deployment Setup Guide

This guide walks you through setting up automated deployment for both the Marketplace API server and client.

## Workflow Overview

- **Staging Branch** → Auto-deploys to staging environment
- **Main Branch** → Auto-deploys to production environment
- **Pull Requests** → Runs build & test (no deployment)

## Prerequisites

### 1. AWS Account Setup

#### A. Create S3 Buckets for Client Hosting
```bash
# Staging
aws s3 mb s3://marketplace-client-staging-ACCOUNT_ID --region us-east-1

# Production
aws s3 mb s3://marketplace-client-production-ACCOUNT_ID --region us-east-1
```

Enable static website hosting on each bucket:
```bash
aws s3 website s3://marketplace-client-staging-ACCOUNT_ID/ \
  --index-document index.html \
  --error-document index.html

aws s3 website s3://marketplace-client-production-ACCOUNT_ID/ \
  --index-document index.html \
  --error-document index.html
```

#### B. (Optional) Set Up CloudFront Distribution
If you want CDN caching and custom domains:
```bash
# Create CloudFront distribution pointing to S3 bucket
# Save the Distribution ID for later
```

#### C. Create IAM Role for GitHub Actions

1. Go to AWS Console → IAM → Roles → Create Role
2. Select **Web identity** as trusted entity
3. Choose **GitHub** as the identity provider
4. Configure:
   - Provider: `token.actions.githubusercontent.com`
   - Audience: `sts.amazonaws.com`
5. Add permissions policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "s3:*",
        "lambda:*",
        "dynamodb:*",
        "apigateway:*",
        "iam:PassRole",
        "iam:GetRole",
        "iam:CreateRole",
        "iam:PutRolePolicy",
        "iam:AttachRolePolicy",
        "logs:*",
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
```

6. Name it: `marketplace-github-actions-role`
7. Note the full ARN: `arn:aws:iam::ACCOUNT_ID:role/marketplace-github-actions-role`

#### D. Update Trust Relationship

Edit the trust relationship for the role to include your GitHub repository:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_USERNAME/marketplace-aws:*"
        }
      }
    }
  ]
}
```

### 2. GitHub Secrets Configuration

Go to your repository settings → **Secrets and variables** → **Actions** and add:

| Secret Name | Value | Notes |
|---|---|---|
| `AWS_ROLE_TO_ASSUME` | `arn:aws:iam::ACCOUNT_ID:role/marketplace-github-actions-role` | From step 1.C |
| `AWS_ACCOUNT_ID` | Your AWS Account ID | Used for S3 bucket naming |
| `COGNITO_USER_POOL_ARN` | `arn:aws:cognito-idp:us-east-1:ACCOUNT_ID:userpool/POOL_ID` | From Cognito console |
| `STRIPE_SECRET_KEY` | Your Stripe secret key | From Stripe dashboard (use test key for staging) |

### 3. GitHub Environments Configuration

Set up **Staging** and **Production** environments for manual approval gates:

1. Go to repository settings → **Environments**
2. Create `staging` environment:
   - No deployment branches restriction needed (any branch can deploy)
3. Create `production` environment:
   - Add deployment branch rule: `main`
   - (Optional) Add required reviewers for extra safety

### 4. Variables Configuration (Optional)

Go to **Secrets and variables** → **Variables** and add:

| Variable | Value | Notes |
|---|---|---|
| `CLOUDFRONT_DISTRIBUTION_ID` | Your distribution ID | Only if using CloudFront |

## Local Setup

Before uploading to GitHub, test locally:

```bash
# Test SAM build
cd server
sam build

# Test SAM deploy (dry-run)
sam build && sam deploy --config-env staging --no-confirm-changeset

# Test client build
cd ../client/my-app
npm install
npm run build
```

## GitHub Branch Protection Rules

For safety, add branch protection rules:

1. Go to repository settings → **Branches**
2. Add rule for `main`:
   - ✅ Require status checks to pass before merging (select `build-and-test`)
   - ✅ Dismiss stale pull request approvals
   - ✅ Require a pull request before merging

3. Add rule for `staging`:
   - ✅ Require status checks to pass before merging

## Deployment Flow

### 1. Deploy to Staging
```bash
git checkout staging
# Make changes
git push origin staging
# GitHub Actions automatically deploys
```

### 2. Deploy to Production
```bash
git checkout main
git merge staging
git push origin main
# GitHub Actions automatically deploys to production
```

## Monitoring Deployments

1. Go to your GitHub repository → **Actions** tab
2. View real-time deployment logs
3. Check for failures and debug:
   - AWS credentials issues
   - Missing secrets
   - Build errors
   - Permission issues

## Rollback

If a deployment fails:

```bash
# Revert to previous commit
git revert <commit-hash>
git push origin main

# Or manually via AWS Console
# CloudFormation → Stacks → marketplace-api-production → Stack actions → Continue update rollback
```

## Troubleshooting

### "AssumeRole: Not authorized to perform sts:AssumeRoleWithWebIdentity"
- Check IAM role trust relationship includes your GitHub repository
- Verify `AWS_ROLE_TO_ASSUME` secret is correct

### "Permission denied" on S3 upload
- Verify IAM role has `s3:*` permissions
- Check S3 bucket names match (`marketplace-client-{environment}-{account}`)

### "Cognito pool not found"
- Verify `COGNITO_USER_POOL_ARN` secret is correct
- Ensure Cognito pool exists in us-east-1

### "STRIPE_SECRET_KEY not defined"
- Add the secret to GitHub (use test key for staging, live for production)

## Security Best Practices

✅ **Implemented:**
- OIDC authentication (no long-lived AWS keys)
- Environment-based approvals
- Branch protection rules
- Secrets stored in GitHub Secrets Manager

✅ **Recommended Additions:**
- Enable branch protection for main
- Require pull request reviews
- Set up AWS CloudTrail for audit logs
- Use separate AWS accounts for staging/production

## Next Steps

1. ✅ Create S3 buckets and CloudFront (if desired)
2. ✅ Create IAM role and update trust relationship
3. ✅ Add GitHub Secrets and Variables
4. ✅ Run setup GitHub branch protections
5. ✅ Push changes to GitHub and test with staging branch
6. ✅ Monitor first deployment in Actions tab
