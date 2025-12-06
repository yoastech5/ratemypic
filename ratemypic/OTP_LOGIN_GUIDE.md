# Email OTP Login System - Complete Guide

## 🎯 Overview
This is a complete Email OTP (One-Time Password) login system using Supabase authentication. Users receive a 6-digit code via email and use it to log in securely without a password.

## 📋 How It Works

### User Flow:
1. **User enters email** → Clicks "Send Code"
2. **Supabase sends 6-digit code** → User receives email
3. **User enters code** → Clicks "Verify"
4. **Code verified** → User logged in and redirected to dashboard

---

## 🔧 Technical Implementation

### File Location
- **Frontend UI**: `ratemypic/app/otp-login/page.tsx`

### Key Functions

#### 1. `handleSendCode()` - Send OTP to Email
```javascript
const handleSendCode = async (e: React.FormEvent) => {
  // Prevent form from refreshing page
  e.preventDefault()
  
  // Show loading state
  setLoading(true)
  
  // Clear previous messages
  setError('')
  setMessage('')

  try {
    // Send OTP using Supabase
    const { error } = await supabase.auth.signInWithOtp({
      email: email, // User's email address
      options: {
        shouldCreateUser: true, // Auto-create account if doesn't exist
      },
    })

    if (error) throw error

    // Success - show message and enable code input
    setCodeSent(true)
    setMessage('✓ Check your email! We sent you a 6-digit code.')
  } catch (error: any) {
    // Show error message
    setError(error.message || 'Failed to send code. Please try again.')
  } finally {
    // Stop loading
    setLoading(false)
  }
}
```

**What it does:**
- Takes user's email address
- Calls Supabase `signInWithOtp()` to generate and send a 6-digit code
- Shows success message if code sent
- Shows error if something went wrong

---

#### 2. `handleVerifyCode()` - Verify OTP Code
```javascript
const handleVerifyCode = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError('')
  setMessage('')

  try {
    // Verify the OTP code
    const { data, error } = await supabase.auth.verifyOtp({
      email: email, // User's email
      token: otp, // 6-digit code user entered
      type: 'email', // Type of OTP verification
    })

    if (error) throw error

    if (data.user) {
      // Success - user is now logged in
      setMessage('✓ Login successful! Redirecting...')
      
      // Redirect to dashboard after 1 second
      setTimeout(() => {
        router.push('/rate')
        router.refresh()
      }, 1000)
    }
  } catch (error: any) {
    // Show error for invalid/expired code
    setError(error.message || 'Invalid or expired code. Please try again.')
  } finally {
    setLoading(false)
  }
}
```

**What it does:**
- Takes the 6-digit code user entered
- Calls Supabase `verifyOtp()` to check if code is valid
- If valid → logs user in and redirects to dashboard
- If invalid/expired → shows error message

---

### State Variables Explained

```javascript
const [email, setEmail] = useState('') 
// Stores the user's email address

const [otp, setOtp] = useState('') 
// Stores the 6-digit code entered by user

const [loading, setLoading] = useState(false) 
// Shows loading spinner on buttons when true

const [codeSent, setCodeSent] = useState(false) 
// Tracks if code was sent (switches UI from email input to code input)

const [message, setMessage] = useState('') 
// Success messages (green box)

const [error, setError] = useState('') 
// Error messages (red box)
```

---

## 🎨 UI Components

### Step 1: Email Input Form
- Email input field
- "Send Code" button
- Links to signup and password login

### Step 2: Code Verification Form
- Disabled email field (shows which email code was sent to)
- 6-digit code input (only accepts numbers, max 6 digits)
- "Verify Code" button (disabled until 6 digits entered)
- "Resend Code" button
- "Change Email" button (goes back to step 1)

### Messages
- **Success messages**: Green box with checkmark
- **Error messages**: Red box with error text

---

## 🔐 Security Features

