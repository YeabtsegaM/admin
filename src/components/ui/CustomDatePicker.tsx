'use client';

import React, { useState, useRef, useEffect } from 'react';

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  required?: boolean;
}

export function CustomDatePicker({ 
  value, 
  onChange, 
  placeholder = "Select date", 
  disabled = false, 
  className = '',
  required = false 
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    const formattedDate = today.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const clearDate = () => {
    onChange('');
    setIsOpen(false);
  };

  const isToday = (day: number) => {
    const today = new Date();
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return today.toDateString() === checkDate.toDateString();
  };

  const isSelected = (day: number) => {
    if (!value) return false;
    const selectedDate = new Date(value);
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return selectedDate.toDateString() === checkDate.toDateString();
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className={`relative ${className}`} ref={datePickerRef}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200 ${
          disabled 
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200' 
            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        } ${isOpen && !disabled ? 'border-green-500 ring-2 ring-green-500' : ''}`}
        disabled={disabled}
      >
        <span className="truncate">
          {value ? formatDate(value) : placeholder}
        </span>
        <svg 
          className={`w-4 h-4 ml-2 transition-transform duration-200 ${isOpen && !disabled ? 'rotate-180' : ''} ${disabled ? 'text-gray-400' : 'text-gray-500'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-gray-100 rounded transition-colors duration-150"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <h3 className="text-sm font-semibold text-gray-900">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            
            <button
              type="button"
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-gray-100 rounded transition-colors duration-150"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
              <div key={day} className="text-xs font-medium text-gray-500 text-center py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <button
                key={index}
                type="button"
                onClick={() => day && handleDateSelect(day)}
                disabled={!day}
                className={`text-xs py-2 rounded transition-all duration-150 ${
                  !day 
                    ? 'cursor-default' 
                    : `hover:bg-gray-100 ${
                        isSelected(day)
                          ? 'bg-green-500 text-white font-semibold hover:bg-green-600'
                          : isToday(day)
                          ? 'bg-green-50 text-green-700 font-medium hover:bg-green-100'
                          : 'text-gray-700 hover:text-gray-900'
                      }`
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-between mt-4 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={clearDate}
              className="text-xs text-gray-500 hover:text-gray-700 transition-colors duration-150"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={goToToday}
              className="text-xs text-green-600 hover:text-green-700 font-medium transition-colors duration-150"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
