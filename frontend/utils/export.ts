// start of frontend/utils/export.ts
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToExcel = (data: any[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data Keluarga");
  XLSX.writeFile(workbook, "data-keluarga.xlsx");
};

export const exportToPdf = (data: any[]) => {
  const doc = new jsPDF();
  autoTable(doc, {
    head: [['Bani', 'Nama Lengkap', 'Provinsi', 'Kab/Kota', 'Alamat', 'No. HP', 'Status', 'Keterangan']],
    body: data.map(item => [
      item.bani?.name,
      `${item.titlePrefix || ''} ${item.fullName} ${item.titleSuffix || ''}`.trim(),
      item.address?.province?.name,
      item.address?.city?.name,
      item.address?.street,
      item.phone,
      item.status === 'ALIVE' ? 'Hidup' : 'Wafat',
      item.note
    ]),
  });
  doc.save('data-keluarga.pdf');
};

export const handlePrint = (data: any[]) => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
    <html>
      <head>
        <title>Data Keluarga</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { padding: 8px; border: 1px solid #ddd; }
          th { background-color: #f5f5f5; }
        </style>
      </head>
      <body>
        <h1>Data Keluarga</h1>
        <table>
          <thead>
            <tr>
              <th>Bani</th>
              <th>Nama Lengkap</th>
              <th>Provinsi</th>
              <th>Kab/Kota</th>
              <th>Alamat</th>
              <th>No. HP</th>
              <th>Status</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(item => `
              <tr>
                <td>${item.bani?.name || ''}</td>
                <td>${item.titlePrefix || ''} ${item.fullName} ${item.titleSuffix || ''}</td>
                <td>${item.address?.province?.name || ''}</td>
                <td>${item.address?.city?.name || ''}</td>
                <td>${item.address?.street || ''}</td>
                <td>${item.phone || ''}</td>
                <td>${item.status === 'ALIVE' ? 'Hidup' : 'Wafat'}</td>
                <td>${item.note || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};
// end of frontend/utils/export.ts