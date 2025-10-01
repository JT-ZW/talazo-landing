# Talazo Agritech Landing Page

A modern, responsive landing page for Talazo Agritech's drone-powered crop monitoring services in Zimbabwe. Built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## 🚀 Features

- **Modern Design**: Clean, responsive design optimized for all devices
- **Farmer Registration**: Secure form handling with comprehensive validation
- **Database Integration**: Supabase backend for data storage
- **Performance Optimized**: Fast loading with Next.js App Router and Turbopack
- **SEO Friendly**: Built-in SEO optimization and meta tags
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Type Safety**: Full TypeScript implementation
- **Mobile First**: Responsive design with mobile-first approach

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.4 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Validation**: Zod for form validation
- **Icons**: Lucide React
- **Deployment**: Optimized for Vercel

## 📦 Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── api/             # API routes
├── components/          # Reusable components
│   ├── ui/              # UI primitives (Button, Input, etc.)
│   ├── forms/           # Form components
│   ├── layout/          # Layout components (Header, Footer)
│   └── sections/        # Page sections (Hero, Features, etc.)
├── lib/                 # Utility functions and configurations
│   ├── constants.ts     # App constants and configurations
│   ├── supabase.ts      # Supabase client setup
│   ├── utils.ts         # Utility functions
│   └── validations.ts   # Zod schemas for validation
├── types/               # TypeScript type definitions
│   ├── database.ts      # Database types
│   └── farmer.ts        # Application types
└── database/            # Database schema and seeds
    ├── schema.sql       # Database schema
    └── seed.sql         # Sample data
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- A Supabase account

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd talazo
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   CONTACT_EMAIL=info@talazo.co.zw
   ```

4. **Set up the database**

   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Go to the SQL Editor in your Supabase dashboard
   - Run the SQL in `database/schema.sql` to create tables
   - Optionally run `database/seed.sql` for sample data

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 📱 Features Overview

### Landing Page Sections

- **Hero Section**: Compelling headline with call-to-action
- **Problem Section**: Addressing farming challenges in Zimbabwe
- **Solution Section**: How Talazo solves these problems
- **Benefits Section**: Key advantages of using Talazo
- **How It Works**: Step-by-step process explanation
- **Pricing**: Service tiers and pricing information
- **Testimonials**: Social proof from satisfied farmers
- **Contact**: Contact information and location

### Farmer Registration

- Comprehensive registration form with validation
- Zimbabwe-specific phone number validation
- Crop type selection with local varieties
- Farm size and location tracking
- Experience level assessment
- Language preference (English, Shona, Ndebele)

### Technical Features

- **Responsive Design**: Works perfectly on all devices
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling
- **Loading States**: User-friendly loading indicators
- **Accessibility**: WCAG 2.1 compliant
- **SEO Optimization**: Meta tags, structured data

## 🎨 Customization

### Colors

The project uses a green-based color scheme representing agriculture:

- Primary: `green-600` (#16a34a)
- Secondary: `blue-600` (#2563eb)
- Success: `green-500` (#22c55e)
- Error: `red-500` (#ef4444)

### Typography

- System font stack for optimal performance
- Responsive typography with proper scaling
- Clear hierarchy with semantic HTML

### Configuration

Edit `src/lib/constants.ts` to customize:

- Company information
- Contact details
- Service pricing
- Available crop types
- Feature highlights

## 📊 Database Schema

The application uses PostgreSQL with the following main tables:

- **farmers**: Stores farmer registration data
- **contact_messages**: Stores contact form submissions

See `database/schema.sql` for complete schema with constraints and indexes.

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to a Git repository
2. Import your project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
CONTACT_EMAIL=info@talazo.co.zw
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email info@talazo.co.zw or create an issue in the repository.

## 🔗 Links

- [Live Demo](https://talazo.co.zw)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
