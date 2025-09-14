interface DataTableHeaderProps {
  title: string;
  onAddClick?: () => void;
  addButtonText?: string;
}

export function DataTableHeader({ title, onAddClick, addButtonText }: DataTableHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      {onAddClick && (
        <button
          onClick={onAddClick}
          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>{addButtonText}</span>
        </button>
      )}
    </div>
  );
} 