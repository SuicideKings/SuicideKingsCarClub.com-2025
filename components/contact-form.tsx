"use client"

import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import type { ContactFormData, ApiResponse } from "@/types"
import { logger } from "@/lib/logger"

interface ContactFormState extends ContactFormData {
  errors: Partial<ContactFormData>;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  submitMessage: string;
}

interface FormFieldProps {
  id: keyof ContactFormData;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = "text",
  placeholder,
  required = true,
  multiline = false,
  rows = 4,
  value,
  error,
  onChange,
  disabled = false,
}) => {
  const inputProps = {
    id,
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
      onChange(e.target.value),
    placeholder,
    required,
    disabled,
    className: `w-full ${error ? 'border-red-500 focus:border-red-500' : ''}`,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${id}-error` : undefined,
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-white font-medium">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </Label>
      {multiline ? (
        <Textarea {...inputProps} rows={rows} />
      ) : (
        <Input {...inputProps} type={type} />
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};

export default function ContactForm() {
  const [formState, setFormState] = useState<ContactFormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
    errors: {},
    isSubmitting: false,
    submitStatus: 'idle',
    submitMessage: "",
  })

  const validateField = useCallback((field: keyof ContactFormData, value: string): string | undefined => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (value.trim().length > 100) return 'Name must be less than 100 characters';
        break;
      case 'email':
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        break;
      case 'subject':
        if (!value.trim()) return 'Subject is required';
        if (value.trim().length < 5) return 'Subject must be at least 5 characters';
        if (value.trim().length > 200) return 'Subject must be less than 200 characters';
        break;
      case 'message':
        if (!value.trim()) return 'Message is required';
        if (value.trim().length < 10) return 'Message must be at least 10 characters';
        if (value.trim().length > 2000) return 'Message must be less than 2000 characters';
        break;
    }
    return undefined;
  }, []);

  const validateForm = useCallback((data: ContactFormData): Partial<ContactFormData> => {
    const errors: Partial<ContactFormData> = {};
    
    (Object.keys(data) as (keyof ContactFormData)[]).forEach(field => {
      const error = validateField(field, data[field]);
      if (error) {
        errors[field] = error;
      }
    });

    return errors;
  }, [validateField]);

  const handleFieldChange = useCallback((field: keyof ContactFormData, value: string) => {
    setFormState(prev => {
      const newFormState = {
        ...prev,
        [field]: value,
        submitStatus: 'idle' as const,
        submitMessage: '',
      };

      // Clear field error when user starts typing
      if (prev.errors[field]) {
        newFormState.errors = {
          ...prev.errors,
          [field]: undefined,
        };
      }

      return newFormState;
    });
  }, []);

  const isFormValid = useMemo(() => {
    const { name, email, subject, message } = formState;
    const errors = validateForm({ name, email, subject, message });
    return Object.keys(errors).length === 0 && 
           name.trim() && email.trim() && subject.trim() && message.trim();
  }, [formState, validateForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const { name, email, subject, message } = formState;
    const formData = { name, email, subject, message };
    
    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormState(prev => ({ ...prev, errors }));
      return;
    }

    setFormState(prev => ({ 
      ...prev, 
      isSubmitting: true, 
      submitStatus: 'idle',
      submitMessage: '',
      errors: {} 
    }));

    try {
      logger.info('Contact form submission started', { email });

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data: ApiResponse = await response.json();

      if (response.ok && data.success) {
        logger.info('Contact form submitted successfully', { email });
        
        setFormState(prev => ({
          ...prev,
          name: "",
          email: "",
          subject: "",
          message: "",
          submitStatus: 'success',
          submitMessage: data.message || "Thank you for your message. We'll get back to you soon!",
        }));
      } else {
        const errorMessage = data.error || `Request failed with status ${response.status}`;
        logger.warn('Contact form submission failed', { 
          email, 
          error: errorMessage,
          status: response.status 
        });
        
        setFormState(prev => ({
          ...prev,
          submitStatus: 'error',
          submitMessage: `Error: ${errorMessage}`,
        }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      logger.error('Contact form submission error', { 
        email, 
        error: errorMessage 
      });
      
      setFormState(prev => ({
        ...prev,
        submitStatus: 'error',
        submitMessage: "Unable to send message. Please check your connection and try again.",
      }));
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }

  const resetForm = useCallback(() => {
    setFormState({
      name: "",
      email: "",
      subject: "",
      message: "",
      errors: {},
      isSubmitting: false,
      submitStatus: 'idle',
      submitMessage: "",
    });
  }, []);

  return (
    <section className="bg-black py-16">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Contact Us</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-300">
            Have questions or want to learn more? Get in touch with us
          </p>
        </div>
        
        <div className="mx-auto max-w-2xl rounded-lg border border-gray-800 bg-gray-900 p-8">
          {formState.submitStatus === 'success' ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Message Sent Successfully!</h3>
              <p className="text-lg text-green-400">{formState.submitMessage}</p>
              <Button 
                className="mt-4 bg-red-600 text-white hover:bg-red-700" 
                onClick={resetForm}
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <>
              {formState.submitStatus === 'error' && (
                <Alert className="mb-6 border-red-500 bg-red-950/50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-200">
                    {formState.submitMessage}
                  </AlertDescription>
                </Alert>
              )}
              
              <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    id="name"
                    label="Name"
                    placeholder="Your full name"
                    value={formState.name}
                    error={formState.errors.name}
                    onChange={(value) => handleFieldChange('name', value)}
                    disabled={formState.isSubmitting}
                  />
                  
                  <FormField
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formState.email}
                    error={formState.errors.email}
                    onChange={(value) => handleFieldChange('email', value)}
                    disabled={formState.isSubmitting}
                  />
                </div>
                
                <FormField
                  id="subject"
                  label="Subject"
                  placeholder="How can we help you?"
                  value={formState.subject}
                  error={formState.errors.subject}
                  onChange={(value) => handleFieldChange('subject', value)}
                  disabled={formState.isSubmitting}
                />
                
                <FormField
                  id="message"
                  label="Message"
                  placeholder="Please tell us more about your question or how we can help..."
                  multiline
                  rows={6}
                  value={formState.message}
                  error={formState.errors.message}
                  onChange={(value) => handleFieldChange('message', value)}
                  disabled={formState.isSubmitting}
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={formState.isSubmitting || !isFormValid}
                >
                  {formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
                
                <p className="text-xs text-gray-400 text-center">
                  We typically respond within 24 hours. Your information is kept confidential.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
