# Quick Fix: Environment Variables Error

## The Problem
Your `.env.local` file still has placeholder values instead of your actual Supabase credentials.

## The Solution

### Step 1: Open `.env.local`
Open the file in your editor (it's in the root directory of your project).

### Step 2: Update with Your Real Values

Replace the placeholder values with your actual Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

**Remove these lines** (they don't belong in .env.local):
```env
VIDEO_SDK_API_KEY=your_videosdk_api_key
VIDEO_SDK_SECRET=your_videosdk_secret_key
```

### Step 3: Where to Find Your Values

1. **Project URL**: 
   - Go to Supabase Dashboard > Settings > API
   - Look for "Project URL" or check your browser URL bar
   - Format: `https://xxxxxxxxxxxxx.supabase.co`

2. **Anon Key**:
   - Go to Supabase Dashboard > Settings > API
   - Look for "Publishable key" (starts with `sb_publishable_` or `eyJ`)
   - Copy the full key

### Step 4: Restart the Server

After updating `.env.local`:
1. Stop the server (Ctrl+C in terminal)
2. Run `npm run dev` again

## Example of Correct .env.local

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_R104ebAM-fFy1WJsBu6C-Q_-DiI1...
```

## Still Having Issues?

The app now shows helpful error messages if the environment variables are missing or invalid. Check your browser console or terminal for specific error messages.

