# 🚀 Vercel Deployment Guide for Talazo Agritech

Follow these steps to deploy your Talazo website to Vercel.

## 📋 Prerequisites

✅ GitHub repository created and pushed  
✅ Supabase database set up  
✅ Resend account configured  
✅ Environment variables ready

## 🔧 Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Click **"New Project"**
4. Import **"JT-ZW/talazo-landing"** repository
5. Click **"Deploy"**

## ⚙️ Step 2: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_supabase_service_role_key
RESEND_API_KEY = your_resend_api_key
ADMIN_EMAIL = your-admin-email@talazoagritech.com
NEXT_PUBLIC_SITE_URL = https://your-vercel-domain.vercel.app
```

3. Click **"Save"** for each variable

## 🌐 Step 3: Configure Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain (e.g., `talazoagritech.com`)
3. Follow DNS configuration instructions
4. Update `NEXT_PUBLIC_SITE_URL` to your custom domain

## 📧 Step 4: Update Email Domain

1. In your **Resend dashboard**, verify your domain
2. Update sender emails in your code to use your domain:
   - Customer emails: `bookings@yourdomain.com`
   - Admin emails: `admin@yourdomain.com`

## 🔄 Step 5: Redeploy

1. Go to **Deployments** tab in Vercel
2. Click **"Redeploy"** to apply environment variables
3. Wait for deployment to complete

## ✅ Step 6: Test Your Deployment

### Test the Main Website

- Visit your Vercel URL
- Check all pages load correctly
- Verify images display properly

### Test the Booking System

1. Go to `/booking`
2. Submit a test booking
3. Check your admin email for notification
4. Verify booking appears in Supabase database

### Test the Admin Dashboard

1. Go to `/admin`
2. Verify bookings are displayed
3. Test status updates
4. Check filtering and search

## 🚨 Troubleshooting

### Common Issues:

**Images not loading:**

- Upload your images to the deployed `/public/images/` folders
- Or use a CDN like Cloudinary

**Emails not sending:**

- Verify Resend API key
- Check domain verification in Resend
- Review sender email addresses

**Database connection errors:**

- Verify Supabase environment variables
- Check database permissions
- Ensure RLS policies are correct

**404 errors:**

- Check file paths in your code
- Verify all pages are properly exported

## 📊 Monitoring

- Use Vercel Analytics to monitor performance
- Check Supabase dashboard for database usage
- Monitor Resend dashboard for email delivery

## 🔄 Continuous Deployment

Your site will automatically redeploy when you:

1. Push changes to the `main` branch
2. Vercel will build and deploy automatically
3. New version goes live in ~2 minutes

---

🎉 **Your Talazo Agritech website is now live!**

Share your production URL with customers and start collecting bookings!
