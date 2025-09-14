'use client';

import { useState, useEffect, ReactNode } from 'react';
import { CustomDropdown } from './CustomDropdown';

export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  validation?: (value: string, formData?: Record<string, any>) => string | undefined;
  disabled?: boolean;
}

export interface FormModalProps<T> {
  mode: 'add' | 'edit';
  title: string;
  fields: FormField[];
  initialData?: Partial<T>;
  onClose: () => void;
  onSubmit: (data: Partial<T>) => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  className?: string;
}

export function FormModal<T>({
  mode,
  title,
  fields,
  initialData,
  onClose,
  onSubmit,
  submitButtonText,
  cancelButtonText = 'Cancel',
  className = ''
}: FormModalProps<T>) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};

    fields.forEach(field => {
      const value = formData[field.key] || '';
      
      // Required validation - convert to string for trim() check
      if (field.required) {
        const stringValue = String(value);
        if (!stringValue.trim()) {
          newErrors[field.key] = `${field.label} is required`;
          return;
        }
      }

      // Custom validation
      if (field.validation && value) {
        const validationError = field.validation(String(value), formData);
        if (validationError) {
          newErrors[field.key] = validationError;
        }
      }
    });

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submit triggered with data:', formData);
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      console.log('Form validation failed:', validationErrors);
      setErrors(validationErrors);
      return;
    }

    console.log('Form validation passed, calling onSubmit');
    onSubmit(formData as Partial<T>);
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
    
    // If password field changed, also validate re-password field
    if (key === 'password') {
      const rePasswordField = fields.find(field => field.key === 'rePassword');
      if (rePasswordField && rePasswordField.validation) {
        const rePasswordValue = formData.rePassword || '';
        const validationError = rePasswordField.validation(rePasswordValue, { ...formData, [key]: value });
        if (validationError) {
          setErrors(prev => ({ ...prev, rePassword: validationError }));
        } else if (errors.rePassword) {
          setErrors(prev => ({ ...prev, rePassword: '' }));
        }
      }
    }
  };

  const renderField = (field: FormField): ReactNode => {
    const value = formData[field.key] || '';
    const error = errors[field.key];

    const baseClassName = `w-full px-3 py-2 text-sm border rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none text-gray-900 placeholder-gray-500 ${
      error ? 'border-red-300' : 'border-gray-300'
    }`;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={baseClassName}
            placeholder={field.placeholder}
            disabled={field.disabled}
            rows={3}
          />
        );

      case 'select':
        return (
          <CustomDropdown
            options={field.options || []}
            value={value}
            onChange={(newValue) => handleInputChange(field.key, newValue)}
            placeholder={field.placeholder || 'Select an option'}
            disabled={field.disabled}
            className={error ? 'border-red-300' : ''}
          />
        );

      default:
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={baseClassName}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Modal */}
      <div className={`bg-white rounded-lg shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl border border-gray-200 ${className}`}>
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h3>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-4">
          <div className="space-y-4 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
            {fields.map(field => (
              <div key={field.key}>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {errors[field.key] && (
                  <p className="text-xs text-red-500 mt-1">{errors[field.key]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              {cancelButtonText}
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-md hover:from-green-600 hover:to-green-700 transition-all duration-200"
            >
              {submitButtonText || (mode === 'add' ? 'Create' : 'Update')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 