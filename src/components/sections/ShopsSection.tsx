import { useState, useEffect } from 'react';
import { DataTable, Column } from '../ui/DataTable';
import { FormModal } from '../ui/FormModal';
import { DeleteModal } from '../ui/DeleteModal';
import ActionButtons from '../ui/ActionButtons';
import { apiClient } from '@/utils/api';
import Toast from '../ui/Toast';
import { useDataTable } from '@/hooks/useDataTable';

interface Shop {
  _id: string;
  shopName: string;
  margin: number;
  location: string;
  owner: {
    _id: string;
    fullName: string;
    username: string;
  } | null;
  systemRevenuePercentage: number;
  status: 'active' | 'inactive';
  maxWinning?: number;
  createdAt: string;
}

interface ShopOwner {
  _id: string;
  fullName?: string;
  username: string;
}

interface CreateShopFormData {
  ownerId: string;
  shopName: string;
  location: string;
  margin: string;
}

interface EditShopFormData {
  shopName: string;
  location: string;
  ownerId: string;
  margin: string;
}

interface ShopsSectionProps {
  onDataChange?: () => void;
}

export default function ShopsSection({ onDataChange }: ShopsSectionProps) {
  const [shopOwners, setShopOwners] = useState<ShopOwner[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [deletingShop, setDeletingShop] = useState<Shop | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string; isVisible: boolean } | null>(null);

  // Use the data table hook with shopName as the only search field
  const {
    data: shops,
    filteredData: filteredShops,
    loading,
    searchTerm,
    setSearchTerm,
    fetchData: fetchShops,
    updateData: updateShops,
    addItem: addShop,
    updateItem: updateShop,
    deleteItem: deleteShop,
    toast: dataTableToast,
    showToast: showDataTableToast,
    closeToast: closeDataTableToast,
    searchPlaceholder
  } = useDataTable<Shop>({
    fetchData: async () => {
      const response = await apiClient.getShops();
      return response.data || [];
    },
    searchFields: ['shopName'],
    searchPlaceholder: "Search by shop name..."
  });

  // Fetch shops data when component mounts
  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  // Fetch shop owners
  useEffect(() => {
    const fetchShopOwners = async () => {
      try {
        const response = await apiClient.getShopOwners();
        setShopOwners(response.data || []);
      } catch (error) {
        console.error('Error fetching shop owners:', error);
        setToast({ type: 'error', message: 'Failed to load shop owners data', isVisible: true });
      }
    };

    fetchShopOwners();
  }, []);

  const handleAddClick = () => {
    setEditingShop(null);
    setIsModalOpen(true);
  };

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop);
    setIsModalOpen(true);
  };

  const handleDelete = (shop: Shop) => {
    setDeletingShop(shop);
    setIsDeleteModalOpen(true);
  };

  const handleModalSubmit = async (formData: any) => {
    console.log('Form submitted with data:', formData);
    
    // Convert numeric fields to numbers and set billing type to prepaid
    const processedData = {
      ...formData,
      margin: Number(formData.margin)
    };
    
    console.log('Processed data:', processedData);
    
    try {
      if (editingShop) {
        // Update existing shop
        const response = await apiClient.updateShop(editingShop._id, processedData);
        console.log('Update response:', response);
        console.log('Response data:', response.data);
        
        if (response.success && response.data) {
          updateShop(editingShop._id, response.data);
          setToast({ type: 'success', message: 'Shop updated successfully', isVisible: true });
          // Immediate refresh for real-time update
          setTimeout(() => fetchShops(), 100);
        } else {
          console.error('Update failed:', response);
          setToast({ type: 'error', message: 'Failed to update shop', isVisible: true });
        }
      } else {
        // Create new shop
        const response = await apiClient.createShop(processedData);
        console.log('Create response:', response);
        console.log('Response data:', response.data);
        
        if (response.success && response.data) {
          addShop(response.data);
          setToast({ type: 'success', message: 'Shop created successfully', isVisible: true });
          // Immediate refresh for real-time update
          setTimeout(() => fetchShops(), 100);
        } else {
          console.error('Create failed:', response);
          setToast({ type: 'error', message: 'Failed to create shop', isVisible: true });
        }
      }
      setIsModalOpen(false);
      setEditingShop(null);
      onDataChange?.(); // Trigger parent refresh
    } catch (error: any) {
      console.error('Error saving shop:', error);
      setToast({ type: 'error', message: `Failed to save shop: ${error.message}`, isVisible: true });
    }
  };

  const handleDeleteConfirm = async () => {
    if (deletingShop) {
      try {
        console.log('Deleting shop:', deletingShop._id);
        const response = await apiClient.deleteShop(deletingShop._id);
        console.log('Delete response:', response);
        
        if (response.success) {
          deleteShop(deletingShop._id);
          setToast({ type: 'success', message: 'Shop deleted successfully', isVisible: true });
          // Immediate refresh for real-time update
          setTimeout(() => fetchShops(), 100);
        } else {
          console.error('Delete failed:', response);
          setToast({ type: 'error', message: 'Failed to delete shop', isVisible: true });
        }
        setIsDeleteModalOpen(false);
        setDeletingShop(null);
        onDataChange?.(); // Trigger parent refresh
      } catch (error) {
        console.error('Error deleting shop:', error);
        setToast({ type: 'error', message: 'Failed to delete shop', isVisible: true });
      }
    }
  };

  const handleToggleStatus = async (shop: Shop) => {
    try {
      const newStatus = shop.status === 'active' ? 'inactive' : 'active';
      console.log('Toggling shop status:', shop._id, 'to', newStatus);
      
      const response = await apiClient.updateShopStatus(shop._id, newStatus);
      console.log('Toggle response:', response);
      console.log('Response data:', response.data);
      
      if (response.success && response.data) {
        updateShop(shop._id, response.data);
        setToast({ type: 'success', message: `Shop ${newStatus} successfully`, isVisible: true });
        // Immediate refresh for real-time update
        setTimeout(() => fetchShops(), 100);
      } else {
        console.error('Toggle failed:', response);
        setToast({ type: 'error', message: 'Failed to update shop status', isVisible: true });
      }
      onDataChange?.();
    } catch (error: any) {
      console.error('Error toggling shop status:', error);
      setToast({ type: 'error', message: error.message || 'Failed to update shop status', isVisible: true });
    }
  };

  const columns: Column<Shop>[] = [
    {
      key: 'index',
      header: 'NO.',
      render: (_, index) => <span className="text-sm text-gray-500">{index + 1}</span>
    },
    {
      key: 'shopName',
      header: 'SHOP NAME',
      render: (shop) => (
        <div className="flex items-center">
          <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-green-600">
              {shop.shopName.charAt(0)}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{shop.shopName}</div>
            <div className="text-xs text-gray-500">Created {new Date(shop.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
      )
    },
    {
      key: 'margin',
      header: 'MARGIN',
      render: (shop) => <span className="text-sm text-gray-900">{shop.margin}%</span>
    },
    {
      key: 'location',
      header: 'LOCATION',
      render: (shop) => <span className="text-sm text-gray-900">{shop.location}</span>
    },
    {
      key: 'owner',
      header: 'OWNER',
      render: (shop) => (
        <div className="flex items-center">
          <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
            <span className="text-xs font-medium text-blue-600">
              {shop.owner?.fullName?.charAt(0) || shop.owner?.username?.charAt(0) || 'U'}
            </span>
          </div>
          <span className="text-sm text-gray-900">
            {shop.owner?.fullName || shop.owner?.username || 'No Owner'}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'STATUS',
      render: (shop) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
          shop.status === 'active'
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {shop.status === 'active' ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'ACTIONS',
      render: (shop) => (
        <ActionButtons
          buttons={[
            {
              label: 'Edit',
              onClick: () => handleEdit(shop),
              variant: 'primary'
            },
            {
              label: shop.status === 'active' ? 'Deactivate' : 'Activate',
              onClick: () => handleToggleStatus(shop),
              variant: shop.status === 'active' ? 'warning' : 'primary'
            },
            {
              label: 'Delete',
              onClick: () => handleDelete(shop),
              variant: 'danger'
            }
          ]}
        />
      )
    }
  ];

  const getModalFields = () => {
    if (editingShop) {
      // Edit Shop Modal Fields
      return [
        {
          key: 'shopName',
          label: 'Shop Name',
          type: 'text' as const,
          required: true
        },
        {
          key: 'location',
          label: 'Shop Location',
          type: 'text' as const
        },
        {
          key: 'ownerId',
          label: 'Shop Owner',
          type: 'select' as const,
          required: true,
          placeholder: 'Select shop owner',
          options: shopOwners.map(owner => ({
            value: owner._id,
            label: `${owner.fullName || owner.username} - ${owner.username}`
          }))
        },
        {
          key: 'margin',
          label: 'Shop Margin (%)',
          type: 'select' as const,
          required: true,
          options: [
            { value: '10', label: '10% ' },
            { value: '15', label: '15% ' },
            { value: '20', label: '20% ' },
            { value: '25', label: '25% ' },
            { value: '30', label: '30% ' },
            { value: '35', label: '35% ' },
            { value: '40', label: '40% ' },
            { value: '45', label: '45% ' }
          ]
        }
      ];
    } else {
      // Create New Shop Modal Fields
      return [
        {
          key: 'ownerId',
          label: 'Shop Owner',
          type: 'select' as const,
          required: true,
          placeholder: 'Select shop owner',
          options: shopOwners.map(owner => ({
            value: owner._id,
            label: `${owner.fullName || owner.username} (${owner.username})`
          }))
        },
        {
          key: 'shopName',
          label: 'Shop Name',
          type: 'text' as const,
          required: true
        },
        {
          key: 'location',
          label: 'Shop Location',
          type: 'text' as const
        },
        {
          key: 'margin',
          label: 'Shop Margin (%)',
          type: 'select' as const,
          required: true,
          options: [
            { value: '10', label: '10% ' },
            { value: '15', label: '15% ' },
            { value: '20', label: '20% ' },
            { value: '25', label: '25% ' },
            { value: '30', label: '30% ' },
            { value: '35', label: '35% ' },
            { value: '40', label: '40% ' },
            { value: '45', label: '45% ' }
          ]
        }
      ];
    }
  };

  const getInitialData = () => {
    if (editingShop) {
      return {
        shopName: editingShop.shopName,
        location: editingShop.location,
        ownerId: editingShop.owner?._id || '', // Handle null owner
        margin: editingShop.margin.toString()
      };
    }
    return {
      margin: '10'
    };
  };

  return (
    <div className="transition-colors duration-300 bg-gray-100 min-h-full">
      <DataTable
        data={filteredShops}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={handleAddClick}
        addButtonText="Create New Shop"
        title="Shops"
        loading={loading}
        searchPlaceholder={searchPlaceholder}
        emptyStateMessage="No shops found"
        noDataMessage="No shops yet"
      />

      {/* Create/Edit Shop Modal */}
      {isModalOpen && (
        <FormModal<CreateShopFormData | EditShopFormData>
          mode={editingShop ? 'edit' : 'add'}
          title={editingShop ? 'Edit Shop' : 'Create New Shop'}
          fields={getModalFields()}
          initialData={getInitialData() as Partial<CreateShopFormData | EditShopFormData>}
          onClose={() => {
            setIsModalOpen(false);
            setEditingShop(null);
          }}
          onSubmit={handleModalSubmit}
          submitButtonText={editingShop ? 'Update Shop' : 'Create Shop'}
        />
      )}

      {/* Delete Shop Modal */}
      {deletingShop && (
        <DeleteModal
          item={deletingShop}
          title="Delete Shop"
          message={`Are you sure you want to delete "{name}"? This action cannot be undone.`}
          itemName={(shop) => shop.shopName}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingShop(null);
          }}
          onConfirm={handleDeleteConfirm}
          confirmButtonText="Delete Shop"
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