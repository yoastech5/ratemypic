# 🔧 Supabase OTP Configuration Guide

## ⚠️ Important: Enable Email OTP in Supabase

By default, Supabase sends **magic links** (clickable URLs) instead of **6-digit codes**. To get actual OTP codes, you need to configure Supabase.

---

## 📋 Step-by-Step Setup

### 1. Go to Supabase Dashboard
- Visit: https://supabase.com/dashboard
- Select your project: **RateMyPic**

### 2. Enable Email OTP
1. Go to: **Authentication** → **Providers**
2. Find: **Email** provider
3. Look for: **"Enable Email OTP"** or **"Secure email change"**
4. **Toggle ON**: "Enable email OTP"
5. Click **Save**

### 3. Configure Email Template
1. Go to: **Authentication** → **Email Templates**
2. Select: **"Magic Link"** template
3. You'll see the `{{ .Token }}` variable - this contains the OTP code
4. Customize the template to show the code clearly:

```html
<h2>Your Login Code</h2>
<p>Hi there!</p>
<p>Your 6-digit login code is:</p>

<div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
  <h1 style="font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;">
    {{ .Token }}
  </h1>
</div>

<p>This code expires in 60 seconds.</p>
<p>If you didn't request this code, you can safely ignore this email.</p>
```

5. Click **Save**

---

## 🔍 Alternative: Check Current Behavior

If Supabase is still sending links instead of codes, it might be because:

### Option A: Use the Token from the Link
The magic link URL contains the token. Users can:
1. Click the link to auto-login, OR
2. Copy the token from the URL and paste it

### Option B: Force OTP Mode
Update the Supabase configuration to use OTP-only mode (no magic links).

---

## 🛠️ Verify Configuration

After setup, test the flow:

1. Go to `/otp-login`
2. Enter your email
3. Click "Send Code"
4. Check your email
5. You should see a **6-digit code** like: `123456`

---

## 📧 Email Template Variables

Available variables in Supabase email templates:

- `{{ .Token }}` - The OTP code (6 digits) or token
- `{{ .TokenHash }}` - Hashed version of token
- `{{ .SiteURL }}` - Your site URL
- `{{ .ConfirmationURL }}` - Magic link URL (if enabled)

---

## ⚙️ Advanced: Custom SMTP (Optional)

For better email delivery in production:

1. Go to: **Project Settings** → **Auth**
2. Scroll to: **SMTP Settings**
3. Configure your email provider:
   - **SendGrid** (recommended)
   - **AWS SES**
   - **Mailgun**
   - **Postmark**

This improves deliverability and avoids spam folders.

---

## 🐛 Troubleshooting

### Still receiving links instead of codes?

**Solution 1: Check Auth Settings**
```
Dashboard → Authentication → Settings
Look for "Enable Email OTP" toggle
```

**Solution 2: Use Token from Link**
The link contains the token in the URL:
```
https://yoursite.com/auth/callback?token=123456&type=email
```
The `token=123456` is your OTP code!

**Solution 3: Contact Supabase Support**
If the toggle doesn't exist, your Supabase version might need updating.

---

## 📝 Notes

- OTP codes are typically **6 digits**
- Codes expire after **60 seconds** by default
- Rate limiting: Max 4 requests per hour per email
- Codes are single-use only

---

## ✅ Checklist

- [ ] Enabled "Email OTP" in Supabase Dashboard
- [ ] Customized email template to show code clearly
- [ ] Tested sending code to real email
- [ ] Verified code appears in email (not just link)
- [ ] Tested code verification works
- [ ] Configured custom SMTP (optional, for production)

---

## 🎯 Expected Email Format

After proper configuration, users should receive:

```
Subject: Your Login Code

Hi there!

Your 6-digit login code is:

    1 2 3 4 5 6

This code expires in 60 seconds.

If you didn't request this code, you can safely ignore this email.
```

NOT:
```
Subject: Confirm your email

Click here to log in: [Link]
```

---

## 🔗 Useful Links

- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- Email OTP Guide: https://supabase.com/docs/guides/auth/auth-email-otp
- Email Templates: https://supabase.com/docs/guides/auth/auth-email-templates
