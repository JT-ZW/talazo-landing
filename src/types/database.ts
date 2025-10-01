export interface Database {
  public: {
    Tables: {
      bookings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string
          last_name: string
          email: string
          phone: string
          farm_location: string
          farm_size: string
          crop_types: string
          farming_experience: string
          current_challenges: string
          preferred_date: string
          additional_notes: string | null
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          admin_notes: string | null
          assigned_to: string | null
          user_email_sent: boolean
          admin_email_sent: boolean
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name: string
          last_name: string
          email: string
          phone: string
          farm_location: string
          farm_size: string
          crop_types: string
          farming_experience: string
          current_challenges: string
          preferred_date: string
          additional_notes?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          admin_notes?: string | null
          assigned_to?: string | null
          user_email_sent?: boolean
          admin_email_sent?: boolean
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string
          email?: string
          phone?: string
          farm_location?: string
          farm_size?: number
          crop_names?: string
          farming_experience?: 'beginner' | 'intermediate' | 'experienced'
          has_smartphone?: boolean
          preferred_language?: 'english' | 'shona' | 'ndebele'
          hear_about_us?: 'social_media' | 'word_of_mouth' | 'agricultural_extension' | 'online_search' | 'other'
          additional_info?: string | null
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          admin_notes?: string | null
          assigned_to?: string | null
          user_email_sent?: boolean
          admin_email_sent?: boolean
          ip_address?: string | null
          user_agent?: string | null
        }
      }
      notification_logs: {
        Row: {
          id: string
          created_at: string
          booking_id: string
          notification_type: 'user_confirmation' | 'admin_notification'
          recipient_email: string
          subject: string
          status: 'pending' | 'sent' | 'failed'
          error_message: string | null
          email_service_id: string | null
          sent_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          booking_id: string
          notification_type: 'user_confirmation' | 'admin_notification'
          recipient_email: string
          subject: string
          status?: 'pending' | 'sent' | 'failed'
          error_message?: string | null
          email_service_id?: string | null
          sent_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          booking_id?: string
          notification_type?: 'user_confirmation' | 'admin_notification'
          recipient_email?: string
          subject?: string
          status?: 'pending' | 'sent' | 'failed'
          error_message?: string | null
          email_service_id?: string | null
          sent_at?: string | null
        }
      }
      farmers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          full_name: string
          email: string
          phone: string
          farm_location: string
          farm_size: number
          crop_types: string[]
          experience: 'beginner' | 'intermediate' | 'experienced'
          has_smartphone: boolean
          preferred_language: 'english' | 'shona' | 'ndebele'
          hear_about_us: 'social_media' | 'word_of_mouth' | 'agricultural_extension' | 'online_search' | 'other'
          additional_info: string | null
          status: 'active' | 'inactive' | 'pending'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name: string
          email: string
          phone: string
          farm_location: string
          farm_size: number
          crop_types: string[]
          experience: 'beginner' | 'intermediate' | 'experienced'
          has_smartphone: boolean
          preferred_language: 'english' | 'shona' | 'ndebele'
          hear_about_us: 'social_media' | 'word_of_mouth' | 'agricultural_extension' | 'online_search' | 'other'
          additional_info?: string | null
          status?: 'active' | 'inactive' | 'pending'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          full_name?: string
          email?: string
          phone?: string
          farm_location?: string
          farm_size?: number
          crop_types?: string[]
          experience?: 'beginner' | 'intermediate' | 'experienced'
          has_smartphone?: boolean
          preferred_language?: 'english' | 'shona' | 'ndebele'
          hear_about_us?: 'social_media' | 'word_of_mouth' | 'agricultural_extension' | 'online_search' | 'other'
          additional_info?: string | null
          status?: 'active' | 'inactive' | 'pending'
        }
      }
      contact_messages: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          phone: string | null
          subject: string
          message: string
          status: 'unread' | 'read' | 'replied'
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email: string
          phone?: string | null
          subject: string
          message: string
          status?: 'unread' | 'read' | 'replied'
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string
          message?: string
          status?: 'unread' | 'read' | 'replied'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      farmer_experience: 'beginner' | 'intermediate' | 'experienced'
      preferred_language: 'english' | 'shona' | 'ndebele'
      hear_about_source: 'social_media' | 'word_of_mouth' | 'agricultural_extension' | 'online_search' | 'other'
      farmer_status: 'active' | 'inactive' | 'pending'
      message_status: 'unread' | 'read' | 'replied'
    }
  }
}