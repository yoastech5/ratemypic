# 🔧 ImageKit Troubleshooting Guide

## ❌ ImageKit Not Working? Follow These Steps:

### Step 1: Test ImageKit Configuration

Visit this URL while logged in as admin:
```
http://localhost:3001/api/admin/test-imagekit
```

Or on production:
```
https://your-site.vercel.app/api/admin/test-imagekit
```

This will show you:
- ✅ If ImageKit is configured
- ✅ If all environment variables are set
- ✅ If ImageKit connection works
- ❌ Any error messages

---

### Step 2: Check Environment Variables

#### Local Development (.env.local):
```env
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_04gxI1bsiQ9s5TWxaSgvFiiCNb8=
IMAGEKIT_PRIVATE_KEY=private_ZPxDMgOZMvCc61SOE1MOYw4StJg=
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/c4jnjlrac
```

✅ **Checklist:**
- [ ] No extra spaces before or after values
- [ ] Private key is complete (not masked with ***)
- [ ] URL endpoint has no trailing slash
- [ ] All three variables are present

#### Vercel Deployment:
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add all three variables
5. Redeploy

---

### Step 3: Restart Development Server

After updating `.env.local`:
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

Environment variables are only loaded on server start!

---

### Step 4: Install ImageKit Package

Make sure the package is installed:
```bash
cd ratemypic
npm install imagekit
```

Check `package.json` should have:
```json
"dependencies": {
  "imagekit": "^5.2.0"
}
```

---

### Step 5: Verify ImageKit Account

1. Go to https://imagekit.io/dashboard
2. Login to your account
3. Check **Developer Options** → **API Keys**
4. Verify:
   - Public Key matches
   - Private Key is correct
   - URL Endpoint is correct

---

### Step 6: Check ImageKit Limits

Free tier limits:
- ✅ 20GB storage
- ✅ 20GB bandwidth/month
- ✅ Unlimited transformations

If you've exceeded limits, upgrade your plan.

---

## 🐛 Common Errors & Solutions

### Error: "Invalid API keys"

**Solution:**
1. Double-check private key in `.env.local`
2. Make sure it's the full key (not masked)
3. No extra spaces
4. Restart server

### Error: "Cannot find module 'imagekit'"

**Solution:**
```bash
cd ratemypic
npm install imagekit
npm run dev
```

### Error: "ImageKit upload failed, falling back to Supabase"

**Causes:**
1. Wrong API keys
2. Network issue
3. ImageKit service down
4. File size too large (max 25MB)

**Solution:**
- Check console logs for specific error
- Test with `/api/admin/test-imagekit`
- Try smaller file

### Images Still Going to Supabase

**Reasons:**
1. Environment variables not set in Vercel
2. Server not restarted after updating `.env.local`
3. ImageKit connection failing (check logs)

**Solution:**
1. Add env vars to Vercel
2. Restart local server
3. Check `/api/admin/test-imagekit`

---

## 🔍 Debug Checklist

Run through this checklist:

### Local Development:
- [ ] `npm install imagekit` completed
- [ ] `.env.local` has all 3 ImageKit variables
- [ ] No typos in environment variable names
- [ ] Private key is complete (not masked)
- [ ] Server restarted after updating `.env.local`
- [ ] `/api/admin/test-imagekit` shows success

### Vercel Deployment:
- [ ] Environment variables added in Vercel dashboard
- [ ] All 3 variables present
- [ ] Redeployed after adding variables
- [ ] Build succeeded
- [ ] `/api/admin/test-imagekit` shows success on production

---

## 📊 How to Verify It's Working

### Method 1: Upload Test
1. Login as admin
2. Upload a photo
3. Check the success message
4. Should say "Storage: ✅ ImageKit"

### Method 2: Check URL
1. Go to `/admin/photos`
2. Look at photo URLs
3. ImageKit URLs contain: `ik.imagekit.io`
4. Supabase URLs contain: `supabase.co`

### Method 3: Storage Stats
1. Visit `/admin/storage`
2. Check ImageKit count
3. Should increase after uploads

### Method 4: ImageKit Dashboard
1. Go to https://imagekit.io/dashboard
2. Check **Media Library**
3. Look for `/ratemypic-photos` folder
4. New uploads should appear here

---

## 🚨 Still Not Working?

### Option 1: Use Supabase (Current Setup)
The app automatically falls back to Supabase if ImageKit fails. This is perfectly fine!

**Pros:**
- ✅ Works immediately
- ✅ No configuration needed
- ✅ Reliable

**Cons:**
- ❌ No automatic optimization
- ❌ No CDN
- ❌ Slower loading

### Option 2: Keep Troubleshooting
1. Run `/api/admin/test-imagekit`
2. Check the error message
3. Follow the specific solution
4. Contact ImageKit support if needed

---

## 📞 Get Help

### ImageKit Support:
- Email: support@imagekit.io
- Docs: https://docs.imagekit.io
- Status: https://status.imagekit.io

### Check Logs:
```bash
# Local development
# Check terminal for error messages

# Vercel deployment
# Go to Vercel Dashboard → Deployments → View Function Logs
```

---

## ✅ Success Indicators

You'll know ImageKit is working when:
1. ✅ `/api/admin/test-imagekit` shows success
2. ✅ Upload message says "Storage: ✅ ImageKit"
3. ✅ Photo URLs contain `ik.imagekit.io`
4. ✅ Photos appear in ImageKit dashboard
5. ✅ `/admin/storage` shows ImageKit count increasing

---

## 🎯 Quick Fix Commands

```bash
# Reinstall ImageKit
cd ratemypic
npm install imagekit

# Restart server
npm run dev

# Test configuration
# Visit: http://localhost:3001/api/admin/test-imagekit
```

Good luck! 🚀
