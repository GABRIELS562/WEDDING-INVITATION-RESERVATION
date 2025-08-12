import { useState, useCallback, useEffect, useRef } from 'react';
import type { RSVPSubmission, IndividualGuest } from '../types';
import { googleSheetsService } from '../services/GoogleSheetsService';
import { emailService } from '../utils/emailService';
import { validateToken, getGuestInfo } from '../utils/guestSecurity';
import { sendClientWhatsAppConfirmations } from '../utils/whatsappService';
import { normalizePhoneNumber } from '../utils/phoneUtils';

// Form data interface for the hook
export interface RSVPFormData {
  isAttending: boolean | null;
  guestName: string;
  email: string;
  whatsappNumber?: string;
  mealChoice: string;
  dietaryRestrictions: string;
  plusOneName: string;
  plusOneMealChoice: string;
  plusOneDietaryRestrictions: string;
  wantsEmailConfirmation: boolean;
  wantsWhatsAppConfirmation?: boolean;
  specialRequests: string;
}

// Validation errors interface
export interface RSVPValidationErrors {
  attendance?: string;
  guestName?: string;
  email?: string;
  mealChoice?: string;
  plusOneMealChoice?: string;
  token?: string;
  general?: string;
}

// Submission states
export interface RSVPSubmissionState {
  isSubmitting: boolean;
  isSubmitSuccess: boolean;
  isSubmitError: boolean;
  submitError: string | null;
  submissionId: string | null;
}

// Email states
export interface RSVPEmailState {
  isSendingEmail: boolean;
  isEmailSent: boolean;
  isEmailError: boolean;
  emailError: string | null;
}

// Loading states
export interface RSVPLoadingState {
  isLoading: boolean;
  isLoadingExisting: boolean;
  isValidatingToken: boolean;
}

// Hook return interface
export interface UseRSVPFormReturn {
  // Form state
  formData: RSVPFormData;
  setFormData: React.Dispatch<React.SetStateAction<RSVPFormData>>;
  updateField: (field: keyof RSVPFormData, value: any) => void;
  
  // Validation
  errors: RSVPValidationErrors;
  isFormValid: boolean;
  validateForm: () => boolean;
  clearErrors: () => void;
  
  // Submission state
  submissionState: RSVPSubmissionState;
  emailState: RSVPEmailState;
  loadingState: RSVPLoadingState;
  
  // Actions
  submitRSVP: (token: string, guestInfo: IndividualGuest) => Promise<boolean>;
  loadExistingRSVP: (token: string) => Promise<boolean>;
  resetForm: () => void;
  
  // Utilities
  hasExistingSubmission: boolean;
  canSubmit: boolean;
  getFormProgress: () => number;
}

// Default form data
const getDefaultFormData = (): RSVPFormData => ({
  isAttending: null,
  guestName: '',
  email: '',
  whatsappNumber: '',
  mealChoice: '',
  dietaryRestrictions: '',
  plusOneName: '',
  plusOneMealChoice: '',
  plusOneDietaryRestrictions: '',
  wantsEmailConfirmation: true,
  wantsWhatsAppConfirmation: false,
  specialRequests: ''
});

