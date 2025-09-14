'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../utils/api';
import { BalanceData, Shop } from '../../types';
import ReportTabs from './reports/ReportTabs';
import ShopReport from './reports/ShopReport';
import CashierReport from './reports/CashierReport';
import { exportToExcel, ExcelColumn } from '../../utils/excelExport';
import { CustomDropdown } from '../ui/CustomDropdown';
import { CustomDatePicker } from '../ui/CustomDatePicker';

export default function ReportsSection() {
  const [activeTab, setActiveTab] = useState<'shop' | 'cashier'>('shop');
  const [selectedShop, setSelectedShop] = useState<string>('all');
  const [dateRange, setDateRange] = useState('30');
  const [shops, setShops] = useState<Shop[]>([]);
  const [balanceData, setBalanceData] = useState<BalanceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');
  
  // Cashier specific state
  const [cashiers, setCashiers] = useState<any[]>([]);
  const [cashierData, setCashierData] = useState<any[]>([]);
  const [selectedCashier, setSelectedCashier] = useState<string>('all');
  
  // Sorting state
  const [shopSortKey, setShopSortKey] = useState<string>('');
  const [shopSortDirection, setShopSortDirection] = useState<'asc' | 'desc'>('asc');
  const [cashierSortKey, setCashierSortKey] = useState<string>('');
  const [cashierSortDirection, setCashierSortDirection] = useState<'asc' | 'desc'>('asc');

  // Fetch data on component mount and when filters change
  useEffect(() => {
    if (activeTab === 'shop') {
      fetchShopData();
    } else if (activeTab === 'cashier') {
      fetchCashierData();
    }
  }, [activeTab, selectedShop, selectedCashier, dateRange]);

  const fetchShopData = async () => {
    setLoading(true);
    try {
      // Build query parameters for date filtering
      const params: Record<string, string> = {};
      
      // Apply date filtering
      if (dateRange === 'custom' && startDate && endDate) {
        // Custom date range - send simple date strings
        params.startDate = startDate;
        params.endDate = endDate;
      } else if (dateRange === '7') {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);
        params.startDate = startDate.toISOString().slice(0, 10);
        params.endDate = endDate.toISOString().slice(0, 10);
      } else if (dateRange === '30') {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        params.startDate = startDate.toISOString().slice(0, 10);
        params.endDate = endDate.toISOString().slice(0, 10);
      } else if (dateRange === '90') {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 90);
        params.startDate = startDate.toISOString().slice(0, 10);
        params.endDate = endDate.toISOString().slice(0, 10);
      }

      // First get all shops
      const shopsResponse = await apiClient.getShops();
      
      if (shopsResponse.success && shopsResponse.data) {
        const shopsList = shopsResponse.data;
        setShops(shopsList);
        
        // Filter shops based on selectedShop if not 'all'
        const filteredShops = selectedShop === 'all' 
          ? shopsList 
          : shopsList.filter(shop => shop._id === selectedShop);
        
                 // Transform shops data to get real balance data by aggregating cashier data
         const realBalanceData = [];
         
         for (let i = 0; i < filteredShops.length; i++) {
           const shop = filteredShops[i];
          const shopName = shop.shopName || shop.name || 'Unknown Shop';
          
          try {
            // Get cashiers for this specific shop with date filtering
            const cashiersResponse = await apiClient.getCashierDetails(shop._id, params);
            
            if (cashiersResponse.success && cashiersResponse.data) {
              const cashiersData = Array.isArray(cashiersResponse.data) ? cashiersResponse.data : [];
              
              if (cashiersData.length > 0) {
                // Aggregate all cashier data for this shop
                const shopTotalTickets = cashiersData.reduce((sum, cashier: any) => sum + (cashier.tickets || 0), 0);
                const shopTotalBets = cashiersData.reduce((sum, cashier: any) => sum + (cashier.bets || 0), 0);
                const shopTotalUnclaimed = cashiersData.reduce((sum, cashier: any) => sum + (cashier.unclaimed || 0), 0);
                const shopTotalRedeemed = cashiersData.reduce((sum, cashier: any) => sum + (cashier.redeemed || 0), 0);
                const shopNetBalance = shopTotalBets - shopTotalRedeemed;
                
                // Use the actual counts from backend instead of calculating incorrectly
                const unclaimedCount = cashiersData.reduce((sum, cashier: any) => sum + (cashier.unclaimedCount || 0), 0);
                const redeemCount = cashiersData.reduce((sum, cashier: any) => sum + (cashier.redeemCount || 0), 0);
                const ggr = shopNetBalance - shopTotalUnclaimed;
                
                                 realBalanceData.push({
                   shopId: shop._id,
                   shopName: shopName,
                   tickets: shopTotalTickets,
                   bets: shopTotalBets,
                   unclaimed: shopTotalUnclaimed,
                   unclaimedCount: unclaimedCount,
                   redeemed: shopTotalRedeemed,
                   redeemCount: redeemCount,
                   ggr: ggr,
                   netBalance: shopNetBalance,
                   lastUpdated: new Date().toISOString().slice(0, 10),
                   rowIndex: i + 1
                 });
              } else {
                                 // Shop has no cashiers - show zero values
                 realBalanceData.push({
                   shopId: shop._id,
                   shopName: shopName,
                   tickets: 0,
                   bets: 0,
                   unclaimed: 0,
                   unclaimedCount: 0,
                   redeemed: 0,
                   redeemCount: 0,
                   ggr: 0,
                   netBalance: 0,
                   lastUpdated: new Date().toISOString().slice(0, 10),
                   rowIndex: i + 1
                 });
              }
            } else {
                             // Fallback: shop has no cashiers - show zero values
               realBalanceData.push({
                 shopId: shop._id,
                 shopName: shopName,
                 tickets: 0,
                 bets: 0,
                 unclaimed: 0,
                 unclaimedCount: 0,
                 redeemed: 0,
                 redeemCount: 0,
                 ggr: 0,
                 netBalance: 0,
                 lastUpdated: new Date().toISOString().slice(0, 10),
                 rowIndex: i + 1
               });
            }
          } catch (error) {
            console.error(`Error fetching cashier data for shop ${shopName}:`, error);
                         // Add shop with zero values if there's an error
             realBalanceData.push({
               shopId: shop._id,
               shopName: shopName,
               tickets: 0,
               bets: 0,
               unclaimed: 0,
               unclaimedCount: 0,
               redeemed: 0,
               redeemCount: 0,
               ggr: 0,
               netBalance: 0,
               lastUpdated: new Date().toISOString().slice(0, 10),
               rowIndex: i + 1
             });
          }
        }
        
        setBalanceData(realBalanceData);
      } else {
        console.error('Shops API response failed:', shopsResponse);
        setShops([]);
        setBalanceData([]);
      }
    } catch (error) {
      console.error('Error fetching shop data:', error);
      setShops([]);
      setBalanceData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCashierData = async () => {
    setLoading(true);
    try {
      // Build query parameters for cashiers
      const params: Record<string, string> = {};
      if (selectedShop !== 'all') params.shopId = selectedShop;
      if (selectedCashier !== 'all') params.cashierId = selectedCashier;
      
      // Apply date filtering
      if (dateRange === 'custom' && startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      } else if (dateRange === '7') {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);
        params.startDate = startDate.toISOString().slice(0, 10);
        params.endDate = endDate.toISOString().slice(0, 10);
      } else if (dateRange === '30') {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        params.startDate = startDate.toISOString().slice(0, 10);
        params.endDate = endDate.toISOString().slice(0, 10);
      } else if (dateRange === '90') {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 90);
        params.startDate = startDate.toISOString().slice(0, 10);
        params.endDate = endDate.toISOString().slice(0, 10);
      }

      // Fetch cashier data from API - only if a specific shop is selected
      if (selectedShop !== 'all') {
        // Pass date parameters to the cashier details API
        const cashierResponse = await apiClient.getCashierDetails(selectedShop, params);
        
        if (cashierResponse.success && cashierResponse.data) {
          const rawCashierData = Array.isArray(cashierResponse.data) ? cashierResponse.data : [];
          
                     // Transform cashier data to include the new calculated fields
           const transformedCashierData = rawCashierData.map((cashier: any, index: number) => {
             const unclaimedCount = (cashier.unclaimed || 0) > 0 ? 1 : 0;
             const redeemCount = (cashier.redeemed || 0) > 0 ? 1 : 0;
             const ggr = (cashier.bets || 0) - (cashier.redeemed || 0) - (cashier.unclaimed || 0);
             
             return {
               ...cashier,
               unclaimedCount,
               redeemCount,
               ggr,
               rowIndex: index + 1
             };
           });
          
          setCashierData(transformedCashierData);
        } else {
          setCashierData([]);
        }
      } else {
        // If no specific shop selected, set empty data
        setCashierData([]);
      }

      // Also fetch shops for the filter
      const balanceResponse = await apiClient.getBalanceData({});
      if (balanceResponse.success && balanceResponse.data) {
        setShops(balanceResponse.data.shops || []);
        setCashiers(balanceResponse.data.cashiers || []);
      }
    } catch (error) {
      console.error('Error fetching cashier data:', error);
      setCashierData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (activeTab === 'shop') {
      fetchShopData();
    } else if (activeTab === 'cashier') {
      fetchCashierData();
    }
  };

  const applyCustomDateRange = () => {
    if (startDate && endDate) {
      setShowDatePicker(false);
      if (activeTab === 'shop') {
        fetchShopData();
      } else if (activeTab === 'cashier') {
        fetchCashierData();
      }
    }
  };

  // Sorting functions
  const handleShopSort = (key: string, direction: 'asc' | 'desc') => {
    setShopSortKey(key);
    setShopSortDirection(direction);
    
    // Sort the existing data
    const sortedData = [...balanceData].sort((a, b) => {
      let aValue: any = a[key as keyof BalanceData];
      let bValue: any = b[key as keyof BalanceData];
      
      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Handle string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
        if (direction === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
      
      return 0;
    });
    
    setBalanceData(sortedData);
  };

  const handleCashierSort = (key: string, direction: 'asc' | 'desc') => {
    setCashierSortKey(key);
    setCashierSortDirection(direction);
    
    // Sort the existing data
    const sortedData = [...cashierData].sort((a, b) => {
      let aValue: any = a[key];
      let bValue: any = b[key];
      
      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Handle string values
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
        if (direction === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      }
      
      return 0;
    });
    
    setCashierData(sortedData);
  };

  // Global Excel download function
  const handleGlobalDownload = () => {
    // Generate filename with date information
    const getDateString = () => {
      if (dateRange === 'custom' && startDate && endDate) {
        return `${startDate}_to_${endDate}`;
      } else if (dateRange === '7') {
        return 'Last_7_Days';
      } else if (dateRange === '30') {
        return 'Last_30_Days';
      } else if (dateRange === '90') {
        return 'Last_90_Days';
      }
      return 'Last_30_Days';
    };

         if (activeTab === 'shop' && balanceData.length > 0) {
       const excelColumns: ExcelColumn[] = [
         { key: 'rowIndex', label: 'NO.', render: (value) => String(value || '') },
         { key: 'shopName', label: 'SHOP' },
         { key: 'tickets', label: 'TICKETS' },
         { key: 'bets', label: 'BETS' },
         { key: 'unclaimed', label: 'UNCLAIMED' },
         { key: 'unclaimedCount', label: 'UNCLAIMED COUNT' },
         { key: 'redeemed', label: 'REDEEMED' },
         { key: 'redeemCount', label: 'REDEEM COUNT' },
         { key: 'ggr', label: 'GGR' },
         { key: 'netBalance', label: 'NET BALANCE' }
       ];
      
      const filename = `Retail_Report_${getDateString()}`;
      exportToExcel(balanceData, excelColumns, filename);
         } else if (activeTab === 'cashier' && cashierData.length > 0) {
       const excelColumns: ExcelColumn[] = [
         { key: 'rowIndex', label: 'NO.', render: (value) => String(value || '') },
         { key: 'shopName', label: 'SHOP' },
         { key: 'cashierName', label: 'CASHIER NAME' },
         { key: 'tickets', label: 'TICKETS' },
         { key: 'bets', label: 'BETS' },
         { key: 'unclaimed', label: 'UNCLAIMED' },
         { key: 'unclaimedCount', label: 'UNCLAIMED COUNT' },
         { key: 'redeemed', label: 'REDEEMED' },
         { key: 'redeemCount', label: 'REDEEM COUNT' },
         { key: 'ggr', label: 'GGR' },
         { key: 'netBalance', label: 'NET BALANCE' }
       ];
      
      const filename = `Cashier_Report_${getDateString()}`;
      exportToExcel(cashierData, excelColumns, filename);
    }
  };

  return (
    <div className="transition-colors duration-300 bg-gray-100 min-h-full p-6">
      {/* Header with Filters */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        </div>
        
        {/* Filters - Show on both tabs for consistency */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 w-full sm:w-auto">
          {/* Shop Filter */}
          <div className="w-full sm:w-40">
            <label className="block text-xs font-medium text-gray-700 mb-1">Shop</label>
            <CustomDropdown
              options={[
                { value: 'all', label: 'All Shops' },
                ...shops.map(shop => ({
                  value: shop._id,
                  label: shop.shopName
                }))
              ]}
              value={selectedShop}
              onChange={setSelectedShop}
              placeholder="All Shops"
            />
          </div>

          {/* Date Range Filter */}
          <div className="w-full sm:w-36 relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">Date Range</label>
            <CustomDropdown
              options={[
                { value: '7', label: 'Last 7 Days' },
                { value: '30', label: 'Last 30 Days' },
                { value: '90', label: 'Last 90 Days' },
                { value: 'custom', label: 'Custom Range' }
              ]}
              value={dateRange}
              onChange={(value) => {
                setDateRange(value);
                if (value !== 'custom') {
                  setShowDatePicker(false);
                  setStartDate('');
                  setEndDate('');
                } else {
                  setShowDatePicker(true);
                  // Set default dates (last 7 days)
                  const end = new Date();
                  const start = new Date();
                  start.setDate(start.getDate() - 7);
                  setEndDate(end.toISOString().split('T')[0]);
                  setStartDate(start.toISOString().split('T')[0]);
                }
              }}
              placeholder="Select range"
            />
            
            {/* Custom Date Picker */}
            {showDatePicker && (
              <div className="absolute mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4 w-80 right-0 top-full">
                <div className="grid grid-cols-2 gap-4">
                  {/* Start Date & Time */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                    <CustomDatePicker
                      value={startDate}
                      onChange={setStartDate}
                      placeholder="Select start date"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white hover:border-gray-400 transition-all duration-200"
                    />
                  </div>
                  
                  {/* End Date & Time */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                    <CustomDatePicker
                      value={endDate}
                      onChange={setEndDate}
                      placeholder="Select end date"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 bg-white hover:border-gray-400 transition-all duration-200"
                    />
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={applyCustomDateRange}
                    disabled={!startDate || !endDate}
                    className="flex-1 px-3 py-1 text-xs bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="flex-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

                     

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <ReportTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Content Area */}
      {activeTab === 'shop' && (
          <ShopReport 
            balanceData={balanceData} 
            loading={loading}
            sortable={true}
            sortKey={shopSortKey}
            sortDirection={shopSortDirection}
            onSort={handleShopSort}
            dateRange={dateRange}
            startDate={startDate}
            endDate={endDate}
          />
      )}

      {activeTab === 'cashier' && (
        <CashierReport 
          cashierData={cashierData} 
          loading={loading} 
          selectedShop={selectedShop} 
            sortable={true}
            sortKey={cashierSortKey}
            sortDirection={cashierSortDirection}
            onSort={handleCashierSort}
            dateRange={dateRange}
            startDate={startDate}
            endDate={endDate}
        />
      )}
    </div>
  );
}
