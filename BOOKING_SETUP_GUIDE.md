# 🚀 Talazo Agritech Booking System Setup Guide

This guide will help you set up the complete booking system with email notifications and database integration.

## 📋 Prerequisites

✅ Supabase account  
✅ Resend account (for emails)  
✅ Node.js and npm installed

## 🗄️ Step 1: Set up Supabase Database

### 1.1 Create the Database Table

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **SQL Editor**
4. Copy and paste the content from `database/bookings_schema.sql`
5. Click **Run** to execute the SQL

### 1.2 Get Your Supabase Credentials

1. Go to **Settings** → **API**
2. Copy the following values:
   - `Project URL` (for NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key (for NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - `service_role` key (for SUPABASE_SERVICE_ROLE_KEY) ⚠️ Keep this secret!

## 📧 Step 2: Set up Resend for Email Notifications

### 2.1 Create Resend Account

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your account

### 2.2 Add Your Domain (Optional but Recommended)

1. Go to **Domains** in Resend dashboard
2. Add your domain (e.g., `talazoagritech.com`)
3. Follow DNS setup instructions
4. Wait for verification

### 2.3 Get API Key

1. Go to **API Keys** in Resend dashboard
2. Create a new API key
3. Copy the key (starts with `re_`)

## ⚙️ Step 3: Configure Environment Variables

### 3.1 Create .env.local file

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Resend Email Service
RESEND_API_KEY=re_your_api_key_here

# Admin Email Configuration
ADMIN_EMAIL=your-admin-email@talazoagritech.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3.2 Update Admin Email

In `src/app/api/bookings/route.ts`, update line 85:

```typescript
to: ['your-admin-email@talazoagritech.com'], // Replace with your actual admin email
```

## 🔧 Step 4: Test the System

### 4.1 Start Development Server

```bash
npm run dev
```

### 4.2 Test Booking Form

1. Go to `http://localhost:3000/booking`
2. Fill out the form with test data
3. Submit the form
4. Check your admin email for notification
5. Check Supabase dashboard for new booking record

### 4.3 Verify Email Templates

Test emails should look professional with:

- ✅ Customer confirmation email with booking details
- ✅ Admin notification email with all customer information
- ✅ Proper styling and branding

## 🎯 Step 5: Customize Email Templates

### 5.1 Update Sender Information

In `src/app/api/bookings/route.ts`:

**Customer Email (line 62):**

```typescript
from: 'Talazo Agritech <bookings@yourdomain.com>',
```

**Admin Email (line 140):**

```typescript
from: 'Talazo Bookings <bookings@yourdomain.com>',
```

### 5.2 Customize Email Content

You can modify the HTML templates in the API route to match your branding:

- Update colors and styling
- Add your logo
- Modify messaging
- Add social media links

## 🛡️ Step 6: Security Best Practices

### 6.1 Environment Variables

- ✅ Never commit `.env.local` to version control
- ✅ Use different keys for development and production
- ✅ Keep service role key secret (server-side only)

### 6.2 Database Security

- ✅ Row Level Security (RLS) is enabled
- ✅ API uses service role for full access
- ✅ Public access is restricted

### 6.3 Email Security

- ✅ Validate all input data
- ✅ Sanitize data before sending emails
- ✅ Rate limiting (consider implementing)

## 📊 Step 7: Monitor and Analytics

### 7.1 Supabase Monitoring

- Monitor database usage in Supabase dashboard
- Set up alerts for high usage
- Review booking trends

### 7.2 Email Monitoring

- Monitor email delivery rates in Resend
- Check bounce and spam rates
- Review email performance

## 🚀 Step 8: Production Deployment

### 8.1 Environment Setup

1. Set up production environment variables
2. Use production Supabase project
3. Configure production domain in Resend

### 8.2 Domain Configuration

1. Update email sender domains
2. Set up SPF, DKIM, DMARC records
3. Test email deliverability

## 🆘 Troubleshooting

### Common Issues:

**Database Connection Errors:**

- Check Supabase URL and keys
- Verify database table exists
- Check RLS policies

**Email Not Sending:**

- Verify Resend API key
- Check sender domain verification
- Review email content for spam triggers

**Form Submission Errors:**

- Check network tab in browser dev tools
- Verify API route is accessible
- Check server logs for errors

## 📱 Next Steps

After basic setup works:

1. **Add booking management dashboard**
2. **Implement booking status updates**
3. **Add SMS notifications (optional)**
4. **Create booking calendar integration**
5. **Add customer follow-up automation**

## 📞 Support

If you need help:

1. Check browser console for errors
2. Review server logs
3. Test each component individually
4. Verify all environment variables are set

---

🎉 **Success!** Your booking system should now be fully functional with email notifications and database storage!
