import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  farmSize: string;
  farmLocation: string;
  cropTypes: string;
  farmingExperience: string;
  currentChallenges: string;
  preferredDate: string;
  additionalNotes?: string;
}

export async function POST(request: NextRequest) {
  try {
    const bookingData: BookingData = await request.json();

    // Validate required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 
      'farmSize', 'farmLocation', 'cropTypes', 
      'farmingExperience', 'currentChallenges', 'preferredDate'
    ];

    for (const field of requiredFields) {
      if (!bookingData[field as keyof BookingData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Save to Supabase database
    const { data: booking, error: dbError } = await supabase
      .from('bookings')
      .insert([
        {
          first_name: bookingData.firstName,
          last_name: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone,
          farm_size: bookingData.farmSize,
          farm_location: bookingData.farmLocation,
          crop_types: bookingData.cropTypes,
          farming_experience: bookingData.farmingExperience,
          current_challenges: bookingData.currentChallenges,
          preferred_date: bookingData.preferredDate,
          additional_notes: bookingData.additionalNotes || '',
          status: 'pending',
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save booking to database' },
        { status: 500 }
      );
    }

    // Send confirmation email to customer
    try {
      await resend.emails.send({
        from: 'Talazo Agritech <onboarding@resend.dev>',
        to: [bookingData.email],
        subject: 'Booking Confirmation - Talazo Agritech Farm Assessment',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Confirmation</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #16a34a, #059669); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; text-align: center;">Thank You for Your Booking!</h1>
              <p style="color: white; margin: 10px 0 0; text-align: center; opacity: 0.9;">Talazo Agritech - Smart Farming Solutions</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #16a34a; margin-top: 0;">Hello ${bookingData.firstName},</h2>
              <p>We've successfully received your farm assessment booking request. Our team is excited to help you transform your farming operations with cutting-edge drone technology and AI-powered insights.</p>
            </div>

            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #16a34a; margin-top: 0;">Booking Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${bookingData.firstName} ${bookingData.lastName}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${bookingData.email}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${bookingData.phone}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Farm Location:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${bookingData.farmLocation}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Farm Size:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${bookingData.farmSize}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Crop Types:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${bookingData.cropTypes}</td></tr>
                <tr><td style="padding: 8px 0;"><strong>Preferred Date:</strong></td><td style="padding: 8px 0;">${bookingData.preferredDate}</td></tr>
              </table>
            </div>

            <div style="background: #ecfdf5; border-left: 4px solid #16a34a; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #16a34a; margin-top: 0;">What Happens Next?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>One of our agricultural technology specialists will contact you within 24-48 hours</li>
                <li>We'll schedule a convenient time for your farm assessment</li>
                <li>Our team will conduct a comprehensive drone survey of your farm</li>
                <li>You'll receive a detailed report with actionable insights and recommendations</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <p style="margin-bottom: 20px;">Have questions? We're here to help!</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> info@talazoagritech.com</p>
              <p style="margin: 5px 0;"><strong>Phone:</strong> +263 XX XXX XXXX</p>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;">© 2024 Talazo Agritech. Farming Smarter, Growing Better.</p>
            </div>
          </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error('Email error (customer):', emailError);
      // Don't fail the request if email fails
    }

    // Send notification email to admin
    try {
      await resend.emails.send({
        from: 'Talazo Bookings <onboarding@resend.dev>',
        to: [process.env.ADMIN_EMAIL || 'admin@example.com'], // Use environment variable
        subject: `New Farm Assessment Booking - ${bookingData.firstName} ${bookingData.lastName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Booking Notification</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #dc2626, #991b1b); padding: 30px; border-radius: 10px; margin-bottom: 30px;">
              <h1 style="color: white; margin: 0; text-align: center;">🚨 New Booking Alert</h1>
              <p style="color: white; margin: 10px 0 0; text-align: center; opacity: 0.9;">Talazo Agritech Admin Dashboard</p>
            </div>
            
            <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; margin-bottom: 25px;">
              <h2 style="color: #dc2626; margin-top: 0;">Action Required</h2>
              <p><strong>A new farm assessment booking has been submitted and requires your attention.</strong></p>
            </div>

            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
              <h3 style="color: #16a34a; margin-top: 0;">Customer Information:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Name:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${bookingData.firstName} ${bookingData.lastName}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Email:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${bookingData.email}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Phone:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${bookingData.phone}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Farm Location:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${bookingData.farmLocation}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Farm Size:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${bookingData.farmSize}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Crop Types:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${bookingData.cropTypes}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Experience:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${bookingData.farmingExperience}</td></tr>
                <tr><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;"><strong>Preferred Date:</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #f3f4f6;">${bookingData.preferredDate}</td></tr>
                <tr><td style="padding: 8px 0;"><strong>Booking ID:</strong></td><td style="padding: 8px 0;">${booking.id}</td></tr>
              </table>
            </div>

            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #374151; margin-top: 0;">Current Challenges:</h3>
              <p style="margin: 0;">${bookingData.currentChallenges}</p>
            </div>

            ${bookingData.additionalNotes ? `
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #374151; margin-top: 0;">Additional Notes:</h3>
              <p style="margin: 0;">${bookingData.additionalNotes}</p>
            </div>
            ` : ''}

            <div style="background: #ecfdf5; border-left: 4px solid #16a34a; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #16a34a; margin-top: 0;">Next Steps:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Contact the customer within 24-48 hours</li>
                <li>Schedule the farm assessment</li>
                <li>Prepare drone equipment and team</li>
                <li>Update booking status in admin panel</li>
              </ul>
            </div>

            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin: 0;">Talazo Agritech Admin Notifications</p>
            </div>
          </body>
          </html>
        `,
      });
    } catch (emailError) {
      console.error('Email error (admin):', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Booking submitted successfully',
      bookingId: booking.id,
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}