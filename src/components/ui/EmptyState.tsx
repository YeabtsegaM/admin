interface EmptyStateProps {
  searchTerm?: string;
  emptyStateMessage?: string;
  noDataMessage?: string;
}

export function EmptyState({ 
  searchTerm, 
  emptyStateMessage = "No results found",
  noDataMessage = "No data yet"
}: EmptyStateProps) {
  if (searchTerm) {
    return (
      <tr>
        <td colSpan={6} className="px-6 py-12 text-center">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg font-medium text-gray-900 mb-2">{emptyStateMessage}</p>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td colSpan={6} className="px-6 py-12 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <p className="text-lg font-medium text-gray-900 mb-2">{noDataMessage}</p>
        </div>
      </td>
    </tr>
  );
} 