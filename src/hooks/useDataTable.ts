import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'warning';
  isVisible: boolean;
}

export interface UseDataTableProps<T> {
  fetchData: () => Promise<T[]>;
  searchFields?: (keyof T)[];
  searchPlaceholder?: string;
}

export function useDataTable<T>({ 
  fetchData, 
  searchFields = [],
  searchPlaceholder = "Search..."
}: UseDataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [filteredData, setFilteredData] = useState<T[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'success',
    isVisible: false
  });

  // Use ref to store the latest fetchData function
  const fetchDataRef = useRef(fetchData);
  fetchDataRef.current = fetchData;

  // Memoize searchFields to prevent infinite re-renders
  const memoizedSearchFields = useMemo(() => searchFields, [JSON.stringify(searchFields)]);

  const fetchDataCallback = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchDataRef.current();
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, []); // Remove fetchData from dependencies

  // Search functionality
  useEffect(() => {
    if (memoizedSearchFields.length === 0) {
      setFilteredData(data);
      return;
    }

    const filtered = data.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return memoizedSearchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchLower);
        }
        return false;
      });
    });
    setFilteredData(filtered);
  }, [searchTerm, data, memoizedSearchFields]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'warning') => {
    setToast({ message, type, isVisible: true });
  }, []);

  const closeToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  const updateData = useCallback((newData: T[]) => {
    setData(newData);
  }, []);

  const addItem = useCallback((item: T) => {
    setData(prev => [item, ...prev]);
  }, []);

  const updateItem = useCallback((id: string, updatedItem: T, idField: keyof T = '_id' as keyof T) => {
    setData(prev => prev.map(item => 
      item[idField] === id ? updatedItem : item
    ));
  }, []);

  const deleteItem = useCallback((id: string, idField: keyof T = '_id' as keyof T) => {
    setData(prev => prev.filter(item => item[idField] !== id));
  }, []);

  return {
    data,
    filteredData,
    loading,
    searchTerm,
    setSearchTerm,
    fetchData: fetchDataCallback,
    updateData,
    addItem,
    updateItem,
    deleteItem,
    toast,
    showToast,
    closeToast,
    searchPlaceholder
  };
} 