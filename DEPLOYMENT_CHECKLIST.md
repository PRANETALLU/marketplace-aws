# Deployment Checklist

Use this checklist to verify your GitHub Actions deployment pipeline is ready.

## ✅ Pre-Deployment

### Local Testing
- [ ] Tested `sam build` locally
- [ ] Tested `npm run build` in client/my-app
- [ ] Verified all Lambda handlers have node_modules or use Lambda Layer
- [ ] Verified Cognito pool and Stripe keys are valid
- [ ] Created test user in Cognito pool

### GitHub Repository Setup
- [ ] Repository created and pushed to GitHub
- [ ] Staging branch exists
- [ ] Main branch exists
- [ ] `.github/workflows/deploy.yml` exists
- [ ] `.gitignore` configured
- [ ] Branch protection rules enabled for main

## ✅ AWS Infrastructure

### S3 & Hosting
- [ ] S3 bucket created for staging client
- [ ] S3 bucket created for production client
- [ ] Static website hosting enabled on both buckets
- [ ] Bucket policies allow public read (if needed)
- [ ] (Optional) CloudFront distribution created

### IAM & Authentication
- [ ] OIDC provider configured for GitHub
- [ ] IAM role `marketplace-github-actions-role` created
- [ ] Trust policy includes your GitHub repo
- [ ] Permissions policy attached (CloudFormation, S3, Lambda, DynamoDB, etc.)
- [ ] Role ARN noted

### DynamoDB
- [ ] Tested DynamoDB table creation in SAM template
- [ ] Verified table naming convention: `marketplace-{environment}-{table}`
- [ ] Confirmed billing mode (PAY_PER_REQUEST) acceptable

### Cognito
- [ ] Cognito user pool created (or already exists)
- [ ] User pool ARN noted for both staging and production
- [ ] Test user created and confirmed

### Stripe
- [ ] Stripe account created
- [ ] Test secret key obtained for staging
- [ ] Live secret key obtained for production (ready for use)

## ✅ GitHub Secrets & Variables

### Secrets
- [ ] `AWS_ROLE_TO_ASSUME` = (ARN of marketplace-github-actions-role)
- [ ] `AWS_ACCOUNT_ID` = (your 12-digit account ID)
- [ ] `COGNITO_USER_POOL_ARN` = (full ARN)
- [ ] `STRIPE_SECRET_KEY` = (test/live key)

### Variables (Optional)
- [ ] `CLOUDFRONT_DISTRIBUTION_ID` = (if using CloudFront)

### Environments
- [ ] `staging` environment created
- [ ] `production` environment created
- [ ] `production` has deployment branch rule for `main` only
- [ ] (Optional) `production` requires reviewer approval

## ✅ First Deployment

### Staging Release
```bash
git checkout staging
git push origin staging
```
- [ ] Workflow runs successfully
- [ ] Build & test job completes
- [ ] deploy-server job completes
- [ ] deploy-client job completes
- [ ] API endpoint appears in logs
- [ ] Test requests to API work
- [ ] Client loads from S3 bucket

### Production Release
```bash
git checkout main
git merge staging
git push origin main
```
- [ ] Workflow runs successfully
- [ ] approve changes if using approval gates
- [ ] All jobs complete
- [ ] Production API endpoint accessible
- [ ] Production client loads

## ✅ Monitoring & Troubleshooting

### GitHub Actions Monitoring
- [ ] Set up Actions notifications in VS Code or email
- [ ] Bookmark Actions tab for quick access
- [ ] Know how to view full workflow logs

### Rollback Plan
- [ ] Know how to revert a commit and trigger new deployment
- [ ] Familiar with CloudFormation rollback procedures
- [ ] Have AWS console access ready

### Logging & Debugging
- [ ] Lambda CloudWatch logs accessible
- [ ] DynamoDB CloudWatch metrics visible
- [ ] API Gateway logs showing requests
- [ ] Know how to check CloudFormation drift

## ✅ Post-Deployment Testing

### API Tests
- [ ] GET /products returns products
- [ ] POST /products works with auth
- [ ] POST /payments/checkout works
- [ ] DELETE endpoints work properly

### Client Tests
- [ ] Client loads without errors
- [ ] Authentication flow works
- [ ] Can view products
- [ ] Can add to cart
- [ ] Can checkout (test with Stripe test card)

### Performance
- [ ] API response times acceptable
- [ ] Client loads quickly from S3
- [ ] CloudFront cache working (if enabled)

## 📝 Documentation

### Created Files
- [ ] `.github/workflows/deploy.yml` - Main deployment workflow
- [ ] `GITHUB_ACTIONS_SETUP.md` - Detailed setup guide
- [ ] `QUICK_START.md` - Quick reference
- [ ] `DEPLOYMENT_CHECKLIST.md` - This checklist
- [ ] `.gitignore` - Git ignore rules
- [ ] `aws-setup.sh` - AWS infrastructure setup script

### Maintenance
- [ ] Update samconfig.toml with new parameter values
- [ ] Document any custom scripts or post-deployment steps
- [ ] Create runbook for common troubleshooting

## 🎯 Optional Enhancements

- [ ] Add Slack/email notifications for failed deployments
- [ ] Set up CloudWatch alarms for Lambda errors
- [ ] Configure automatic backups for DynamoDB
- [ ] Add custom domain names (Route53)
- [ ] Enable API Gateway caching
- [ ] Set up WAF for API protection
- [ ] Add SDK generation from API Gateway (OpenAPI)

---

**When ready:** Push to staging branch and monitor the Actions tab for your first deployment!
