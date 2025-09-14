import { Column } from './DataTable';
import { EmptyState } from './EmptyState';

interface DataTableContentProps<T> {
  data: T[];
  columns: Column<T>[];
  searchTerm: string;
  emptyStateMessage?: string;
  noDataMessage?: string;
}

export function DataTableContent<T>({
  data,
  columns,
  searchTerm,
  emptyStateMessage = "No results found",
  noDataMessage = "No data yet"
}: DataTableContentProps<T>) {
  return (
    <div className="overflow-hidden">
      <div className="max-h-96 overflow-y-auto px-6">
        <table className="w-full divide-y divide-gray-200">
          <TableHeader columns={columns} />
          <tbody className="bg-gray-50 divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((item, index) => (
                <TableRow
                  key={index}
                  item={item}
                  index={index}
                  columns={columns}
                />
              ))
            ) : (
              <EmptyState 
                searchTerm={searchTerm}
                emptyStateMessage={emptyStateMessage}
                noDataMessage={noDataMessage}
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableHeader<T>({ columns }: { columns: Column<T>[] }) {
  return (
    <thead className="bg-gray-50 sticky top-0 z-10">
      <tr>
        {columns.map((column) => (
          <th
            key={column.key}
            className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
              column.key === 'index' ? 'w-16' : 
              column.key === 'name' || column.key === 'fullName' ? 'w-1/3' :
              column.key === 'username' ? 'w-1/4' :
              column.key === 'status' ? 'w-24' :
              column.key === 'actions' ? 'w-28' : ''
            }`}
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableRow<T>({ 
  item, 
  index, 
  columns 
}: { 
  item: T; 
  index: number; 
  columns: Column<T>[] 
}) {
  return (
    <tr className={`hover:bg-gray-200 transition-colors bg-gray-50`}>
      {columns.map((column) => (
        <td key={column.key} className={`px-4 py-3 whitespace-nowrap ${
          column.key === 'index' ? 'w-16' : 
          column.key === 'name' || column.key === 'fullName' ? 'w-1/3' :
          column.key === 'username' ? 'w-1/4' :
          column.key === 'status' ? 'w-24' :
          column.key === 'actions' ? 'w-28' : ''
        }`}>
          {column.render(item, index)}
        </td>
      ))}
    </tr>
  );
} 