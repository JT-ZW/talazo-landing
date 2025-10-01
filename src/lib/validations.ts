import { z } from 'zod';

// Farmer registration schema
export const farmerRegistrationSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  
  phone: z
    .string()
    .min(10, 'Phone number is required')
    .regex(/^(\+263|0)[7][0-9]{8}$/, 'Please enter a valid Zimbabwe mobile number'),
  
  farmLocation: z
    .string()
    .min(2, 'Farm location is required')
    .max(100, 'Farm location must be less than 100 characters'),
  
  farmSize: z
    .number()
    .min(0.1, 'Farm size must be at least 0.1 hectares')
    .max(10000, 'Farm size must be less than 10,000 hectares'),
  
  cropTypes: z
    .array(z.string())
    .min(1, 'Please select at least one crop type')
    .max(5, 'Please select no more than 5 crop types'),
  
  experience: z
    .enum(['beginner', 'intermediate', 'experienced'])
    .refine((val) => val !== undefined, {
      message: 'Please select your farming experience level',
    }),
  
  hasSmartphone: z.boolean(),
  
  preferredLanguage: z
    .enum(['english', 'shona', 'ndebele'])
    .refine((val) => val !== undefined, {
      message: 'Please select your preferred language',
    }),
  
  hearAboutUs: z
    .enum(['social_media', 'word_of_mouth', 'agricultural_extension', 'online_search', 'other'])
    .refine((val) => val !== undefined, {
      message: 'Please tell us how you heard about us',
    }),
  
  additionalInfo: z
    .string()
    .max(500, 'Additional information must be less than 500 characters')
    .optional(),
});

export type FarmerRegistration = z.infer<typeof farmerRegistrationSchema>;

// Contact form schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  
  email: z
    .string()
    .email('Please enter a valid email address')
    .toLowerCase(),
  
  phone: z
    .string()
    .optional()
    .refine((phone) => {
      if (!phone) return true;
      return /^(\+263|0)[7][0-9]{8}$/.test(phone);
    }, 'Please enter a valid Zimbabwe mobile number'),
  
  subject: z
    .string()
    .min(2, 'Subject is required')
    .max(100, 'Subject must be less than 100 characters'),
  
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});

export type ContactForm = z.infer<typeof contactFormSchema>;