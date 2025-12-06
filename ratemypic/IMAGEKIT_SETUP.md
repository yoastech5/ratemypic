# ImageKit Setup Guide

## 📋 What is ImageKit?

ImageKit is an image optimization and CDN service that automatically optimizes images for faster loading and better performance.

## 🚀 Setup Steps

### 1. Install ImageKit Package

Run this command in your terminal (not PowerShell):
```bash
cd ratemypic
npm install imagekit
```

### 2. Create ImageKit Account

1. Go to https://imagekit.io/
2. Sign up for a free account
3. Complete the registration

### 3. Get Your API Keys

After logging in:
1. Go to **Developer Options** → **API Keys**
2. Copy these three values:
   - **Public Key**
   - **Private Key**
   - **URL Endpoint** (looks like: `https://ik.imagekit.io/your_imagekit_id`)

### 4. Update Environment Variables

Open `ratemypic/.env.local` and replace the placeholder values:

```env
# ImageKit Configuration
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_actual_public_key
IMAGEKIT_PRIVATE_KEY=your_actual_private_key
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_actual_id
```

### 5. Add to Vercel Environment Variables

When deploying to Vercel:
1. Go to your project settings
2. Navigate to **Environment Variables**
3. Add these three variables with your actual values

---

## 📁 Files Created

1. **`lib/imagekit.ts`** - ImageKit configuration and helper functions
2. **`.env.local`** - Environment variables (updated)

---

## 🎨 How to Use ImageKit

### Basic Usage (Optimized Images)

```typescript
import { getImageKitUrl } from '@/lib/imagekit'

// Original image
const imageUrl = 'https://example.com/photo.jpg'

// Optimized image with transformations
const optimizedUrl = getImageKitUrl('/photo.jpg', {
  width: 800,
  height: 600,
  quality: 80,
  format: 'webp'
})
```

### In Next.js Image Component

```typescript
<Image
  src={getImageKitUrl('/photo.jpg', { width: 800, quality: 80 })}
  alt="Photo"
  width={800}
  height={600}
/>
```

---

## 🔧 Available Transformations

```typescript
getImageKitUrl('/photo.jpg', {
  width: 800,        // Resize width
  height: 600,       // Resize height
  quality: 80,       // Image quality (1-100)
  format: 'webp'     // Output format (webp, jpg, png)
})
```

---

## 📊 Benefits

✅ **Automatic Optimization** - Images are compressed automatically  
✅ **Format Conversion** - Converts to WebP for better compression  
✅ **Responsive Images** - Serve different sizes for different devices  
✅ **CDN Delivery** - Fast global image delivery  
✅ **Lazy Loading** - Images load only when needed  

---

## 🎯 Next Steps

1. Install the package: `npm install imagekit`
2. Get your API keys from ImageKit dashboard
3. Update `.env.local` with your keys
4. Restart your development server
5. Images will be automatically optimized!

---

## 🐛 Troubleshooting

### "Cannot find module 'imagekit'"
- Run: `npm install imagekit` in the ratemypic folder

### "Invalid API keys"
- Double-check your keys in `.env.local`
- Make sure there are no extra spaces
- Restart your dev server after updating

### Images not loading
- Verify your URL endpoint is correct
- Check that images are uploaded to ImageKit
- Or use the URL transformation for external images

---

## 📝 Optional: Upload Images to ImageKit

You can upload images directly to ImageKit instead of Supabase:

```typescript
import { imagekit } from '@/lib/imagekit'

// Upload image
const result = await imagekit.upload({
  file: fileBuffer,
  fileName: 'photo.jpg',
  folder: '/photos'
})

// Use the uploaded image URL
const imageUrl = result.url
```

---

## 🎉 Done!

Your images will now be optimized and delivered faster through ImageKit's CDN!
