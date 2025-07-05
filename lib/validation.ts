import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email format');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const phoneSchema = z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format');
export const nameSchema = z.string().min(1, 'Name is required').max(100, 'Name is too long');

// Contact form validation
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject is too long'),
  message: z.string().min(1, 'Message is required').max(2000, 'Message is too long'),
});

// Member registration validation
export const memberRegistrationSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  password: passwordSchema,
  confirmPassword: z.string(),
  clubId: z.number().int().positive('Invalid club ID'),
  agreedToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Login validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Upload validation
export const uploadSchema = z.object({
  folder: z.string().min(1, 'Folder is required'),
  title: z.string().max(200, 'Title is too long').optional(),
  description: z.string().max(1000, 'Description is too long').optional(),
  chapter: z.string().max(100, 'Chapter name is too long').optional(),
  category: z.string().max(50, 'Category is too long').optional(),
});

// File validation
export const fileValidationSchema = z.object({
  size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
  type: z.string().refine(
    (type) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(type),
    'Only JPEG, PNG, GIF, and WebP images are allowed'
  ),
});

// Admin validation
export const adminLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// API key validation
export const apiKeySchema = z.object({
  name: z.string().min(1, 'API key name is required').max(100, 'Name is too long'),
  permissions: z.array(z.string()).min(1, 'At least one permission is required'),
});

// Club validation
export const clubSchema = z.object({
  name: z.string().min(1, 'Club name is required').max(200, 'Club name is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  chapter: z.string().max(100, 'Chapter name is too long').optional(),
  location: z.string().max(200, 'Location is too long').optional(),
  website: z.string().url('Invalid website URL').optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
});

// Event validation
export const eventSchema = z.object({
  title: z.string().min(1, 'Event title is required').max(200, 'Title is too long'),
  description: z.string().max(2000, 'Description is too long').optional(),
  location: z.string().max(200, 'Location is too long').optional(),
  startDate: z.string().datetime('Invalid start date format'),
  endDate: z.string().datetime('Invalid end date format'),
  category: z.string().max(50, 'Category is too long').optional(),
  maxAttendees: z.number().int().positive('Max attendees must be positive').optional(),
  registrationDeadline: z.string().datetime('Invalid registration deadline format').optional(),
  price: z.number().min(0, 'Price cannot be negative').optional(),
}).refine(data => new Date(data.endDate) >= new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

// Forum validation
export const forumTopicSchema = z.object({
  title: z.string().min(1, 'Topic title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required').max(10000, 'Content is too long'),
  category: z.string().max(50, 'Category is too long').optional(),
  tags: z.array(z.string().max(30, 'Tag is too long')).max(5, 'Maximum 5 tags allowed').optional(),
});

export const forumPostSchema = z.object({
  content: z.string().min(1, 'Content is required').max(10000, 'Content is too long'),
  topicId: z.number().int().positive('Invalid topic ID'),
});

// Utility functions for validation
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: string[];
} {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
      };
    }
    return {
      success: false,
      errors: ['Validation failed'],
    };
  }
}

// Sanitization functions
export function sanitizeHtml(input: string): string {
  // Basic HTML sanitization - remove potentially dangerous tags and attributes
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
}

export function sanitizeText(input: string): string {
  // Remove any HTML tags and trim whitespace
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/&[^;]+;/g, '')
    .trim();
}

export function validateAndSanitizeFile(file: File): {
  success: boolean;
  error?: string;
  sanitizedName?: string;
} {
  const fileValidation = fileValidationSchema.safeParse({
    size: file.size,
    type: file.type,
  });

  if (!fileValidation.success) {
    return {
      success: false,
      error: fileValidation.error.errors[0].message,
    };
  }

  // Sanitize filename
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '-') // Replace special characters with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .toLowerCase();

  return {
    success: true,
    sanitizedName,
  };
}

// Environment variable validation
export const envSchema = z.object({
  DATABASE_URL: z.string().url('Invalid database URL'),
  NEXTAUTH_SECRET: z.string().min(32, 'NextAuth secret must be at least 32 characters'),
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  BLOB_READ_WRITE_TOKEN: z.string().min(1, 'Blob storage token is required').optional(),
  PAYPAL_CLIENT_ID: z.string().min(1, 'PayPal client ID is required').optional(),
  PAYPAL_CLIENT_SECRET: z.string().min(1, 'PayPal client secret is required').optional(),
  SMTP_HOST: z.string().min(1, 'SMTP host is required').optional(),
  SMTP_USER: z.string().min(1, 'SMTP user is required').optional(),
  SMTP_PASS: z.string().min(1, 'SMTP password is required').optional(),
});

export function validateEnv(): {
  success: boolean;
  errors?: string[];
} {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`),
    };
  }
  
  return { success: true };
}