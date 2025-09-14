'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/utils/api';
import Toast from '../ui/Toast';
import { CustomDropdown } from '../ui/CustomDropdown';
import { CustomDatePicker } from '../ui/CustomDatePicker';

interface Shop {
  _id: string;
  shopName: string;
}

interface Cashier {
  _id: string;
  username: string;
  fullName?: string;
}

interface GameResult {
  eventId: string;
  shopId: string;
  shopName: string;
  calledNumbers: number[];
  drawTime: string;
  gameType: string;
}

interface GameResultSectionProps {
  onDataChange?: () => void;
}

export default function GameResultSection({ onDataChange }: GameResultSectionProps) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>('');
  const [selectedCashier, setSelectedCashier] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [eventId, setEventId] = useState<string>('');
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string; isVisible: boolean } | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch shops and cashiers on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopsResponse, cashiersResponse] = await Promise.all([
          apiClient.getShops(),
          apiClient.getCashiers()
        ]);
        setShops(shopsResponse.data || []);
        setCashiers(cashiersResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setToast({ type: 'error', message: 'Failed to load data', isVisible: true });
      }
    };

    fetchData();
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh && selectedShop && selectedDate && eventId) {
      const interval = setInterval(() => {
        handleSearch();
      }, 10000); // Refresh every 10 seconds
      setRefreshInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh, selectedShop, selectedCashier, selectedDate, eventId]);

  const handleSearch = useCallback(async () => {
    if (!selectedShop || !selectedDate || !eventId) {
      setToast({ type: 'error', message: 'Please select shop, date, and enter event ID', isVisible: true });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.getGameResults({
        shopId: selectedShop,
        cashierId: selectedCashier || undefined, // Include cashier if selected
        date: selectedDate,
        eventId: eventId
      });
      
      setGameResults(response.data || []);
      setHasSearched(true);
      if (!autoRefresh) {
        setToast({ type: 'success', message: 'Game results loaded successfully', isVisible: true });
      }
    } catch (error) {
      console.error('Error fetching game results:', error);
      if (!autoRefresh) {
        setToast({ type: 'error', message: 'Failed to load game results', isVisible: true });
      }
    } finally {
      setLoading(false);
    }
  }, [selectedShop, selectedCashier, selectedDate, eventId, autoRefresh]);

  const handleAutoRefreshToggle = () => {
    setAutoRefresh(!autoRefresh);
    if (!autoRefresh) {
      setToast({ type: 'success', message: 'Auto-refresh enabled (every 10 seconds)', isVisible: true });
    } else {
      setToast({ type: 'success', message: 'Auto-refresh disabled', isVisible: true });
    }
  };

  const handleEventIdChange = (value: string) => {
    // Allow only numbers and basic validation
    const cleanValue = value.replace(/[^0-9]/g, '');
    setEventId(cleanValue);
  };

  return (
    <div className="transition-colors duration-300 bg-gray-100 min-h-full p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Game Result</h1>
      </div>

      {/* Search Form */}
      <div className="bg-gray-100 rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Shop Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Shop
            </label>
            <CustomDropdown
              options={[
                { value: '', label: 'Select Shop' },
                ...shops.map(shop => ({
                  value: shop._id,
                  label: shop.shopName
                }))
              ]}
              value={selectedShop}
              onChange={setSelectedShop}
              placeholder="Select Shop"
            />
          </div>

          {/* Cashier Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Cashier
            </label>
            <CustomDropdown
              options={[
                { value: '', label: 'All Cashiers' },
                ...cashiers.map(cashier => ({
                  value: cashier._id,
                  label: cashier.fullName || cashier.username
                }))
              ]}
              value={selectedCashier}
              onChange={setSelectedCashier}
              placeholder="All Cashiers"
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <CustomDatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              placeholder="Select date"
            />
          </div>

          {/* Event ID */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Event ID
            </label>
            <input
              type="text"
              value={eventId}
              onChange={(e) => handleEventIdChange(e.target.value)}
              placeholder="e.g., 4000"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={!selectedShop || !eventId.trim() || loading}
              className={`w-full inline-flex items-center justify-center px-6 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 ${
                selectedShop && eventId.trim() && !loading
                  ? 'text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                  : 'text-white bg-green-300 cursor-not-allowed hover:bg-green-150'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        {/* Auto-refresh toggle */}
        {gameResults.length > 0 && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAutoRefreshToggle}
                className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                  autoRefresh
                    ? 'bg-green-100 text-green-700 border border-green-300'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                <svg className={`w-3 h-3 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </button>
              {autoRefresh && (
                <span className="text-xs text-gray-500">Refreshing every 10s</span>
              )}
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {gameResults.length > 0 && (
        <div className="space-y-6">
          {gameResults.map((result, index) => (
            <div key={index} className="bg-gray-100 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-green-50 border-b border-green-200 text-green-600 px-6 py-4">
                <h3 className="text-lg font-semibold">
                  Event Id {result.eventId} | {result.gameType}
                </h3>
                <p className="text-green-600 text-sm mt-1">
                  {result.shopName} • {new Date(result.drawTime).toLocaleString()}
                </p>
              </div>

              {/* Drawn Numbers Area */}
              <div className="bg-green-50 p-6">
                <div className="flex flex-wrap gap-3">
                  {result.calledNumbers.map((number, numIndex) => (
                    <div
                      key={numIndex}
                      className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm shadow-md"
                    >
                      {number}
                    </div>
                  ))}
                </div>
                
                {/* Total count */}
                <div className="mt-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    Total: {result.calledNumbers.length} numbers drawn
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {gameResults.length === 0 && !loading && hasSearched && (
        <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Game Results Found</h3>
        </div>
      )}

      {/* Initial State - Before Search */}
      {!hasSearched && !loading && (
        <div className="">
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
          isVisible={toast.isVisible}
        />
      )}
    </div>
  );
} 