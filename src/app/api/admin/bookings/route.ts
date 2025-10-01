import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (without strict typing to avoid conflicts)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Types for API requests
interface UpdateBookingRequest {
  id: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  admin_notes?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Add status filter if provided
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: bookings, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch bookings from database'
      }, { status: 500 });
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Count error:', countError);
    }

    return NextResponse.json({
      success: true,
      bookings: bookings || [],
      totalCount: totalCount || 0,
      currentPage: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil((totalCount || 0) / limit),
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, admin_notes }: UpdateBookingRequest = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Build update object dynamically to avoid type issues
    const updateFields: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status) updateFields.status = status;
    if (admin_notes !== undefined) updateFields.admin_notes = admin_notes;

    const { data, error } = await supabase
      .from('bookings')
      .update(updateFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      booking: data,
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}