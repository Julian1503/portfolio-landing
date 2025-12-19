# Admin Authentication Setup

This project uses [Clerk](https://clerk.com) for admin authentication to keep things simple and secure.

## Setup Instructions

### 1. Create a Clerk Account

1. Go to [https://clerk.com](https://clerk.com) and sign up for a free account
2. Create a new application in the Clerk Dashboard
3. Choose your preferred authentication methods (Email, Google, GitHub, etc.)

### 2. Get Your API Keys

1. In your Clerk Dashboard, go to **API Keys**
2. Copy your **Publishable Key** and **Secret Key**

### 3. Configure Environment Variables

1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the Clerk variables in `.env.local`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here
   ```

### 4. Run the Development Server

```bash
npm run dev
```

### 5. Access the Admin Panel

- Navigate to `http://localhost:3000/admin/login`
- Sign in with your Clerk account
- You'll be redirected to the admin panel at `http://localhost:3000/admin`

## How It Works

- **Login Page**: `/admin/login` - A minimalist login page powered by Clerk
- **Protected Routes**: All `/admin/*` routes (except `/admin/login`) are protected by authentication
- **Middleware**: The `middleware.ts` file handles route protection automatically
- **Sign Out**: Click the user button in the admin panel header to sign out

## Features

- ✅ Simple email/password authentication
- ✅ Social login support (Google, GitHub, etc.)
- ✅ Secure session management
- ✅ Protected admin routes
- ✅ Easy sign-out functionality
- ✅ Mobile-responsive design

## Customization

### Styling the Login Page

Edit `/src/app/admin/login/page.tsx` to customize the appearance of the login page.

### Adding More Protected Routes

The middleware automatically protects all `/admin/*` routes. To add more protected routes, update the `isProtectedRoute` matcher in `src/middleware.ts`.

## Security Notes

- Never commit your `.env.local` file with real API keys
- The `.env.example` file is provided as a template only
- Clerk handles all password security and session management
- Admin routes are protected by middleware - unauthenticated users are automatically redirected to login
