'use client';

interface ActionButton {
  label: string;
  onClick: () => void;
  variant: 'primary' | 'secondary' | 'danger' | 'warning';
  disabled?: boolean;
}

interface ActionButtonsProps {
  buttons: ActionButton[];
  className?: string;
}

export default function ActionButtons({ buttons, className = '' }: ActionButtonsProps) {
  const getButtonStyles = (variant: string, disabled: boolean = false) => {
    const baseStyles = 'p-2 rounded-lg transition-all duration-200 hover:scale-105';
    
    if (disabled) {
      return `${baseStyles} text-gray-400 cursor-not-allowed hover:scale-100`;
    }
    
    switch (variant) {
      case 'primary':
        return `${baseStyles} text-green-600 hover:text-green-800 hover:bg-green-50`;
      case 'secondary':
        return `${baseStyles} text-blue-600 hover:text-blue-800 hover:bg-blue-50`;
      case 'danger':
        return `${baseStyles} text-red-600 hover:text-red-800 hover:bg-red-50`;
      case 'warning':
        return `${baseStyles} text-orange-600 hover:text-orange-800 hover:bg-orange-50`;
      default:
        return `${baseStyles} text-gray-600 hover:text-gray-800 hover:bg-gray-50`;
    }
  };

  const getIcon = (label: string) => {
    switch (label.toLowerCase()) {
      case 'edit':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      case 'activate':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'deactivate':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'delete':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        );
      case 'regenerate session':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'copy':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        );
    }
  };

  return (
    <div className={`flex space-x-1 ${className}`}>
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          disabled={button.disabled}
          className={getButtonStyles(button.variant, button.disabled)}
          title={button.label}
        >
          {getIcon(button.label)}
        </button>
      ))}
    </div>
  );
} 