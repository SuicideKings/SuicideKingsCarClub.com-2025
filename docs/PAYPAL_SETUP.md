# PayPal Integration Setup Guide

This guide will help you set up PayPal integration for your Suicide Kings Car Club chapter.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [PayPal Developer Account Setup](#paypal-developer-account-setup)
3. [Application Configuration](#application-configuration)
4. [Webhook Setup](#webhook-setup)
5. [Integration Setup via Admin Panel](#integration-setup-via-admin-panel)
6. [Testing](#testing)
7. [Going Live](#going-live)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- Admin access to your club's website
- PayPal Business account (recommended) or Personal account
- Access to PayPal Developer Dashboard

## PayPal Developer Account Setup

### 1. Create PayPal Developer Account

1. Visit [PayPal Developer](https://developer.paypal.com/)
2. Sign in with your PayPal account or create a new one
3. Accept the developer agreement

### 2. Create a New Application

1. Navigate to "My Apps & Credentials"
2. Click "Create App"
3. Fill in the application details:
   - **App Name**: `[Your Club Name] Membership Portal`
   - **Merchant**: Select your business account
   - **Platform**: Web
   - **Product**: Subscriptions (required for membership billing)

### 3. Configure Application Settings

1. **Features**: Enable the following:
   - ✅ Subscriptions
   - ✅ Payments
   - ✅ Webhooks

2. **Return URLs**:
   - Success URL: `https://your-domain.com/member/subscription/success`
   - Cancel URL: `https://your-domain.com/member/subscription/cancel`

3. **App URLs**:
   - Privacy Policy: `https://your-domain.com/privacy`
   - User Agreement: `https://your-domain.com/terms`

## Application Configuration

### Sandbox Credentials (Testing)

After creating your app, you'll receive:
- **Client ID**: `sb_xxxxxxxxxxxxxxxxxx`
- **Client Secret**: `EPxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### Live Credentials (Production)

For production, you'll need to:
1. Switch to "Live" mode in the developer dashboard
2. Get your live credentials
3. Complete business verification if required

## Webhook Setup

Webhooks are essential for processing subscription events automatically.

### 1. Create Webhook

1. In your PayPal app, go to "Webhooks"
2. Click "Add Webhook"
3. **Webhook URL**: `https://your-domain.com/api/clubs/[your-club-id]/paypal/webhooks`
4. **Event types**: Select the following events:
   - ✅ `BILLING.SUBSCRIPTION.ACTIVATED`
   - ✅ `BILLING.SUBSCRIPTION.CANCELLED`
   - ✅ `BILLING.SUBSCRIPTION.EXPIRED`
   - ✅ `BILLING.SUBSCRIPTION.SUSPENDED`
   - ✅ `BILLING.SUBSCRIPTION.UPDATED`
   - ✅ `BILLING.SUBSCRIPTION.PAYMENT.FAILED`
   - ✅ `PAYMENT.SALE.COMPLETED`
   - ✅ `PAYMENT.CAPTURE.COMPLETED`
   - ✅ `PAYMENT.CAPTURE.REFUNDED`

### 2. Get Webhook ID

After creating the webhook, copy the **Webhook ID** (format: `WH-xxxxxxxxxxxxxxxxxxxxx`)

## Integration Setup via Admin Panel

### 1. Access PayPal Setup Wizard

1. Log into your admin panel
2. Navigate to **PayPal > Setup Wizard**
3. Follow the step-by-step process

### 2. Configure API Credentials

**Step 1: API Credentials**
- Environment: Choose "Sandbox" for testing, "Live" for production
- Client ID: Paste your PayPal Client ID
- Client Secret: Paste your PayPal Client Secret

**Step 2: Test Connection**
- Click "Test Connection" to verify your credentials

### 3. Set Pricing

**Step 3: Pricing Configuration**
- Currency: Select your preferred currency (USD recommended)
- Monthly Price: Set your monthly membership fee (e.g., $99.99)
- Yearly Price: Set your annual membership fee (e.g., $999.99)

### 4. Create Products & Plans

**Step 4: PayPal Products**
- Click "Create Products & Plans"
- This will automatically create:
  - A membership product in PayPal
  - Monthly subscription plan
  - Yearly subscription plan

### 5. Configure Webhooks

**Step 5: Webhooks**
- Webhook ID: Paste your PayPal Webhook ID
- The webhook URL is automatically configured

## Testing

### 1. Sandbox Testing

1. Ensure you're using sandbox credentials
2. Create test PayPal accounts at [PayPal Sandbox](https://developer.paypal.com/tools/sandbox/)
3. Test the complete subscription flow:
   - Member registration
   - Subscription creation
   - Payment processing
   - Webhook events

### 2. Test Scenarios

**Successful Subscription**:
1. Go to membership page
2. Select a plan
3. Complete PayPal checkout with test account
4. Verify member is activated

**Subscription Cancellation**:
1. Go to member dashboard
2. Cancel subscription
3. Verify status updates

**Failed Payment**:
1. Use declined test card
2. Verify appropriate error handling

### 3. Monitoring

Use the **PayPal > Monitoring** dashboard to track:
- Subscription activations
- Payment processing
- Webhook events
- Error logs

## Going Live

### 1. Switch to Production

1. Get live PayPal credentials
2. Update webhook URL to production domain
3. In admin panel, switch environment to "Live"
4. Enter live credentials
5. Test with small real transaction

### 2. Pre-Launch Checklist

- ✅ Live credentials configured
- ✅ Webhook URL updated to production
- ✅ SSL certificate installed
- ✅ Test transaction completed
- ✅ Member notification emails working
- ✅ Subscription cancellation tested

## Troubleshooting

### Common Issues

**1. "Invalid API Credentials"**
- Verify Client ID and Secret are correct
- Check if you're using sandbox/live credentials correctly
- Ensure PayPal app has required permissions

**2. "Webhook Verification Failed"**
- Verify Webhook ID is correct
- Check webhook URL is accessible
- Ensure SSL certificate is valid

**3. "Product Creation Failed"**
- Verify PayPal app has "Subscriptions" permission
- Check pricing format (decimal with 2 places)
- Ensure currency is supported

**4. "Subscription Not Activating"**
- Check webhook events are being received
- Review webhook logs in monitoring dashboard
- Verify member email is being captured

### Debug Tools

**Admin Panel Monitoring**:
- PayPal > Monitoring for real-time status
- Webhook logs for event processing
- Transaction history for payment tracking

**PayPal Developer Tools**:
- PayPal Developer Dashboard for API logs
- Webhook simulation for testing events
- Transaction search for payment verification

### Getting Help

**Technical Support**:
- Check the monitoring dashboard for error details
- Review webhook logs for failed events
- Contact development team with specific error messages

**PayPal Support**:
- PayPal Developer Community
- PayPal Technical Support (for business accounts)
- PayPal Documentation: [developer.paypal.com](https://developer.paypal.com)

## Best Practices

### Security

- Never share your Client Secret
- Use HTTPS for all webhook URLs
- Regularly rotate API credentials
- Monitor for suspicious activity

### Performance

- Set appropriate webhook timeouts
- Handle failed webhooks gracefully
- Log all PayPal interactions
- Regular monitoring and health checks

### Member Experience

- Clear pricing information
- Simple cancellation process
- Automated email confirmations
- Responsive customer support

## API Reference

### Endpoints

- **Setup Wizard**: `/admin/paypal/setup`
- **Monitoring**: `/admin/paypal/monitoring`
- **Settings**: `/admin/paypal/settings`
- **Member Payment**: `/member/subscription`
- **Webhooks**: `/api/clubs/[id]/paypal/webhooks`

### Key Files

- `components/admin/paypal-wizard.tsx` - Setup wizard UI
- `components/admin/paypal-monitoring.tsx` - Monitoring dashboard
- `components/member/membership-payment.tsx` - Member payment interface
- `lib/paypal.ts` - PayPal API integration
- `lib/paypal-validation.ts` - Integration validation
- `app/api/clubs/[id]/paypal/webhooks/route.ts` - Webhook processing

---

**Last Updated**: January 2025  
**Version**: 1.0

For additional support, contact your system administrator or development team.