// Real-time validation rules (for enabling/disabling submit button)
const validateFormData = (data: RSVPFormData): RSVPValidationErrors => {
  const errors: RSVPValidationErrors = {};

  // Attendance is required
  if (data.isAttending === null) {
    errors.attendance = 'Please select whether you will be attending';
  }

  // Guest name validation
  if (!data.guestName.trim()) {
    errors.guestName = 'Guest name is required';
  } else if (data.guestName.trim().length < 2) {
    errors.guestName = 'Guest name must be at least 2 characters';
  } else if (data.guestName.trim().length > 100) {
    errors.guestName = 'Guest name is too long';
  }

  // Email validation - only validate format if email is provided
  // Email is optional, but if provided, must be valid format
  if (data.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  // Note: Meal choice validation is done at submission time, not real-time
  // This allows users to select "YES" and still have an enabled submit button
  // while they're choosing their meal

  return errors;
};

// Comprehensive validation for submission (includes meal requirements)
const validateForSubmission = (data: RSVPFormData): RSVPValidationErrors => {
  const errors = validateFormData(data);

  // Meal choice validation for attending guests
  if (data.isAttending) {
    if (!data.mealChoice.trim()) {
      errors.mealChoice = 'Meal selection is required for attending guests';
    }

    // Plus-one meal validation
    if (data.plusOneName.trim() && !data.plusOneMealChoice.trim()) {
      errors.plusOneMealChoice = 'Plus-one meal selection is required';
    }
  }

  return errors;
};

// Local storage key for form persistence
const getStorageKey = (token: string) => `rsvp_form_${token}`;

export const useRSVPForm = (): UseRSVPFormReturn => {
  // Form state
  const [formData, setFormData] = useState<RSVPFormData>(getDefaultFormData);
  const [errors, setErrors] = useState<RSVPValidationErrors>({});
  
  // Submission state
  const [submissionState, setSubmissionState] = useState<RSVPSubmissionState>({
    isSubmitting: false,
    isSubmitSuccess: false,
    isSubmitError: false,
    submitError: null,
    submissionId: null
  });
  
  // Email state
  const [emailState, setEmailState] = useState<RSVPEmailState>({
    isSendingEmail: false,
    isEmailSent: false,
    isEmailError: false,
    emailError: null
  });
  
  // Loading state
  const [loadingState, setLoadingState] = useState<RSVPLoadingState>({
    isLoading: false,
    isLoadingExisting: false,
    isValidatingToken: false
  });
  
  // Additional state
  const [hasExistingSubmission, setHasExistingSubmission] = useState(false);
  const currentTokenRef = useRef<string | null>(null);

  // Update individual form field
  const updateField = useCallback((field: keyof RSVPFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (errors[field as keyof RSVPValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  // Validate form and return boolean (comprehensive validation for submission)
  const validateForm = useCallback(() => {
    const validationErrors = validateForSubmission(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData]);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Reset form to default state
  const resetForm = useCallback(() => {
    setFormData(getDefaultFormData());
    setErrors({});
    setSubmissionState({
      isSubmitting: false,
      isSubmitSuccess: false,
      isSubmitError: false,
      submitError: null,
      submissionId: null
    });
    setEmailState({
      isSendingEmail: false,
      isEmailSent: false,
      isEmailError: false,
      emailError: null
    });
    setHasExistingSubmission(false);
    
    // Clear persisted data
    if (currentTokenRef.current) {
      localStorage.removeItem(getStorageKey(currentTokenRef.current));
    }
  }, []);

  // Load existing RSVP
  const loadExistingRSVP = useCallback(async (token: string): Promise<boolean> => {
    setLoadingState(prev => ({ ...prev, isLoadingExisting: true }));
    currentTokenRef.current = token;
    
    try {
      // Validate token first
      const tokenValidation = validateToken(token);
      if (!tokenValidation.isValid) {
        setErrors({ token: tokenValidation.error || 'Invalid guest token' });
        return false;
      }

      // Try to load from Google Sheets
      const result = await googleSheetsService.getGuestRSVPByToken(token);
      
      if (result.success && result.data) {
        // Convert RSVPSubmission to form data
        const rsvpData = result.data;
        setFormData({
          isAttending: rsvpData.isAttending,
          guestName: rsvpData.guestName,
          email: rsvpData.email || '',
          mealChoice: rsvpData.mealChoice || '',
          dietaryRestrictions: rsvpData.dietaryRestrictions || '',
          plusOneName: rsvpData.plusOneName || '',
          plusOneMealChoice: rsvpData.plusOneMealChoice || '',
          plusOneDietaryRestrictions: rsvpData.plusOneDietaryRestrictions || '',
          wantsEmailConfirmation: rsvpData.wantsEmailConfirmation,
          specialRequests: rsvpData.specialRequests || ''
        });
        
        setHasExistingSubmission(true);
        
        // Persist to local storage
        localStorage.setItem(getStorageKey(token), JSON.stringify(formData));
        
        return true;
      } else {
        // No existing RSVP found - try to auto-populate guest name from token
        const guestInfo = getGuestInfo(token);
        if (guestInfo) {
          // Auto-populate the guest name
          setFormData(prev => ({
            ...prev,
            guestName: guestInfo.fullName
          }));
        }
        
        // Try to load from local storage
        const stored = localStorage.getItem(getStorageKey(token));
        if (stored) {
          try {
            const parsedData = JSON.parse(stored);
            // Merge stored data but prioritize guest name from token if it exists
            setFormData(prev => ({
              ...parsedData,
              guestName: guestInfo?.fullName || parsedData.guestName
            }));
          } catch (error) {
            console.warn('Failed to parse stored form data:', error);
          }
        }
        
        setHasExistingSubmission(false);
        return true;
      }
      
    } catch (error) {
      console.error('Error loading existing RSVP:', error);
      setErrors({ 
        general: error instanceof Error ? error.message : 'Failed to load existing RSVP' 
      });
      return false;
    } finally {
      setLoadingState(prev => ({ ...prev, isLoadingExisting: false }));
    }
  }, []);

  // Submit RSVP with comprehensive workflow
  const submitRSVP = useCallback(async (token: string, guestInfo: IndividualGuest): Promise<boolean> => {
    // Reset states
    setSubmissionState({
      isSubmitting: true,
      isSubmitSuccess: false,
      isSubmitError: false,
      submitError: null,
      submissionId: null
    });
    
    setEmailState({
      isSendingEmail: false,
      isEmailSent: false,
      isEmailError: false,
      emailError: null
    });

    try {
      // Step 1: Validate form
      const isValid = validateForm();
      
      if (!isValid) {
        setSubmissionState(prev => ({
          ...prev,
          isSubmitting: false,
          isSubmitError: true,
          submitError: 'Please fix the form errors before submitting'
        }));
        return false;
      }

      // Step 2: Validate token
      const tokenValidation = validateToken(token);
      if (!tokenValidation.isValid) {
        setErrors({ token: tokenValidation.error || 'Invalid guest token' });
        setSubmissionState(prev => ({
          ...prev,
          isSubmitting: false,
          isSubmitError: true,
          submitError: 'Invalid guest token'
        }));
        return false;
      }

      // Step 3: Prepare RSVP data
      const rsvpData: RSVPSubmission = {
        token,
        guestName: formData.guestName,
        email: formData.email || undefined,
        whatsappNumber: formData.whatsappNumber ? normalizePhoneNumber(formData.whatsappNumber) : undefined,
        isAttending: formData.isAttending!,
        mealChoice: formData.isAttending ? formData.mealChoice || undefined : undefined,
        dietaryRestrictions: formData.isAttending ? formData.dietaryRestrictions || undefined : undefined,
        plusOneName: formData.isAttending && formData.plusOneName ? formData.plusOneName : undefined,
        plusOneMealChoice: formData.isAttending && formData.plusOneName && formData.plusOneMealChoice ? formData.plusOneMealChoice : undefined,
        plusOneDietaryRestrictions: formData.isAttending && formData.plusOneName && formData.plusOneDietaryRestrictions ? formData.plusOneDietaryRestrictions : undefined,
        wantsEmailConfirmation: formData.wantsEmailConfirmation,
        wantsWhatsAppConfirmation: formData.wantsWhatsAppConfirmation || false,
        specialRequests: formData.specialRequests || undefined,
        submittedAt: new Date().toISOString()
      };

      // Step 4: Submit to Google Sheets
      let sheetsResult: any;
      if (hasExistingSubmission) {
        sheetsResult = await googleSheetsService.updateGuestRSVP(rsvpData, guestInfo);
      } else {
        sheetsResult = await googleSheetsService.submitGuestRSVP(rsvpData, guestInfo);
      }

      if (!sheetsResult.success) {
        setSubmissionState(prev => ({
          ...prev,
          isSubmitting: false,
          isSubmitError: true,
          submitError: sheetsResult.error || 'Failed to submit RSVP'
        }));
        return false;
      }

      // Step 5: Send email confirmation
      setEmailState(prev => ({ ...prev, isSendingEmail: true }));
      
      try {
        let emailResult;
        
        if (formData.wantsEmailConfirmation && formData.email) {
          // Send to guest if they provided email and want confirmation
          emailResult = await emailService.sendConfirmationEmail(rsvpData);
        } else {
          // Send to wedding clients if guest didn't provide email
          const clientRsvpData = {
            ...rsvpData,
            email: 'gabrielsgabriels300@gmail.com', // Client email
            isClientNotification: true
          };
          emailResult = await emailService.sendClientNotificationEmail(clientRsvpData);
        }
        
        if (emailResult.success) {
          // Update email status in sheets
          await googleSheetsService.updateEmailStatus(token, true);
          
          const emailMessage = formData.email ? 
            'Confirmation email sent to guest' : 
            'Notification sent to wedding clients';
          
          setEmailState(prev => ({
            ...prev,
            isSendingEmail: false,
            isEmailSent: true,
            isEmailError: false,
            emailError: null
          }));
        } else {
          setEmailState(prev => ({
            ...prev,
            isSendingEmail: false,
            isEmailSent: false,
            isEmailError: true,
            emailError: emailResult.error || 'Failed to send email'
          }));
        }
      } catch (emailError) {
        console.warn('Email sending failed:', emailError);
        setEmailState(prev => ({
          ...prev,
          isSendingEmail: false,
          isEmailSent: false,
          isEmailError: true,
          emailError: emailError instanceof Error ? emailError.message : 'Failed to send email'
        }));
      }

      // Step 6: Send WhatsApp confirmation to wedding clients
      try {
        sendClientWhatsAppConfirmations({
          guestName: formData.guestName,
          email: formData.email || undefined,
          attendance: formData.isAttending ? 'yes' : 'no',
          mealChoice: formData.isAttending ? formData.mealChoice : undefined,
          dietaryRestrictions: formData.isAttending ? formData.dietaryRestrictions : undefined,
          specialRequests: formData.specialRequests || undefined,
          submittedAt: new Date(),
          token
        });
      } catch (whatsappError) {
        console.warn('WhatsApp client notification failed:', whatsappError);
        // Don't fail the whole submission if WhatsApp notification fails
      }

      // Step 7: Update submission state
      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: false,
        isSubmitSuccess: true,
        isSubmitError: false,
        submitError: null,
        submissionId: sheetsResult.data || `RSVP_${Date.now()}`
      }));

      // Step 8: Update local state
      setHasExistingSubmission(true);
      
      // Persist form data
      localStorage.setItem(getStorageKey(token), JSON.stringify(formData));

      return true;

    } catch (error) {
      console.error('RSVP submission error:', error);
      setSubmissionState(prev => ({
        ...prev,
        isSubmitting: false,
        isSubmitError: true,
        submitError: error instanceof Error ? error.message : 'An unexpected error occurred'
      }));
      return false;
    }
  }, [formData, hasExistingSubmission, validateForm]);

  // Calculate form progress
  const getFormProgress = useCallback((): number => {
    const fields = [
      formData.isAttending !== null,
      formData.guestName.trim() !== '',
      !formData.wantsEmailConfirmation || formData.email.trim() !== '',
      !formData.isAttending || formData.mealChoice.trim() !== '',
      !formData.isAttending || !formData.plusOneName.trim() || formData.plusOneMealChoice.trim() !== ''
    ];
    
    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  }, [formData]);

  // Auto-save form data to localStorage
  useEffect(() => {
    if (currentTokenRef.current) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem(getStorageKey(currentTokenRef.current!), JSON.stringify(formData));
      }, 1000); // Debounce saves

      return () => clearTimeout(timeoutId);
    }
  }, [formData]);

  // Derived state with debugging
  const realTimeErrors = validateFormData(formData);
  const hasRealTimeErrors = Object.keys(realTimeErrors).length > 0;
  const hasCurrentErrors = Object.keys(errors).length > 0;
  
  // Simplified submit button logic - temporarily allow all submissions for debugging
  const hasBasicRequirements = formData.guestName.trim() !== '' && formData.isAttending !== null;
  const canSubmit = hasBasicRequirements && !submissionState.isSubmitting && !loadingState.isLoading;
  const isFormValid = canSubmit; // Simplified for debugging
  
  const isLoading = loadingState.isLoading || loadingState.isLoadingExisting || loadingState.isValidatingToken;

  return {
    // Form state
    formData,
    setFormData,
    updateField,
    
    // Validation
    errors,
    isFormValid,
    validateForm,
    clearErrors,
    
    // Submission state
    submissionState,
    emailState,
    loadingState: {
      ...loadingState,
      isLoading
    },
    
    // Actions
    submitRSVP,
    loadExistingRSVP,
    resetForm,
    
    // Utilities
    hasExistingSubmission,
    canSubmit,
    getFormProgress
  };
};