1. **Code Expiration**: OTP codes expire after a set time (configured in Supabase)
2. **One-time Use**: Each code can only be used once
3. **Rate Limiting**: Supabase prevents spam by limiting requests
4. **Auto-create Users**: New users are automatically created when they verify their first code

---

## 🚀 How to Use

### For Users:
1. Go to `/otp-login` page
2. Enter your email address
3. Click "Send Code"
4. Check your email for 6-digit code
5. Enter the code
6. Click "Verify Code"
7. You're logged in!

### For Developers:
1. Make sure Supabase is configured in `.env.local`
2. Ensure email templates are set up in Supabase dashboard
3. Test with a real email address (OTP codes are sent via email)

---

## ⚙️ Supabase Configuration

### Required Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Email Template Setup (in Supabase Dashboard)
1. Go to Authentication → Email Templates
2. Find "Magic Link" template
3. Customize the email design
4. The `{{ .Token }}` variable contains the 6-digit code

---

## 🎯 Key Features

✅ **Two-step verification** (email → code)  
✅ **Clean, modern UI** with gradient design  
✅ **Real-time validation** (code must be 6 digits)  
✅ **Success/error messages** with clear feedback  
✅ **Resend code** functionality  
✅ **Change email** option  
✅ **Auto-redirect** after successful login  
✅ **Loading states** on all buttons  
✅ **Mobile responsive** design  

---

## 🐛 Troubleshooting

### Code not received?
- Check spam/junk folder
- Verify email address is correct
- Click "Resend Code"
- Check Supabase email settings

### "Invalid code" error?
- Code may have expired (usually 60 seconds)
- Request a new code
- Make sure you entered all 6 digits

### Can't send code?
- Check internet connection
- Verify Supabase credentials in `.env.local`
- Check Supabase dashboard for errors

---

## 📱 Access Points

Users can access OTP login from:
- `/otp-login` - Direct URL
- Home page navigation (desktop: "OTP Login" link)
- Login page ("🔐 Sign in with Email Code (OTP)" link)

---

## 🎨 Customization

### Change redirect destination:
```javascript
router.push('/rate') // Change '/rate' to your desired page
```

### Change code length:
```javascript
maxLength={6} // Change to 4, 8, etc.
```

### Change colors:
- Purple theme: `purple-600`, `purple-700`
- Change to blue: `blue-600`, `blue-700`
- Change to green: `green-600`, `green-700`

---

## 📊 Code Structure

```
OTP Login Page
├── State Management (useState hooks)
├── handleSendCode() - Send OTP
├── handleVerifyCode() - Verify OTP
├── handleResendCode() - Resend OTP
├── UI Components
│   ├── Header
│   ├── Success/Error Messages
│   ├── Step 1: Email Form
│   ├── Step 2: Code Verification Form
│   └── Footer Links
```

---

## ✨ Best Practices Used

1. **Clear variable names** - Easy to understand what each variable does
2. **Error handling** - Try/catch blocks for all API calls
3. **Loading states** - Disabled buttons during API calls
4. **User feedback** - Clear success and error messages
5. **Input validation** - Only numbers allowed in code input
6. **Responsive design** - Works on mobile and desktop
7. **Accessibility** - Proper labels and ARIA attributes

---

## 🔗 Related Files

- `/app/login/page.tsx` - Traditional password login
- `/app/magic-link/page.tsx` - Magic link login (email link)
- `/app/signup/page.tsx` - User registration
- `/lib/supabase/server.ts` - Supabase server client
- `/middleware.ts` - Route protection

---

## 📝 Notes

- OTP codes are typically valid for 60 seconds
- Users can request unlimited codes (with rate limiting)
- No password required - more secure than traditional login
- Works with existing Supabase authentication system
- Automatically creates user accounts on first login

---

## 🎉 Success!

Your OTP login system is now complete and ready to use. Users can log in securely with just their email and a 6-digit code!
