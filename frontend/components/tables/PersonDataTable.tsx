// start of frontend/components/tables/PersonsDataTable.tsx
'use client';
import { useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { formatPhoneNumber } from '@/utils/format';
import { Person } from '@/utils/person';
import ErrorBoundary from '@/components/ErrorBoundary'

interface PersonsDataTableProps {
  data: Person[];
  loading?: boolean;
}

const PersonsDataTable: React.FC<PersonsDataTableProps> = ({ data, loading }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    {
      accessor: 'bani.name',
      title: 'Bani',
      sortable: true,
    },
    {
      accessor: 'fullName',
      title: 'Nama Lengkap',
      sortable: true,
      render: (record: Person) => {
        const prefix = record.titlePrefix ? `${record.titlePrefix} ` : '';
        const suffix = record.titleSuffix ? ` ${record.titleSuffix}` : '';
        return `${prefix}${record.fullName}${suffix}`;
      },
    },
    {
      accessor: 'address.province.name',
      title: 'Provinsi',
      sortable: true,
    },
    {
      accessor: 'address.city.name',
      title: 'Kabupaten/Kota',
      sortable: true,
    },
    {
      accessor: 'address.street',
      title: 'Alamat',
      sortable: true,
      width: 250,
    },
    {
      accessor: 'phone',
      title: 'No. HP',
      sortable: true,
      render: (record: Person) => formatPhoneNumber(record.phone),
    },
    {
      accessor: 'status',
      title: 'Status',
      sortable: true,
      render: (record: Person) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium
          ${record.status === 'ALIVE' 
            ? 'bg-success-light text-success dark:bg-success/20' 
            : 'bg-danger-light text-danger dark:bg-danger/20'
          }`}
        >
          {record.status === 'ALIVE' ? 'Hidup' : 'Wafat'}
        </span>
      ),
    },
    {
      accessor: 'note',
      title: 'Keterangan',
      sortable: true,
      width: 200,
    },
  ];

  return (
    <div className="datatables">
      <DataTable
        columns={columns}
        records={data}
        page={page}
        onPageChange={setPage}
        totalRecords={data.length}
        recordsPerPage={pageSize}
        onRecordsPerPageChange={setPageSize}
        recordsPerPageOptions={[10, 20, 30, 50, 100]}
        fetching={loading}
        striped
        highlightOnHover
        className="whitespace-nowrap table-hover"
        minHeight={400}
        paginationText={({ from, to, totalRecords }: { from: number; to: number; totalRecords: number }) => 
          `Menampilkan ${from} sampai ${to} dari ${totalRecords} data`
        }
      />
    </div>
  );
};

export default PersonsDataTable;
// end of frontend/components/tables/PersonsDataTable.tsx