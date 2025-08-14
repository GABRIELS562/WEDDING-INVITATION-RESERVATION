/**
 * World-Class Wedding RSVP Form Component
 * Dale & Kirsten's Wedding - October 31st, 2025
 */

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
// Removed Framer Motion for compatibility
import { cn } from '@/lib/utils';
import { 
  RSVPFormProps, 
  RSVPFormData, 
  FormState, 
  MEAL_CHOICES,
  RSVPSubmissionPayload,
  Guest
} from '@/types/rsvp';
import { ValidationUtils, rsvpFormSchema } from '@/lib/validation';
import { submitRSVP, getExistingRSVP, markEmailConfirmationSent } from '@/lib/supabase';
import { emailService } from '@/lib/emailService';
import { LoadingSpinner, FormLoadingSkeleton } from './ui/LoadingSkeleton';
import { CheckCircleIcon, ExclamationTriangleIcon, HeartIcon } from './ui/SimpleIcons';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  name,
  label,
  required,
  error,
  helpText,
  children,
  className
}) => (
  <motion.div
    className={cn('space-y-2', className)}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <label
      htmlFor={id}
      className="block text-sm font-medium text-rose-900 leading-6"
    >
      {label}
      {required && <span className="text-rose-500 ml-1">*</span>}
    </label>
    
    {children}
    
    <AnimatePresence mode="wait">
      {error && (
        <motion.p
          key="error"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-sm text-rose-600 flex items-start gap-1"
          role="alert"
          aria-live="polite"
        >
          <ExclamationTriangleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
          {error}
        </motion.p>
      )}
      
      {helpText && !error && (
        <motion.p
          key="help"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-rose-700/70"
        >
          {helpText}
        </motion.p>
      )}
    </AnimatePresence>
  </motion.div>
);

