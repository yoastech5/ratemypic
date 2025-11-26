# RateMyPic - Photo Rating Web Application

A full-stack web application built with Next.js 14 (App Router) and Supabase that allows users to rate photos.

## Features

### 🔐 User Authentication
- Email + password authentication via Supabase Auth
- Users must create an account and log in to rate photos
- Logged-out users can browse photos but cannot rate

### 🧑‍💼 Admin Features
- Role-based admin access
- Admin dashboard with statistics:
  - Total photos
  - Total ratings
  - Best/worst rated photos
  - Active users
- Admin capabilities:
  - Upload photos to Supabase Storage
  - Add title/description/category
  - Hide/unhide photos
  - Delete photos
  - View rating analytics

### 👥 User Features
- View photos
- Rate photos 1-10 (one rating per photo per user)
- Automatic next unrated photo after rating
- Public pages:
  - `/top` - Top rated photos
  - `/trending` - Most rated photos
  - `/random` - Random photo

### 🔐 Rating Logic
- Uses `user.id` from Supabase Auth
- Enforces one rating per photo per user
- Blocks duplicate ratings with error message
- Automatically updates photo statistics via database trigger

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- A Supabase account (free tier works)

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready

### 3. Set Up Database

1. In your Supabase project, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Paste and run the SQL to create tables, policies, and triggers

### 4. Set Up Storage

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket named `photos`
3. Make it **public**
4. Go to **Policies** tab for the bucket
5. Add these policies:

**SELECT policy:**
```sql
CREATE POLICY "Public photos are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'photos');
```

**INSERT policy:**
```sql
CREATE POLICY "Admins can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'photos' AND
  EXISTS (
    SELECT 1 FROM admin_roles
    WHERE admin_roles.user_id = auth.uid()
    AND admin_roles.role = 'admin'
  )
);
```

**DELETE policy:**
```sql
CREATE POLICY "Admins can delete photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'photos' AND
  EXISTS (
    SELECT 1 FROM admin_roles
    WHERE admin_roles.user_id = auth.uid()
    AND admin_roles.role = 'admin'
  )
);
```

### 5. Create Admin User

1. Go to **Authentication** > **Users** in Supabase
2. Create a new user (this will be your admin)
3. Copy the user's UUID
4. Go to **SQL Editor** and run:

```sql
INSERT INTO admin_roles (user_id, role)
VALUES ('YOUR_USER_UUID_HERE', 'admin');
```

### 6. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find these in Supabase: **Settings** > **API**

### 7. Install Dependencies

```bash
npm install
```

### 8. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
ratemypic/
├── app/
│   ├── admin/
│   │   ├── dashboard/      # Admin dashboard
│   │   ├── login/          # Admin login
│   │   ├── photos/         # Photo management
│   │   └── upload/         # Photo upload
│   ├── api/
│   │   ├── admin/
│   │   │   ├── photos/     # Photo CRUD API
│   │   │   └── upload/     # Upload API
│   │   └── rate/           # Rating API
│   ├── auth/
│   │   └── signout/        # Sign out route
│   ├── login/              # User login
│   ├── signup/             # User signup
│   ├── rate/               # Rating interface
│   ├── top/                # Top rated photos
│   ├── trending/           # Trending photos
│   ├── random/             # Random photo
│   ├── layout.tsx
│   ├── page.tsx            # Home page
│   └── globals.css
├── components/
│   ├── PhotoManagement.tsx # Admin photo table
│   ├── RatingInterface.tsx # Rating UI
│   └── UploadForm.tsx      # Upload form
├── lib/
│   └── supabase/
│       ├── client.ts       # Browser client
│       ├── server.ts       # Server client
│       └── admin.ts        # Admin client
├── middleware.ts           # Route protection
├── supabase-schema.sql     # Database schema
└── package.json
```

## Database Schema

### Tables

1. **photos** - Stores photo information
2. **ratings** - Stores user ratings (unique constraint on photo_id + user_id)
3. **admin_roles** - Stores admin permissions

### Key Features

- Row Level Security (RLS) enabled on all tables
- Automatic rating statistics updates via trigger
- Cascade delete for ratings when photos are deleted
- Unique constraint prevents duplicate ratings

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy

### Configure Supabase for Production

1. In Supabase dashboard, go to **Authentication** > **URL Configuration**
2. Add your Vercel domain to **Site URL** and **Redirect URLs**

## Usage

### For Users

1. Sign up at `/signup`
2. Log in at `/login`
3. Go to `/rate` to start rating photos
4. Browse `/top`, `/trending`, or `/random` pages

### For Admins

1. Log in at `/admin/login` with admin credentials
2. View dashboard at `/admin/dashboard`
3. Upload photos at `/admin/upload`
4. Manage photos at `/admin/photos`

## Security Features

- Middleware protection for admin and rating routes
- Row Level Security policies on all database tables
- Service role key kept server-side only
- Admin role verification on all admin operations
- Unique constraint prevents rating manipulation

## License

MIT
