# Reusable DataTable System

This system provides a complete, reusable table and modal solution that can be used for any data type across your application.

## 🎯 **Benefits**

✅ **Reusable**: Use the same table and modal system for any data type  
✅ **Type-Safe**: Full TypeScript support with generic types  
✅ **Customizable**: Flexible column definitions, forms, and actions  
✅ **Consistent**: Same UI/UX across all sections  
✅ **Maintainable**: Single source of truth for table and modal logic  

## 📁 **File Structure**

```
components/ui/
├── DataTable.tsx           # Main reusable table component
├── DataTableHeader.tsx     # Header with title and add button
├── DataTableSearch.tsx     # Search functionality
├── DataTableContent.tsx    # Table content and rows
├── EmptyState.tsx          # Empty state display
├── FormModal.tsx           # Reusable form modal
└── DeleteModal.tsx         # Reusable delete modal

hooks/
└── useDataTable.ts         # Generic data management hook
```

## 🚀 **How to Use**

### **1. Basic Usage with Table and Modals**

```tsx
import { DataTable, Column } from '../ui/DataTable';
import { FormModal, FormField } from '../ui/FormModal';
import { DeleteModal } from '../ui/DeleteModal';
import { useDataTable } from '@/hooks/useDataTable';

interface MyData {
  _id: string;
  name: string;
  email: string;
  status: boolean;
}

export default function MySection() {
  const {
    filteredData,
    loading,
    searchTerm,
    setSearchTerm,
    fetchData,
    addItem,
    updateItem,
    deleteItem,
    // ... other methods
  } = useDataTable<MyData>({
    fetchData: async () => {
      const response = await apiClient.getMyData();
      return response.data || [];
    },
    searchFields: ['name', 'email'],
    searchPlaceholder: "Search by name or email..."
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MyData | null>(null);

  // Define form fields
  const formFields: FormField[] = [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'Enter name'
    },
    {
      key: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      placeholder: 'Enter email'
    }
  ];

  const columns: Column<MyData>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (item) => <span>{item.name}</span>
    },
    {
      key: 'email',
      header: 'Email',
      render: (item) => <span>{item.email}</span>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item) => (
        <div className="flex space-x-2">
          <button onClick={() => {
            setSelectedItem(item);
            setShowEditModal(true);
          }}>Edit</button>
          <button onClick={() => {
            setSelectedItem(item);
            setShowDeleteModal(true);
          }}>Delete</button>
        </div>
      )
    }
  ];

  return (
    <div>
      <DataTable
        data={filteredData}
        columns={columns}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={() => setShowAddModal(true)}
        addButtonText="Create New Item"
        title="My Data"
        searchPlaceholder="Search by name or email..."
        emptyStateMessage="No items found"
        noDataMessage="No items yet"
      />

      {/* Add Modal */}
      {showAddModal && (
        <FormModal
          mode="add"
          title="Create New Item"
          fields={formFields}
          onClose={() => setShowAddModal(false)}
          onSubmit={(data) => {
            // Handle add logic
            setShowAddModal(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <FormModal
          mode="edit"
          title="Edit Item"
          fields={formFields}
          initialData={selectedItem}
          onClose={() => {
            setShowEditModal(false);
            setSelectedItem(null);
          }}
          onSubmit={(data) => {
            // Handle edit logic
            setShowEditModal(false);
            setSelectedItem(null);
          }}
        />
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedItem && (
        <DeleteModal
          item={selectedItem}
          title="Delete Item"
          message="Are you sure you want to delete {name}? This action cannot be undone."
          itemName={(item) => item.name}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedItem(null);
          }}
          onConfirm={() => {
            // Handle delete logic
            setShowDeleteModal(false);
            setSelectedItem(null);
          }}
        />
      )}
    </div>
  );
}
```

### **2. Advanced Usage with Custom Actions**

```tsx
const columns: Column<ShopOwner>[] = [
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
    render: (shopOwner) => (
      <div className="flex items-center">
        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <span className="text-sm font-medium text-blue-600">
            {shopOwner.firstName?.charAt(0)}
          </span>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">
            {`${shopOwner.firstName} ${shopOwner.lastName}`}
          </div>
          <div className="text-sm text-gray-500">
            Created {formatDate(shopOwner.createdAt)}
          </div>
        </div>
      </div>
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
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleEdit(shopOwner)}
          className="text-blue-600 hover:text-blue-800 transition-colors"
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => handleToggleStatus(shopOwner)}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Toggle Status"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
          </svg>
        </button>
        <button
          onClick={() => handleDelete(shopOwner)}
          className="text-red-600 hover:text-red-800 transition-colors"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    )
  }
];
```

## 🔧 **Hook Methods**

The `useDataTable` hook provides these methods:

- `fetchData()` - Load data from API
- `addItem(item)` - Add new item to the list
- `updateItem(id, item)` - Update existing item
- `deleteItem(id)` - Remove item from list
- `showToast(message, type)` - Show toast notification
- `closeToast()` - Hide toast notification

## 🎨 **Customization Options**

### **DataTable Props**
- `data` - Array of items to display
- `columns` - Column definitions
- `searchTerm` - Current search term
- `onSearchChange` - Search change handler
- `onAddClick` - Add button click handler
- `addButtonText` - Text for add button
- `title` - Section title
- `searchPlaceholder` - Search input placeholder
- `emptyStateMessage` - Message when no search results
- `noDataMessage` - Message when no data exists
- `className` - Additional CSS classes

### **Column Definition**
```tsx
interface Column<T> {
  key: string;           // Unique column identifier
  header: string;        // Column header text
  render: (item: T, index: number) => ReactNode;  // Render function
  sortable?: boolean;    // Enable sorting (future feature)
}
```

## 📋 **Examples**

See these files for complete examples:
- `ShopOwnersSection.tsx` - Shop owners management
- `CashiersSection.tsx` - Cashiers management (example)

## 🚀 **Migration Guide**

To migrate existing sections to use this system:

1. **Replace custom table with DataTable**
2. **Define columns array**
3. **Use useDataTable hook**
4. **Update imports**

This system provides a consistent, maintainable, and reusable solution for all your data table needs! 