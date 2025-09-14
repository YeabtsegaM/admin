'use client';

import { useState, useEffect } from 'react';
import { CustomDropdown } from './CustomDropdown';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title: string;
  data: any;
  fields: {
    name: string;
    label: string;
    type: 'text' | 'password' | 'select';
    required?: boolean;
    options?: { value: string; label: string }[];
    disabled?: boolean;
    placeholder?: string;
    helpText?: string;
  }[];
  loading?: boolean;
  showPasswordSection?: boolean;
  onPasswordReset?: (newPassword: string) => void;
}

export default function EditModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  data,
  fields,
  loading = false,
  showPasswordSection = false,
  onPasswordReset
}: EditModalProps) {
  const [formData, setFormData] = useState<any>(data);
  const [newPassword, setNewPassword] = useState('');
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordReset = () => {
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    if (onPasswordReset) {
      onPasswordReset(newPassword);
      setNewPassword('');
      setShowPasswordFields(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label} {field.required && '*'}
                </label>
                {field.type === 'select' ? (
                  <CustomDropdown
                    options={field.options || []}
                    value={formData[field.name] || ''}
                    onChange={(value) => handleInputChange(field.name, value)}
                    placeholder={field.placeholder || 'Select an option'}
                    disabled={field.disabled}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                    required={field.required}
                    disabled={field.disabled}
                    minLength={field.type === 'password' ? 6 : undefined}
                    placeholder={field.placeholder}
                  />
                )}
                {field.helpText && (
                  <p className="text-xs text-gray-500 mt-1">{field.helpText}</p>
                )}
              </div>
            ))}

            {/* Password Reset Section */}
            {showPasswordSection && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">Password Management</h4>
                  <button
                    type="button"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    {showPasswordFields ? 'Cancel' : 'Reset Password'}
                  </button>
                </div>
                
                {showPasswordFields && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        New Password *
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 text-gray-900"
                        placeholder="Enter new password (min 6 characters)"
                        minLength={6}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Password must be at least 6 characters long
                      </p>
                    </div>
                    
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={newPassword.length < 6}
                      className="px-3 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      Reset Password
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 