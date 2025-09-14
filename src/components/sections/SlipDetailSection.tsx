'use client';

import React, { useState, useEffect, useCallback } from 'react';
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

interface SlipDetail {
  ticketNumber: string;
  betId: string;
  gameId: string | number;
  cashierId: string;
  cashierName: string;
  shopId: string;
  shopName: string;
  cartelaId: number;
  stake: number;
  betType: 'single' | 'multiple' | 'combination';
  betStatus: 'pending' | 'active' | 'won' | 'lost' | 'cancelled' | 'won_redeemed' | 'lost_redeemed';
  gameProgress: number;
  selectedNumbers: number[];
  winPattern?: string;
  win: number; // Win amount (0 initially, updated to prize amount when redeemed)
  notes?: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  placedAt: Date;
  settledAt?: Date;
  // Add cartela and game data
  cartelaPattern: number[][];
  calledNumbers: number[];
  gameStatus: string;
}

interface SlipDetailSectionProps {
  onDataChange?: () => void;
}

export default function SlipDetailSection({ onDataChange }: SlipDetailSectionProps) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [selectedShop, setSelectedShop] = useState<string>('');
  const [selectedCashier, setSelectedCashier] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [ticketNumber, setTicketNumber] = useState<string>('');
  const [gameId, setGameId] = useState<string>('');
  const [slipDetails, setSlipDetails] = useState<SlipDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string; isVisible: boolean } | null>(null);
  const [selectedSlip, setSelectedSlip] = useState<SlipDetail | null>(null);
  const [showCartelaModal, setShowCartelaModal] = useState(false);
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

  const handleSearch = useCallback(async () => {
    if (!selectedShop) {
      setToast({ type: 'error', message: 'Please select a shop', isVisible: true });
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.getSlipDetails({
        shopId: selectedShop,
        cashierId: selectedCashier || undefined,
        date: selectedDate,
        ticketNumber: ticketNumber || undefined,
        gameId: gameId || undefined
      });
      
      setSlipDetails(response.data || []);
      setToast({ type: 'success', message: 'Slip details loaded successfully', isVisible: true });
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching slip details:', error);
      setToast({ type: 'error', message: 'Failed to load slip details', isVisible: true });
    } finally {
      setLoading(false);
    }
  }, [selectedShop, selectedCashier, selectedDate, ticketNumber, gameId]);

  const handleTicketNumberChange = (value: string) => {
    // Allow only numbers and limit to 13 digits
    const cleanValue = value.replace(/[^0-9]/g, '').slice(0, 13);
    setTicketNumber(cleanValue);
  };

  const handleGameIdChange = (value: string) => {
    // Allow only numbers and basic validation
    const cleanValue = value.replace(/[^0-9]/g, '');
    setGameId(cleanValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
      case 'won_redeemed':
        return 'bg-green-100 text-green-800';
      case 'lost':
      case 'lost_redeemed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'active':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined || amount === null) {
      return 'Br. 0.00';
    }
    return `Br. ${amount.toFixed(2)}`;
  };

  // Function to get user-friendly status display
  const getDisplayStatus = (status: string) => {
    switch (status) {
      case 'won_redeemed':
        return 'Won';
      case 'lost_redeemed':
        return 'Lost';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="transition-colors duration-300 bg-gray-100 min-h-full p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Slip Detail</h1>
      </div>

      {/* Search Form */}
      <div className="bg-gray-100 rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Shop Selection */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Shop *
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

          {/* Ticket Number */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Ticket Number
            </label>
            <input
              type="text"
              value={ticketNumber}
              onChange={(e) => handleTicketNumberChange(e.target.value)}
                             placeholder="e.g., 0000000000001"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Game ID */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Game ID
            </label>
            <input
              type="text"
              value={gameId}
              onChange={(e) => handleGameIdChange(e.target.value)}
              placeholder="e.g., 4000"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-green-500 focus:border-green-500 focus:outline-none text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={loading || !selectedShop}
              className="w-full inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-md hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
      </div>

      {/* Results */}
      {slipDetails.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket No.
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cashier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {slipDetails.map((slip, index) => (
                   <React.Fragment key={index}>
                     {/* Main Row */}
                     <tr className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                      {slip.ticketNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {slip.cashierName || slip.cashierId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {slip.shopName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(slip.betStatus)}`}>
                            {getDisplayStatus(slip.betStatus)}
                      </span>
                    </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                         <button
                           onClick={() => setSelectedSlip(selectedSlip === slip ? null : slip)}
                           className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors duration-150"
                         >
                           {selectedSlip === slip ? 'Hide' : 'Detail'}
                         </button>
                     </td>
                     </tr>
                     
                     {/* Expanded Slip Details Row */}
                     {selectedSlip === slip && (
                      <tr className="bg-green-50 border-t border-green-200">
                        <td colSpan={5} className="px-6 py-4">
                           <div className="bg-white rounded-lg border border-green-300 p-4">
                            <div className="grid grid-cols-8 gap-2 sm:gap-3 text-sm">
                               <div className="text-center min-w-[40px]">
                                 <div className="font-mono text-gray-500 mb-1 text-xs">NO.</div>
                                 <div className="text-gray-900 font-medium">{index + 1}</div>
                               </div>
                               <div className="text-center min-w-[60px]">
                                 <div className="font-mono text-gray-500 mb-1 text-xs">GAME</div>
                                 <div className="text-gray-900 font-medium">BINGO</div>
                               </div>
                               <div className="text-center min-w-[60px]">
                                 <div className="font-mono text-gray-500 mb-1 text-xs">MARKET</div>
                                 <div className="text-gray-900 font-medium">Win</div>
                               </div>
                               <div className="text-center min-w-[60px]">
                                 <div className="font-mono text-gray-500 mb-1 text-xs">CARTELA</div>
                                 <div className="text-gray-900 font-medium">{slip.cartelaId}</div>
                               </div>
                               <div className="text-center min-w-[70px]">
                                 <div className="font-mono text-gray-500 mb-1 text-xs">GAME ID</div>
                                 <div className="text-gray-900 font-medium">{slip.gameId}</div>
                               </div>
                                <div className="text-center min-w-[80px]">
                                  <div className="font-mono text-gray-500 mb-1 text-xs">STACK</div>
                                  <div className="text-gray-900 font-medium">{formatCurrency(slip.stake)}</div>
                                </div>
                                <div className="text-center min-w-[80px]">
                                  <div className="font-mono text-gray-500 mb-1 text-xs">WIN</div>
                                  <div className="text-gray-900 font-medium">{formatCurrency(slip.win ?? 0)}</div>
                                </div>
                                <div className="text-center min-w-[90px]">
                                  <div className="font-mono text-gray-500 mb-1 text-xs">PLACED</div>
                                  <div className="text-gray-900 font-medium">{new Date(slip.placedAt).toLocaleDateString()}</div>
                                </div>
                              </div>
                              

                            </div>
                         </td>
                  </tr>
                     )}
                   </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Summary */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Total Slips: <span className="font-semibold">{slipDetails.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Initial State - Before Search */}
      {!hasSearched && !loading && (
        <div className="">
        </div>
      )}

      {/* No Results - After Search */}
      {slipDetails.length === 0 && !loading && hasSearched && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Slip Details Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
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