const RSVPForm: React.FC<RSVPFormProps> = ({
  token,
  initialData,
  onSuccess,
  onError,
  className
}) => {
  // Form state management
  const [formData, setFormData] = useState<RSVPFormData>({
    attending: null,
    meal_choice: '',
    dietary_restrictions: '',
    email_address: ''
  });

  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    isSubmitting: false,
    isSuccess: false,
    isError: false
  });

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});
  const [guestInfo, setGuestInfo] = useState<Guest | null>(null);

  // Real-time validation
  const validation = useMemo(() => {
    return ValidationUtils.validateRSVPForm(formData);
  }, [formData]);

  // Load existing RSVP data
  useEffect(() => {
    if (initialData) {
      setFormData({
        attending: initialData.attending,
        meal_choice: initialData.meal_choice || '',
        dietary_restrictions: initialData.dietary_restrictions || '',
        email_address: initialData.email_address || ''
      });
    }
  }, [initialData]);

  // Handle field changes with validation
  const handleFieldChange = useCallback((
    field: keyof RSVPFormData,
    value: any
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [field]: true }));
    
    // Clear any existing errors for this field
    if (formState.isError) {
      setFormState(prev => ({ ...prev, isError: false, error: undefined }));
    }
  }, [formState.isError]);

  // Handle field blur for progressive validation
  const handleFieldBlur = useCallback((field: keyof RSVPFormData) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  }, []);

  // Get field validation state for UI feedback
  const getFieldState = useCallback((field: keyof RSVPFormData) => {
    const isTouched = touchedFields[field];
    const hasError = validation.errors[field];
    
    if (!isTouched) return 'idle';
    if (hasError) return 'invalid';
    
    // Show valid state for important fields
    if (['attending', 'email_address'].includes(field) && formData[field]) {
      return 'valid';
    }
    
    return 'idle';
  }, [touchedFields, validation.errors, formData]);

  // Email suggestion for typos
  const emailSuggestion = useMemo(() => {
    if (formData.email_address && touchedFields.email_address) {
      return ValidationUtils.getEmailSuggestion(formData.email_address);
    }
    return null;
  }, [formData.email_address, touchedFields.email_address]);

  // Submit form with comprehensive error handling
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation display
    const allFields = Object.keys(formData);
    setTouchedFields(
      allFields.reduce((acc, field) => ({ ...acc, [field]: true }), {})
    );

    // Validate form
    if (!validation.success) {
      setFormState({
        isLoading: false,
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        error: 'Please check all required fields'
      });
      return;
    }

    setFormState({
      isLoading: false,
      isSubmitting: true,
      isSuccess: false,
      isError: false
    });

    try {
      // Prepare submission payload
      const payload: RSVPSubmissionPayload = {
        guest_token: token,
        guest_name: guestInfo?.guest_name || 'Guest',
        attending: formData.attending!,
        meal_choice: formData.attending ? formData.meal_choice : undefined,
        dietary_restrictions: formData.dietary_restrictions || undefined,
        email_address: formData.email_address || undefined,
        whatsapp_number: guestInfo?.whatsapp_number,
        wants_email_confirmation: Boolean(formData.email_address),
        wants_whatsapp_confirmation: false
      };

      // Submit RSVP
      const result = await submitRSVP(payload);

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit RSVP');
      }

      // Send email confirmation if requested
      if (formData.email_address) {
        try {
          const emailResult = await emailService.sendRSVPConfirmation(payload, result.data || '');
          
          if (emailResult.success) {
            console.log('✅ Email confirmation queued successfully');
          } else {
            console.warn('⚠️ Email confirmation failed:', emailResult.error);
            // Don't fail the submission for email issues - user still gets success
          }
        } catch (emailError) {
          console.warn('Failed to send email confirmation:', emailError);
          // Don't fail the submission for email issues
        }
      }

      // Success state
      setFormState({
        isLoading: false,
        isSubmitting: false,
        isSuccess: true,
        isError: false,
        submissionId: result.data
      });

      // Call success callback
      onSuccess?.(result.data!);

      // Track successful submission for analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'rsvp_submit', {
          event_category: 'engagement',
          event_label: formData.attending ? 'attending' : 'not_attending',
          value: 1
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      
      setFormState({
        isLoading: false,
        isSubmitting: false,
        isSuccess: false,
        isError: true,
        error: errorMessage
      });

      onError?.(errorMessage);

      // Track failed submission
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'rsvp_error', {
          event_category: 'error',
          event_label: errorMessage,
          value: 1
        });
      }
    }
  }, [formData, validation, token, guestInfo, onSuccess, onError]);

  // Loading state
  if (formState.isLoading) {
    return <FormLoadingSkeleton className={className} />;
  }

  // Success state
  if (formState.isSuccess) {
    return (
      <motion.div
        className={cn(
          'max-w-md mx-auto p-8 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl shadow-lg border border-rose-100',
          className
        )}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
          </motion.div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-rose-900">
              {formData.attending ? 'We can\'t wait to celebrate with you!' : 'Thank you for letting us know'}
            </h3>
            <p className="text-rose-700">
              {formData.attending 
                ? 'Your RSVP has been confirmed. See you on October 31st!'
                : 'We\'ll miss you on our special day, but we understand.'
              }
            </p>
          </div>

          {formData.email_address && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-rose-600 bg-rose-100 p-3 rounded-lg"
            >
              📧 A confirmation email has been sent to {formData.email_address}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-rose-800"
          >
            <HeartIcon className="w-5 h-5 text-rose-500" />
            <span className="text-sm">Dale & Kirsten</span>
            <HeartIcon className="w-5 h-5 text-rose-500" />
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        'max-w-md mx-auto space-y-6 p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-rose-100',
        className
      )}
      noValidate
    >
      {/* Header */}
      <motion.div
        className="text-center space-y-2 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-rose-900 font-serif">
          RSVP
        </h2>
        <p className="text-rose-700">
          Dale & Kirsten's Wedding
        </p>
        <p className="text-sm text-rose-600">
          October 31st, 2025 • Cape Point Vineyards
        </p>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {formState.isError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-900">
                  Unable to submit RSVP
                </h4>
                <p className="text-sm text-red-700 mt-1">
                  {formState.error}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Attending Field */}
      <FormField
        id="attending"
        name="attending"
        label="Will you be attending?"
        required
        error={touchedFields.attending ? validation.errors.attending : undefined}
      >
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: true, label: 'Yes, I\'ll be there! 🎉', color: 'green' },
            { value: false, label: 'Sorry, can\'t make it 😔', color: 'gray' }
          ].map((option) => (
            <label
              key={option.value.toString()}
              className={cn(
                'relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
                formData.attending === option.value
                  ? option.color === 'green'
                    ? 'border-green-500 bg-green-50 text-green-900'
                    : 'border-gray-500 bg-gray-50 text-gray-900'
                  : 'border-rose-200 bg-white hover:border-rose-300 hover:bg-rose-50',
                'focus-within:ring-2 focus-within:ring-rose-500 focus-within:ring-offset-2'
              )}
            >
              <input
                type="radio"
                name="attending"
                value={option.value.toString()}
                checked={formData.attending === option.value}
                onChange={(e) => handleFieldChange('attending', e.target.value === 'true')}
                onBlur={() => handleFieldBlur('attending')}
                className="sr-only"
                aria-describedby={validation.errors.attending ? 'attending-error' : undefined}
              />
              <span className="text-sm font-medium text-center leading-tight">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </FormField>

      {/* Meal Choice Field - Only show if attending */}
      <AnimatePresence>
        {formData.attending && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FormField
              id="meal_choice"
              name="meal_choice"
              label="Menu Selection"
              required
              error={touchedFields.meal_choice ? validation.errors.meal_choice : undefined}
              helpText="Select your preferred meal for the reception"
            >
              <select
                id="meal_choice"
                name="meal_choice"
                value={formData.meal_choice}
                onChange={(e) => handleFieldChange('meal_choice', e.target.value)}
                onBlur={() => handleFieldBlur('meal_choice')}
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 bg-white transition-colors duration-200',
                  'focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none',
                  getFieldState('meal_choice') === 'invalid'
                    ? 'border-red-300 bg-red-50'
                    : 'border-rose-200 hover:border-rose-300'
                )}
                aria-describedby={validation.errors.meal_choice ? 'meal-choice-error' : undefined}
              >
                <option value="">Select your meal preference</option>
                {MEAL_CHOICES.map((meal) => (
                  <option key={meal.value} value={meal.value}>
                    {meal.label} - {meal.description}
                  </option>
                ))}
              </select>
            </FormField>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dietary Restrictions Field - Only show if attending */}
      <AnimatePresence>
        {formData.attending && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <FormField
              id="dietary_restrictions"
              name="dietary_restrictions"
              label="Dietary Restrictions"
              error={touchedFields.dietary_restrictions ? validation.errors.dietary_restrictions : undefined}
              helpText="Please let us know about any allergies or dietary requirements"
            >
              <textarea
                id="dietary_restrictions"
                name="dietary_restrictions"
                value={formData.dietary_restrictions}
                onChange={(e) => handleFieldChange('dietary_restrictions', e.target.value)}
                onBlur={() => handleFieldBlur('dietary_restrictions')}
                rows={3}
                placeholder="e.g., Vegetarian, gluten-free, nut allergy..."
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 bg-white transition-colors duration-200 resize-none',
                  'focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none',
                  getFieldState('dietary_restrictions') === 'invalid'
                    ? 'border-red-300 bg-red-50'
                    : 'border-rose-200 hover:border-rose-300'
                )}
                maxLength={500}
                aria-describedby={validation.errors.dietary_restrictions ? 'dietary-restrictions-error' : undefined}
              />
            </FormField>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email Field */}
      <FormField
        id="email_address"
        name="email_address"
        label="Email Address"
        error={touchedFields.email_address ? validation.errors.email_address : undefined}
        helpText="Optional - We'll send you a confirmation and any important updates"
      >
        <div className="space-y-2">
          <input
            type="email"
            id="email_address"
            name="email_address"
            value={formData.email_address}
            onChange={(e) => handleFieldChange('email_address', e.target.value)}
            onBlur={() => handleFieldBlur('email_address')}
            placeholder="your.email@example.com"
            className={cn(
              'w-full px-4 py-3 rounded-xl border-2 bg-white transition-colors duration-200',
              'focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none',
              getFieldState('email_address') === 'invalid'
                ? 'border-red-300 bg-red-50'
                : getFieldState('email_address') === 'valid'
                ? 'border-green-300 bg-green-50'
                : 'border-rose-200 hover:border-rose-300'
            )}
            aria-describedby={validation.errors.email_address ? 'email-error' : undefined}
          />
          
          {/* Email suggestion */}
          <AnimatePresence>
            {emailSuggestion && (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => handleFieldChange('email_address', emailSuggestion)}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Did you mean {emailSuggestion}?
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </FormField>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={formState.isSubmitting || !validation.success}
        className={cn(
          'w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200',
          'focus:outline-none focus:ring-4 focus:ring-rose-500/50',
          formState.isSubmitting || !validation.success
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 active:scale-95 shadow-lg hover:shadow-xl'
        )}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {formState.isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <LoadingSpinner size="sm" color="white" />
            <span>Submitting RSVP...</span>
          </div>
        ) : (
          <span>
            {formData.attending === true ? 'Confirm My Attendance' : 
             formData.attending === false ? 'Submit Response' : 
             'Submit RSVP'}
          </span>
        )}
      </motion.button>

      {/* Footer */}
      <motion.p
        className="text-center text-xs text-rose-600 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        Please RSVP by September 30th, 2025
      </motion.p>
    </form>
  );
};

export default RSVPForm;