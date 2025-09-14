'use client';

import { useState, useEffect } from 'react';
import { DataTable, Column } from '../ui/DataTable';
import { FormModal } from '../ui/FormModal';
import { DeleteModal } from '../ui/DeleteModal';
import ActionButtons from '../ui/ActionButtons';
import { apiClient } from '@/utils/api';
import Toast from '../ui/Toast';
import { useDataTable } from '@/hooks/useDataTable';
import { useAdminSocket } from '@/hooks/useAdminSocket';

interface Cashier {
  _id: string;
  fullName: string;
  username: string;
  isActive: boolean;
  shop: {
    _id: string;
    shopName: string;
  };
  createdAt: string;
  sessionId?: string;
  displayUrl?: string;
  isConnected?: boolean;
  lastActivity?: string;
}

interface Shop {
  _id: string;
  shopName: string;
}

interface CreateCashierFormData {
  shopId: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  rePassword: string;
}

interface EditCashierFormData {
  shopId: string;
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
}

interface CashiersSectionProps {
  onDataChange?: () => void;
}

export default function CashiersSection({ onDataChange }: CashiersSectionProps) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingCashier, setEditingCashier] = useState<Cashier | null>(null);
  const [deletingCashier, setDeletingCashier] = useState<Cashier | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string; isVisible: boolean } | null>(null);
  const [selectedShopFilter, setSelectedShopFilter] = useState<string>('all'); // NEW: Shop filter state

  // Admin socket for real-time connection updates
  const { isConnected: socketConnected } = useAdminSocket((cashierId: string, isConnected: boolean) => {
    // Update cashier connection status in real-time
    const currentCashier = cashiers.find(c => c._id === cashierId);
    if (currentCashier) {
      updateCashier(cashierId, { ...currentCashier, isConnected });
    }
  });

  // Use the data table hook with username as the only search field
  const {
    data: cashiers,
    filteredData: filteredCashiers,
    loading,
    searchTerm,
    setSearchTerm,
    fetchData: fetchCashiers,
    updateData: updateCashiers,
    addItem: addCashier,
    updateItem: updateCashier,
    deleteItem: deleteCashier,
    toast: dataTableToast,
    showToast: showDataTableToast,
    closeToast: closeDataTableToast,
    searchPlaceholder
  } = useDataTable<Cashier>({
    fetchData: async () => {
      const response = await apiClient.getCashiers();
      return response.data || [];
    },
    searchFields: ['username'],
    searchPlaceholder: "Search by username..."
  });

  // NEW: Filter cashiers by selected shop
  const getFilteredCashiers = () => {
    if (selectedShopFilter === 'all') {
      return filteredCashiers;
    }
    return filteredCashiers.filter(cashier => cashier.shop._id === selectedShopFilter);
  };

  // NEW: Handle shop filter change
  const handleShopFilterChange = (shopId: string) => {
    setSelectedShopFilter(shopId);
  };

  // Fetch cashiers data when component mounts
  useEffect(() => {
    fetchCashiers();
  }, [fetchCashiers]);

  // Fetch shops
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await apiClient.getShops();
        setShops(response.data || []);
      } catch (error) {
        console.error('Error fetching shops:', error);
        setToast({ type: 'error', message: 'Failed to load shops data', isVisible: true });
      }
    };

    fetchShops();
  }, []);

  const handleAddClick = () => {
    setEditingCashier(null);
    setIsModalOpen(true);
  };

  const handleEdit = (cashier: Cashier) => {
    setEditingCashier(cashier);
    setIsModalOpen(true);
  };

  const handleDelete = (cashier: Cashier) => {
    setDeletingCashier(cashier);
    setIsDeleteModalOpen(true);
  };

  const handleModalSubmit = async (formData: Partial<CreateCashierFormData | EditCashierFormData>) => {
    console.log('Form submitted with data:', formData);
    
    // Prepare API data
    const apiData = {
      shopId: formData.shopId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      password: formData.password
    };
    
    console.log('API data:', apiData);
    
    try {
      if (editingCashier) {
        // Update existing cashier
        console.log('Updating cashier:', editingCashier._id, 'with data:', apiData);
        const response = await apiClient.updateCashier(editingCashier._id, apiData);
        console.log('Update response:', response);
        updateCashier(editingCashier._id, response.data);
        setToast({ type: 'success', message: 'Cashier updated successfully', isVisible: true });
        // Immediate refresh for real-time update
        setTimeout(() => fetchCashiers(), 100);
      } else {
        // Create new cashier
        console.log('Creating new cashier with data:', apiData);
        const response = await apiClient.createCashier(apiData);
        console.log('Create response:', response);
        addCashier(response.data);
        setToast({ type: 'success', message: 'Cashier created successfully', isVisible: true });
        // Immediate refresh for real-time update
        setTimeout(() => fetchCashiers(), 100);
      }
      setIsModalOpen(false);
      setEditingCashier(null);
      onDataChange?.(); // Trigger parent refresh
    } catch (error: unknown) {
      console.error('Error saving cashier:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setToast({ type: 'error', message: `Failed to save cashier: ${errorMessage}`, isVisible: true });
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingCashier) {
      try {
        await apiClient.deleteCashier(deletingCashier._id);
        deleteCashier(deletingCashier._id);
        setToast({ type: 'success', message: 'Cashier deleted successfully', isVisible: true });
        // Immediate refresh for real-time update
        setTimeout(() => fetchCashiers(), 100);
        setIsDeleteModalOpen(false);
        setDeletingCashier(null);
        onDataChange?.(); // Trigger parent refresh
      } catch (error) {
        console.error('Error deleting cashier:', error);
        setToast({ type: 'error', message: 'Failed to delete cashier', isVisible: true });
      }
    }
  };

  const handleToggleStatus = async (cashier: Cashier) => {
    try {
      const response = await apiClient.toggleCashierStatus(cashier._id);
      updateCashier(cashier._id, response.data);
      setToast({ type: 'success', message: `Cashier ${cashier.isActive ? 'deactivated' : 'activated'} successfully`, isVisible: true });
      // Immediate refresh for real-time update
      setTimeout(() => fetchCashiers(), 100);
      onDataChange?.(); // Trigger parent refresh
    } catch (error) {
      console.error('Error toggling cashier status:', error);
      setToast({ type: 'error', message: 'Failed to update cashier status', isVisible: true });
    }
  };

  const handleCopyUsername = (username: string) => {
    navigator.clipboard.writeText(username);
    setToast({ type: 'success', message: 'Username copied to clipboard', isVisible: true });
  };

  const handleCopyBatFile = async (cashier: Cashier) => {
    try {
      if (!cashier.sessionId) {
        setToast({ type: 'error', message: 'Cashier does not have a session ID. Please regenerate session.', isVisible: true });
        return;
      }

      const batContent = await apiClient.getCashierBatFileContent(cashier._id);
      
      // Copy only the BAT command to clipboard
      const clipboardText = batContent.displayBatContent;
      
      // Copy BAT file content to clipboard
      await navigator.clipboard.writeText(clipboardText);
      
      setToast({ type: 'success', message: 'BAT command copied to clipboard!', isVisible: true });
    } catch (error) {
      console.error('Error copying BAT file:', error);
      setToast({ type: 'error', message: 'Failed to copy BAT file commands', isVisible: true });
    }
  };

  const handleRegenerateSession = async (cashier: Cashier) => {
    try {
      const response = await apiClient.regenerateCashierSession(cashier._id);
      
      // Update the cashier data in the table
      const updatedCashier = {
        ...cashier,
        sessionId: response.data.sessionId,
        displayUrl: response.data.displayUrl,
        isConnected: false,
        lastActivity: new Date().toISOString()
      };
      
      updateCashier(cashier._id, updatedCashier);
      setToast({ type: 'success', message: 'Session ID regenerated successfully!', isVisible: true });
    } catch (error) {
      console.error('Error regenerating session:', error);
      setToast({ type: 'error', message: 'Failed to regenerate session ID', isVisible: true });
    }
  };

  const columns = [
    {
      key: 'index',
      header: 'NO.',
              render: (_: unknown, index: number) => <span className="text-sm text-gray-500">{index + 1}</span>
    },
    {
      key: 'fullName',
      header: 'FULL NAME',
      render: (cashier: Cashier) => (
        <div className="flex items-center">
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-green-600">
              {cashier.fullName.charAt(0)}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{cashier.fullName}</div>
            <div className="text-xs text-gray-500">Created {new Date(cashier.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      )
    },
    {
      key: 'username',
      header: 'USERNAME',
      render: (cashier: Cashier) => (
        <div className="flex items-center">
          <span className="text-sm text-gray-900">{cashier.username}</span>
        </div>
      )
    },
    {
      key: 'shop',
      header: 'SHOP',
      render: (cashier: Cashier) => (
        <div className="flex items-center">
          <span className="text-sm text-gray-900">{cashier.shop.shopName}</span>
        </div>
      )
    },
    {
      key: 'session',
      header: 'SESSION',
      render: (cashier: Cashier) => (
        <div className="flex flex-col space-y-1">
          {cashier.sessionId ? (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              cashier.isConnected 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-green-100 text-green-800 border border-green-200'
            }`}>
              {cashier.isConnected ? 'Connected' : 'Yes Session'}
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
              No Session
            </span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (cashier: Cashier) => (
        <div className="flex flex-col space-y-1">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            cashier.isActive 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {cashier.isActive ? 'Active' : 'Inactive'}
          </span>
          
        </div>
      )
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      render: (cashier: Cashier) => (
        <div className="flex items-center space-x-2">
          <ActionButtons
            buttons={[
              {
                label: 'Edit',
                onClick: () => handleEdit(cashier),
                variant: 'primary'
              },
              {
                label: cashier.isActive ? 'Deactivate' : 'Activate',
                onClick: () => handleToggleStatus(cashier),
                variant: cashier.isActive ? 'warning' : 'primary'
              },
              {
                label: 'Regenerate Session',
                onClick: () => handleRegenerateSession(cashier),
                variant: 'secondary'
              },
              {
                label: 'Delete',
                onClick: () => handleDelete(cashier),
                variant: 'danger'
              }
            ]}
          />

          <button
            onClick={() => handleCopyBatFile(cashier)}
            className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
            title="Copy BAT File"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      )
    }
  ];

  const getModalFields = () => {
    const fields = [
      {
        key: 'shopId',
        label: 'Shop',
        type: 'select' as const,
        required: true,
        placeholder: 'Select shop',
        options: shops.map(shop => ({
          value: shop._id,
          label: shop.shopName
        }))
      },
      {
        key: 'firstName',
        label: 'First Name',
        type: 'text' as const,
        required: true
      },
      {
        key: 'lastName',
        label: 'Last Name',
        type: 'text' as const,
        required: true
      },
      {
        key: 'username',
        label: 'Username',
        type: 'text' as const,
        required: true
      },
      {
        key: 'password',
        label: 'Password',
        type: 'password' as const,
        required: !editingCashier
      },
      {
        key: 'rePassword',
        label: 'Re-Password',
        type: 'password' as const,
        required: !editingCashier,
        validation: (value: string, formData?: Record<string, any>) => {
          if (!editingCashier && formData && value !== formData.password) {
            return 'Passwords do not match';
          }
          return undefined;
        }
      }
    ];

    return fields;
  };

  const getInitialData = () => {
    if (editingCashier) {
      return {
        shopId: editingCashier.shop._id,
        firstName: editingCashier.fullName.split(' ')[0] || '',
        lastName: editingCashier.fullName.split(' ').slice(1).join(' ') || '',
        username: editingCashier.username
      };
    }
    return {
      shopId: '',
      firstName: '',
      lastName: '',
      username: '',
      password: '',
      rePassword: ''
    };
  };

  return (
    <div className="transition-colors duration-300 bg-gray-100 min-h-full">
      <DataTable
        data={getFilteredCashiers()}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={handleAddClick}
        addButtonText="Create New Cashier"
        title="Cashiers"
        loading={loading}
        searchPlaceholder={searchPlaceholder}
        emptyStateMessage="No cashiers found"
        noDataMessage="No cashiers yet"
        shopFilter={{
          selectedShop: selectedShopFilter,
          onShopFilterChange: handleShopFilterChange,
          shops: shops
        }}
      />

      {/* Create/Edit Cashier Modal */}
      {isModalOpen && (
        <FormModal<CreateCashierFormData | EditCashierFormData>
          mode={editingCashier ? 'edit' : 'add'}
          title={editingCashier ? 'Edit Cashier' : 'Create New Cashier'}
          fields={getModalFields()}
          initialData={getInitialData() as Partial<CreateCashierFormData | EditCashierFormData>}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCashier(null);
          }}
          onSubmit={handleModalSubmit}
          submitButtonText={editingCashier ? 'Update Cashier' : 'Create Cashier'}
        />
      )}

      {/* Delete Cashier Modal */}
      {deletingCashier && (
        <DeleteModal
          item={deletingCashier}
          title="Delete Cashier"
          message={`Are you sure you want to delete "${deletingCashier.fullName}"? This action cannot be undone.`}
          itemName={(cashier) => cashier.fullName}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingCashier(null);
          }}
          onConfirm={handleDeleteConfirm}
          confirmButtonText="Delete Cashier"
        />
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
