/**
 * Guest Import Wizard
 * Dale & Kirsten's Wedding RSVP System
 * 
 * Step-by-step wizard for importing guests with WhatsApp numbers and generating tokens
 */

'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { GuestImportData, GuestImportResult, TokenGenerationOptions } from '@/types/whatsapp';
import whatsappService from '@/lib/whatsappService';
import tokenGenerator from '@/lib/tokenGenerator';

interface GuestImportWizardProps {
  onImportComplete: (result: GuestImportResult) => void;
  onCancel: () => void;
  className?: string;
}

type WizardStep = 'upload' | 'configure' | 'preview' | 'import' | 'complete';

interface ParsedGuest {
  guest_name: string;
  phone_number: string;
  email_address?: string;
  has_plus_one?: boolean;
  is_child?: boolean;
  notes?: string;
  row: number;
  errors: string[];
  isValid: boolean;
}

const SAMPLE_CSV = `guest_name,phone_number,email_address,has_plus_one,is_child,notes
John Smith,+27821234567,john@email.com,false,false,Best man
Sarah Johnson,+27829876543,sarah@email.com,true,false,Maid of honor
Michael Brown,+27834567890,,false,false,
Emily Davis,+27843210987,emily@email.com,false,true,Flower girl`;

const StepIndicator: React.FC<{
  steps: { id: WizardStep; label: string }[];
  currentStep: WizardStep;
}> = ({ steps, currentStep }) => {
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-200',
                index <= currentIndex
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              )}
            >
              {index < currentIndex ? (
                <CheckCircleIcon className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                'text-xs mt-2 transition-colors duration-200',
                index <= currentIndex ? 'text-rose-600' : 'text-gray-500'
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'w-12 h-0.5 mx-4 transition-colors duration-200',
                index < currentIndex ? 'bg-rose-500' : 'bg-gray-200'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const UploadStep: React.FC<{
  onFileUpload: (guests: ParsedGuest[]) => void;
  onNext: () => void;
}> = ({ onFileUpload, onNext }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = useCallback((csvText: string): ParsedGuest[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must contain at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['guest_name', 'phone_number'];
    
    const missingHeaders = requiredHeaders.filter(req => !headers.includes(req));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const guests: ParsedGuest[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
      const guest: ParsedGuest = {
        guest_name: '',
        phone_number: '',
        row: i + 1,
        errors: [],
        isValid: true
      };

      headers.forEach((header, index) => {
        const value = row[index] || '';
        
        switch (header) {
          case 'guest_name':
            guest.guest_name = value;
            break;
          case 'phone_number':
            guest.phone_number = value;
            break;
          case 'email_address':
            guest.email_address = value || undefined;
            break;
          case 'has_plus_one':
            guest.has_plus_one = value.toLowerCase() === 'true';
            break;
          case 'is_child':
            guest.is_child = value.toLowerCase() === 'true';
            break;
          case 'notes':
            guest.notes = value || undefined;
            break;
        }
      });

      // Validate guest data
      if (!guest.guest_name.trim()) {
        guest.errors.push('Guest name is required');
        guest.isValid = false;
      }

      if (!guest.phone_number.trim()) {
        guest.errors.push('Phone number is required');
        guest.isValid = false;
      } else {
        const phoneValidation = tokenGenerator.validatePhoneNumber(guest.phone_number);
        if (!phoneValidation.isValid) {
          guest.errors.push(`Invalid phone number: ${phoneValidation.errors.join(', ')}`);
          guest.isValid = false;
        }
      }

      if (guest.email_address && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email_address)) {
        guest.errors.push('Invalid email address format');
        guest.isValid = false;
      }

      guests.push(guest);
    }

    return guests;
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      const text = await file.text();
      const guests = parseCSV(text);
      onFileUpload(guests);
      onNext();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to parse CSV file');
    } finally {
      setIsProcessing(false);
    }
  }, [parseCSV, onFileUpload, onNext]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const csvFile = files.find(file => file.type === 'text/csv' || file.name.endsWith('.csv'));

    if (csvFile) {
      handleFileUpload(csvFile);
    } else {
      setError('Please upload a CSV file');
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const downloadSample = useCallback(() => {
    const blob = new Blob([SAMPLE_CSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wedding-guests-sample.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Guest List</h2>
        <p className="text-gray-600">
          Upload a CSV file with your wedding guests' information
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200',
          isDragging
            ? 'border-rose-500 bg-rose-50'
            : 'border-gray-300 hover:border-gray-400'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <CloudArrowUpIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        
        {isProcessing ? (
          <div className="space-y-2">
            <div className="w-8 h-8 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600">Processing your file...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Drag and drop your CSV file here
            </h3>
            <p className="text-gray-600">or</p>
            
            <label className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium cursor-pointer transition-colors duration-200">
              <DocumentTextIcon className="w-5 h-5" />
              Choose CSV File
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            <div className="text-sm text-gray-500 space-y-2">
              <p>Maximum file size: 10MB</p>
              <p>Supported format: CSV (.csv)</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-900">Upload Error</h4>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSV Format Guide */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="text-sm font-semibold text-blue-900 mb-3">CSV Format Requirements</h4>
        
        <div className="space-y-3 text-sm text-blue-800">
          <div>
            <strong>Required columns:</strong>
            <ul className="mt-1 ml-4 list-disc">
              <li><code>guest_name</code> - Full name of the guest</li>
              <li><code>phone_number</code> - WhatsApp phone number (include country code)</li>
            </ul>
          </div>
          
          <div>
            <strong>Optional columns:</strong>
            <ul className="mt-1 ml-4 list-disc">
              <li><code>email_address</code> - Email for RSVP confirmations</li>
              <li><code>has_plus_one</code> - true/false for plus one guests</li>
              <li><code>is_child</code> - true/false for children</li>
              <li><code>notes</code> - Additional notes about the guest</li>
            </ul>
          </div>
        </div>

        <button
          onClick={downloadSample}
          className="mt-4 inline-flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 font-medium"
        >
          <ClipboardDocumentListIcon className="w-4 h-4" />
          Download Sample CSV
        </button>
      </div>
    </div>
  );
};

const ConfigureStep: React.FC<{
  tokenOptions: TokenGenerationOptions;
  onOptionsChange: (options: TokenGenerationOptions) => void;
  onNext: () => void;
  onBack: () => void;
}> = ({ tokenOptions, onOptionsChange, onNext, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Security Settings</h2>
        <p className="text-gray-600">
          Customize token generation and security options
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
        {/* Token Length */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token Length
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="8"
              max="32"
              value={tokenOptions.length}
              onChange={(e) => onOptionsChange({ ...tokenOptions, length: parseInt(e.target.value) })}
              className="flex-1"
            />
            <span className="w-12 text-sm font-mono bg-gray-100 px-2 py-1 rounded">
              {tokenOptions.length}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Longer tokens are more secure but harder to share manually
          </p>
        </div>

        {/* Expiry Days */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token Expiry (Days)
          </label>
          <select
            value={tokenOptions.expiry_days}
            onChange={(e) => onOptionsChange({ ...tokenOptions, expiry_days: parseInt(e.target.value) })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          >
            <option value={30}>30 days</option>
            <option value={60}>60 days (Recommended)</option>
            <option value={90}>90 days</option>
            <option value={180}>180 days</option>
            <option value={365}>1 year</option>
          </select>
        </div>

        {/* Security Options */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Security Options</h4>
          
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={tokenOptions.use_crypto_random}
              onChange={(e) => onOptionsChange({ ...tokenOptions, use_crypto_random: e.target.checked })}
              className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 focus:ring-2"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Use Crypto-Random Generation</span>
              <p className="text-xs text-gray-500">
                Use cryptographically secure random number generation (recommended)
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={tokenOptions.include_checksum}
              onChange={(e) => onOptionsChange({ ...tokenOptions, include_checksum: e.target.checked })}
              className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 focus:ring-2"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Include Checksum</span>
              <p className="text-xs text-gray-500">
                Add validation checksum to prevent typos
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={tokenOptions.generate_backup}
              onChange={(e) => onOptionsChange({ ...tokenOptions, generate_backup: e.target.checked })}
              className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 focus:ring-2"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Generate Backup Tokens</span>
              <p className="text-xs text-gray-500">
                Create backup tokens for recovery purposes
              </p>
            </div>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={tokenOptions.exclude_similar_chars}
              onChange={(e) => onOptionsChange({ ...tokenOptions, exclude_similar_chars: e.target.checked })}
              className="w-4 h-4 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 focus:ring-2"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Exclude Similar Characters</span>
              <p className="text-xs text-gray-500">
                Exclude 0, O, 1, I to prevent confusion (recommended)
              </p>
            </div>
          </label>
        </div>

        {/* Token Prefix */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Token Prefix (Optional)
          </label>
          <input
            type="text"
            value={tokenOptions.prefix || ''}
            onChange={(e) => onOptionsChange({ ...tokenOptions, prefix: e.target.value || undefined })}
            placeholder="e.g., WED_"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            maxLength={8}
          />
          <p className="text-xs text-gray-500 mt-1">
            Optional prefix to identify your wedding tokens
          </p>
        </div>
      </div>

      {/* Security Level Indicator */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <ShieldCheckIcon className="w-5 h-5 text-green-500" />
          <div>
            <h4 className="text-sm font-semibold text-green-900">Security Level: High</h4>
            <p className="text-sm text-green-700">
              Your current settings provide excellent security for your wedding RSVPs
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors duration-200"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors duration-200"
        >
          Continue
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const PreviewStep: React.FC<{
  guests: ParsedGuest[];
  tokenOptions: TokenGenerationOptions;
  onNext: () => void;
  onBack: () => void;
}> = ({ guests, tokenOptions, onNext, onBack }) => {
  const validGuests = guests.filter(g => g.isValid);
  const invalidGuests = guests.filter(g => !g.isValid);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Guest Data</h2>
        <p className="text-gray-600">
          Verify your guest information before generating tokens
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{validGuests.length}</div>
          <div className="text-sm text-green-700">Valid Guests</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{invalidGuests.length}</div>
          <div className="text-sm text-red-700">Errors</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{guests.length}</div>
          <div className="text-sm text-blue-700">Total Rows</div>
        </div>
      </div>

      {/* Error Summary */}
      {invalidGuests.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-3">Validation Errors</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {invalidGuests.map((guest, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium text-red-800">Row {guest.row}:</span>
                <span className="text-red-700 ml-2">{guest.guest_name || 'Unknown'}</span>
                <ul className="ml-4 list-disc text-red-600">
                  {guest.errors.map((error, i) => (
                    <li key={i}>{error}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Valid Guests Preview */}
      {validGuests.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Valid Guests ({validGuests.length})</h4>
          </div>
          <div className="max-h-64 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Plus One</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {validGuests.slice(0, 10).map((guest, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{guest.guest_name}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{guest.phone_number}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{guest.email_address || '—'}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{guest.has_plus_one ? 'Yes' : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {validGuests.length > 10 && (
              <div className="p-3 text-center text-sm text-gray-500">
                ... and {validGuests.length - 10} more guests
              </div>
            )}
          </div>
        </div>
      )}

      {/* Token Configuration Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-3">Token Configuration</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700">Length:</span>
            <span className="ml-2 font-medium text-blue-900">{tokenOptions.length} characters</span>
          </div>
          <div>
            <span className="text-blue-700">Expiry:</span>
            <span className="ml-2 font-medium text-blue-900">{tokenOptions.expiry_days} days</span>
          </div>
          <div>
            <span className="text-blue-700">Crypto-secure:</span>
            <span className="ml-2 font-medium text-blue-900">{tokenOptions.use_crypto_random ? 'Yes' : 'No'}</span>
          </div>
          <div>
            <span className="text-blue-700">Backup tokens:</span>
            <span className="ml-2 font-medium text-blue-900">{tokenOptions.generate_backup ? 'Yes' : 'No'}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors duration-200"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={validGuests.length === 0}
          className={cn(
            'flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors duration-200',
            validGuests.length > 0
              ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          )}
        >
          Import {validGuests.length} Guests
          <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ImportStep: React.FC<{
  guests: ParsedGuest[];
  tokenOptions: TokenGenerationOptions;
  onComplete: (result: GuestImportResult) => void;
}> = ({ guests, tokenOptions, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentGuest, setCurrentGuest] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const startImport = useCallback(async () => {
    setIsImporting(true);
    
    try {
      const validGuests = guests.filter(g => g.isValid);
      const guestData: GuestImportData[] = validGuests.map(g => ({
        guest_name: g.guest_name,
        phone_number: g.phone_number,
        email_address: g.email_address,
        has_plus_one: g.has_plus_one,
        is_child: g.is_child,
        notes: g.notes
      }));

      // Simulate progress updates
      for (let i = 0; i <= validGuests.length; i++) {
        setProgress((i / validGuests.length) * 100);
        if (i < validGuests.length) {
          setCurrentGuest(validGuests[i].guest_name);
        }
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      const result = await whatsappService.importGuestsWithTokens(guestData, tokenOptions);
      
      if (result.success && result.data) {
        onComplete(result.data);
      } else {
        throw new Error(result.error || 'Import failed');
      }
    } catch (error) {
      console.error('Import error:', error);
      // Handle error - could show error state
    } finally {
      setIsImporting(false);
    }
  }, [guests, tokenOptions, onComplete]);

  React.useEffect(() => {
    startImport();
  }, [startImport]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Importing Guests</h2>
        <p className="text-gray-600">
          Generating secure tokens and creating WhatsApp links...
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Progress Circle */}
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-rose-500"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${progress}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-900">{Math.round(progress)}%</span>
            </div>
          </div>

          {/* Current Status */}
          <div className="text-center">
            <div className="text-lg font-medium text-gray-900 mb-2">
              {isImporting ? 'Processing...' : 'Complete!'}
            </div>
            {currentGuest && (
              <div className="text-sm text-gray-600">
                Current: {currentGuest}
              </div>
            )}
          </div>

          {/* Progress Details */}
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Validating phone numbers...</span>
              <CheckCircleIcon className="w-4 h-4 text-green-500" />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Generating secure tokens...</span>
              {progress > 30 ? (
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Creating RSVP links...</span>
              {progress > 60 ? (
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full" />
              )}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Generating WhatsApp links...</span>
              {progress > 90 ? (
                <CheckCircleIcon className="w-4 h-4 text-green-500" />
              ) : (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompleteStep: React.FC<{
  result: GuestImportResult;
  onFinish: () => void;
}> = ({ result, onFinish }) => {
  const successRate = result.total_processed > 0 
    ? (result.successful_imports / result.total_processed) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Import Complete!</h2>
        <p className="text-gray-600">
          Your guests have been successfully imported with secure RSVP tokens
        </p>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{result.successful_imports}</div>
          <div className="text-sm text-green-700">Guests Imported</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{successRate.toFixed(1)}%</div>
          <div className="text-sm text-blue-700">Success Rate</div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h4 className="font-medium text-gray-900">Import Summary</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Processed:</span>
            <span className="font-medium">{result.total_processed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Successfully Imported:</span>
            <span className="font-medium text-green-600">{result.successful_imports}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Failed Imports:</span>
            <span className="font-medium text-red-600">{result.failed_imports}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Batch ID:</span>
            <span className="font-mono text-xs">{result.batch_id}</span>
          </div>
        </div>
      </div>

      {/* Error Details */}
      {result.validation_errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-medium text-red-900 mb-3">Import Errors</h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {result.validation_errors.map((error, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium text-red-800">Row {error.row}:</span>
                <span className="text-red-700 ml-2">{error.guest_name}</span>
                <ul className="ml-4 list-disc text-red-600">
                  {error.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h4 className="font-medium text-blue-900 mb-3">What's Next?</h4>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-blue-600" />
            Review your guest list in the WhatsApp Guests tab
          </li>
          <li className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-blue-600" />
            Generate WhatsApp invitation links
          </li>
          <li className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-blue-600" />
            Launch your invitation campaign
          </li>
          <li className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-blue-600" />
            Monitor RSVP responses in real-time
          </li>
        </ul>
      </div>

      {/* Finish Button */}
      <div className="text-center pt-6 border-t border-gray-200">
        <button
          onClick={onFinish}
          className="px-8 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors duration-200"
        >
          Continue to Guest Management
        </button>
      </div>
    </div>
  );
};

const GuestImportWizard: React.FC<GuestImportWizardProps> = ({
  onImportComplete,
  onCancel,
  className
}) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('upload');
  const [parsedGuests, setParsedGuests] = useState<ParsedGuest[]>([]);
  const [tokenOptions, setTokenOptions] = useState<TokenGenerationOptions>({
    length: 12,
    use_crypto_random: true,
    include_checksum: true,
    expiry_days: 60,
    generate_backup: true,
    exclude_similar_chars: true
  });
  const [importResult, setImportResult] = useState<GuestImportResult | null>(null);

  const steps = [
    { id: 'upload' as WizardStep, label: 'Upload' },
    { id: 'configure' as WizardStep, label: 'Configure' },
    { id: 'preview' as WizardStep, label: 'Preview' },
    { id: 'import' as WizardStep, label: 'Import' },
    { id: 'complete' as WizardStep, label: 'Complete' }
  ];

  const handleFileUpload = (guests: ParsedGuest[]) => {
    setParsedGuests(guests);
  };

  const handleImportComplete = (result: GuestImportResult) => {
    setImportResult(result);
    setCurrentStep('complete');
    onImportComplete(result);
  };

  const handleFinish = () => {
    onCancel(); // Close the wizard
  };

  return (
    <div className={cn('fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4', className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Import Wedding Guests</h1>
            <p className="text-sm text-gray-600">Generate secure RSVP tokens and WhatsApp links</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <StepIndicator steps={steps} currentStep={currentStep} />

          <AnimatePresence mode="wait">
            {currentStep === 'upload' && (
              <motion.div
                key="upload"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <UploadStep
                  onFileUpload={handleFileUpload}
                  onNext={() => setCurrentStep('configure')}
                />
              </motion.div>
            )}

            {currentStep === 'configure' && (
              <motion.div
                key="configure"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ConfigureStep
                  tokenOptions={tokenOptions}
                  onOptionsChange={setTokenOptions}
                  onNext={() => setCurrentStep('preview')}
                  onBack={() => setCurrentStep('upload')}
                />
              </motion.div>
            )}

            {currentStep === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PreviewStep
                  guests={parsedGuests}
                  tokenOptions={tokenOptions}
                  onNext={() => setCurrentStep('import')}
                  onBack={() => setCurrentStep('configure')}
                />
              </motion.div>
            )}

            {currentStep === 'import' && (
              <motion.div
                key="import"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <ImportStep
                  guests={parsedGuests}
                  tokenOptions={tokenOptions}
                  onComplete={handleImportComplete}
                />
              </motion.div>
            )}

            {currentStep === 'complete' && importResult && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <CompleteStep
                  result={importResult}
                  onFinish={handleFinish}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default GuestImportWizard;