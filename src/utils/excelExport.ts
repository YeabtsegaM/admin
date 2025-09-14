import * as XLSX from 'xlsx';

export interface ExcelColumn {
  key: string;
  label: string;
  render?: (value: any) => string;
}

export const exportToExcel = (
  data: any[],
  columns: ExcelColumn[],
  filename: string
) => {
  // Transform data for Excel export
  const excelData = data.map(row => {
    const transformedRow: any = {};
    
    columns.forEach(column => {
      let value = row[column.key];
      
      // Apply custom render function if available
      if (column.render) {
        value = column.render(value);
      } else {
        // Default formatting
        if (typeof value === 'number') {
          value = value.toLocaleString();
        } else if (typeof value === 'string') {
          value = value;
        } else {
          value = String(value || '');
        }
      }
      
      transformedRow[column.label] = value;
    });
    
    return transformedRow;
  });

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Auto-size columns
  const columnWidths = columns.map(col => ({
    wch: Math.max(
      col.label.length,
      ...data.map(row => {
        const value = row[col.key];
        if (col.render) {
          return col.render(value).length;
        }
        return String(value || '').length;
      })
    )
  }));
  
  worksheet['!cols'] = columnWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Report Data');

  // Generate Excel file and trigger download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xlsx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  window.URL.revokeObjectURL(url);
};
