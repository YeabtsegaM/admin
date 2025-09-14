'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Toast from '../ui/Toast';
import LoadingSpinner from '../ui/LoadingSpinner';
import { FormModal, FormField } from '../ui/FormModal';
import { DeleteModal } from '../ui/DeleteModal';
import ActionButtons from '../ui/ActionButtons';
import { DataTable, Column } from '../ui/DataTable';
import { ShopOwner } from '@/types/shopOwner';
import { useDataTable } from '@/hooks/useDataTable';
import { formatDate } from '@/utils/dateUtils';
import { apiClient } from '@/utils/api';

export default function ShopOwnersSection() {
  const {
    data: shopOwners,
    filteredData: filteredShopOwners,
    loading,
    searchTerm,
    setSearchTerm,
    fetchData: fetchShopOwners,
    addItem,
    updateItem,
    deleteItem,
    toast,
    showToast,
    closeToast
  } = useDataTable<ShopOwner>({
    fetchData: useCallback(async () => {
      const response = await apiClient.getShopOwners();
      return response.data || [];
    }, []),
    searchFields: ['username'],
    searchPlaceholder: "Search by username..."
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedShopOwner, setSelectedShopOwner] = useState<ShopOwner | null>(null);

  const isModalOpen = showAddModal || showEditModal || showDeleteModal;

  useEffect(() => {
    fetchShopOwners();
  }, [fetchShopOwners]);

  const handleEditClick = (shopOwner: ShopOwner) => {
    setSelectedShopOwner(shopOwner);
    setShowEditModal(true);
  };

  const handleDeleteClick = (shopOwner: ShopOwner) => {
    setSelectedShopOwner(shopOwner);
    setShowDeleteModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedShopOwner(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedShopOwner(null);
  };

  // Handler functions using the generic hook methods
  const handleAddShopOwner = async (data: { firstName: string; lastName: string; username: string; password?: string }) => {
    try {
      const response = await apiClient.createShopOwner(data);
      if (response.data) {
        addItem(response.data);
        showToast('Shop owner created successfully!', 'success');
        // Immediate refresh for real-time update
        setTimeout(() => fetchShopOwners(), 100);
        return true;
      }
    } catch (error) {
      console.error('Error creating shop owner:', error);
      showToast('Failed to create shop owner', 'error');
    }
    return false;
  };

  const handleEditShopOwner = async (shopOwnerId: string, data: { firstName: string; lastName: string; username: string; password?: string }) => {
    try {
      const response = await apiClient.updateShopOwner(shopOwnerId, data);
      if (response.data) {
        updateItem(shopOwnerId, response.data);
        showToast('Shop owner updated successfully!', 'success');
        // Immediate refresh for real-time update
        setTimeout(() => fetchShopOwners(), 100);
        return true;
      }
    } catch (error) {
      console.error('Error updating shop owner:', error);
      showToast('Failed to update shop owner', 'error');
    }
    return false;
  };

  const handleDeleteShopOwner = async (shopOwnerId: string) => {
    try {
      await apiClient.deleteShopOwner(shopOwnerId);
      deleteItem(shopOwnerId);
      showToast('Shop owner deleted successfully!', 'success');
      // Immediate refresh for real-time update
      setTimeout(() => fetchShopOwners(), 100);
      return true;
    } catch (error) {
      console.error('Error deleting shop owner:', error);
      showToast('Failed to delete shop owner', 'error');
    }
    return false;
  };

  const handleToggleStatus = async (shopOwner: ShopOwner) => {
    try {
      const response = await apiClient.toggleShopOwnerStatus(shopOwner._id);
      if (response.data) {
        updateItem(shopOwner._id, response.data);
        showToast(`Shop owner ${shopOwner.isActive ? 'deactivated' : 'activated'} successfully!`, 'success');
        // Immediate refresh for real-time update
        setTimeout(() => fetchShopOwners(), 100);
        return true;
      }
    } catch (error) {
      console.error('Error toggling shop owner status:', error);
      showToast('Failed to update shop owner status', 'error');
    }
    return false;
  };

  // Define form fields for the modal
  const formFields = useMemo<FormField[]>(() => [
    {
      key: 'firstName',
      label: 'First Name',
      type: 'text',
      required: true,
      placeholder: 'Enter first name'
    },
    {
      key: 'lastName',
      label: 'Last Name',
      type: 'text',
      required: true,
      placeholder: 'Enter last name'
    },
    {
      key: 'username',
      label: 'Username',
      type: 'text',
      required: true,
      placeholder: 'Enter username'
    },
    {
      key: 'password',
      label: 'Password',
      type: 'password',
      required: !selectedShopOwner,
      placeholder: 'Enter password',
      validation: (value) => {
        if (!selectedShopOwner && !value) {
          return 'Password is required';
        }
        if (value && value.length < 6) {
          return 'Password must be at least 6 characters';
        }
        return undefined;
      }
    },
    {
      key: 'rePassword',
      label: 'Re-Password',
      type: 'password',
      required: !selectedShopOwner,
      placeholder: 'Re-enter password',
      validation: (value, formData) => {
        if (!selectedShopOwner && !value) {
          return 'Re-Password is required';
        }
        const password = formData?.password;
        if (password && value !== password) {
          return 'Passwords do not match';
        }
        return undefined;
      }
    }
  ], [selectedShopOwner]);

  // Define table columns
  const columns = useMemo<Column<ShopOwner>[]>(() => [
    {
      key: 'index',
      header: 'No.',
      render: (_, index) => (
        <span className="text-sm font-medium text-gray-900">{index + 1}</span>
      )
    },
    {
      key: 'name',
      header: 'Full Name',
      render: (shopOwner) => {
        const getFullName = () => {
          if (shopOwner.firstName && shopOwner.lastName) {
            return `${shopOwner.firstName} ${shopOwner.lastName}`;
          }
          return shopOwner.fullName || 'Unknown Name';
        };

        const getInitial = () => {
          const name = shopOwner.firstName || shopOwner.fullName || '?';
          return name.charAt(0);
        };

        return (
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-sm font-medium text-green-600">
                {getInitial()}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {getFullName()}
              </div>
              <div className="text-xs text-gray-500">Created {formatDate(shopOwner.createdAt)}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'username',
      header: 'Username',
      render: (shopOwner) => (
        <span className="text-sm text-gray-900">{shopOwner.username}</span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (shopOwner) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          shopOwner.isActive 
            ? 'bg-green-100 text-green-700 border border-green-200' 
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {shopOwner.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (shopOwner) => (
        <ActionButtons
          buttons={[
            {
              label: 'Edit',
              onClick: () => handleEditClick(shopOwner),
              variant: 'primary'
            },
            {
              label: shopOwner.isActive ? 'Deactivate' : 'Activate',
              onClick: () => handleToggleStatus(shopOwner),
              variant: shopOwner.isActive ? 'warning' : 'primary'
            },
            {
              label: 'Delete',
              onClick: () => handleDeleteClick(shopOwner),
              variant: 'danger'
            }
          ]}
        />
      )
    }
  ], []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="transition-colors duration-300 bg-gray-100 min-h-full">
      <DataTable
        data={filteredShopOwners}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setShowAddModal(true)}
        addButtonText="Create New Shop Owner"
        title="Shop Owners"
        searchPlaceholder="Search by username..."
        emptyStateMessage="No shop owners found"
        noDataMessage="No shop owners yet"
      />

      {/* Modals */}
      {showAddModal && (
        <FormModal
          mode="add"
          title="Create New Shop Owner"
          fields={formFields}
          onClose={() => setShowAddModal(false)}
          onSubmit={(data: any) => {
            // Remove rePassword from the data before submitting
            const { rePassword, ...submitData } = data;
            handleAddShopOwner(submitData);
            setShowAddModal(false);
          }}
          submitButtonText="Create User"
        />
      )}

      {showEditModal && selectedShopOwner && (
        <FormModal
          mode="edit"
          title="Edit Shop Owner"
          fields={formFields}
          initialData={{
            firstName: selectedShopOwner.firstName || '',
            lastName: selectedShopOwner.lastName || '',
            username: selectedShopOwner.username,
            password: ''
          }}
          onClose={closeEditModal}
          onSubmit={(data: any) => {
            // Remove rePassword from the data before submitting
            const { rePassword, ...submitData } = data;
            handleEditShopOwner(selectedShopOwner._id, submitData);
            closeEditModal();
          }}
          submitButtonText="Update User"
        />
      )}

      {showDeleteModal && selectedShopOwner && (
        <DeleteModal
          item={selectedShopOwner}
          title="Delete Shop Owner"
          message="Are you sure you want to delete {name}? This will permanently remove their account and all associated data."
          itemName={(shopOwner) => {
            if (shopOwner.firstName && shopOwner.lastName) {
              return `${shopOwner.firstName} ${shopOwner.lastName}`;
            }
            return shopOwner.fullName || 'Unknown Name';
          }}
          onClose={closeDeleteModal}
          onConfirm={() => {
            handleDeleteShopOwner(selectedShopOwner._id);
            closeDeleteModal();
          }}
          confirmButtonText="Delete User"
        />
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
}
