// start of frontend/app/(main)/persons-data/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Button from '@/components/ui/button';
import IconDownload from '@/components/icon/icon-download';
import IconPrinter from '@/components/icon/icon-printer';
import Select from '@/components/forms/Select';
import { exportToExcel, exportToPdf, handlePrint } from '@/utils/export';
import { Person } from '@/utils/person';
import ErrorBoundary from '@/components/ErrorBoundary';

interface Location {
  id: string;
  name: string;
}

interface Bani {
  id: string;
  name: string;
}

// Dynamic import dengan tipe yang benar
const PersonsDataTable = dynamic(
  () => import('@/components/tables/PersonDataTable').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
      </div>
    ),
  }
);

const PersonsDataPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Person[]>([]);
  const [filteredData, setFilteredData] = useState<Person[]>([]);
  const [provinces, setProvinces] = useState<{ value: string; label: string }[]>([]);
  const [cities, setCities] = useState<{ value: string; label: string }[]>([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedBani, setSelectedBani] = useState('');
  const [banis, setBanis] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetchData();
    fetchLocations();
    fetchBanis();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/persons');
      // Cek status response
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result?.data.persons) {
        setData(result.data.persons);
        setFilteredData(result.data.persons);
      } else {
      setData([]);
      setFilteredData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const provincesResponse = await fetch('/api/locations/provinces');
      if (!provincesResponse.ok) {
        throw new Error(`HTTP error! status: ${provincesResponse.status}`);
      }
      const provincesData = await provincesResponse.json();
      setProvinces(provincesData.map((p: Location) => ({ 
        value: p.id, 
        label: p.name 
      })));
    } catch (error) {
      console.error('Error fetching locations:', error);
      setProvinces([]); // Set empty array if error
    }
  };

  const fetchCities = async (provinceId: string) => {
    try {
      const citiesResponse = await fetch(`/api/locations/cities/${provinceId}`);
      const citiesData: Location[] = await citiesResponse.json();
      setCities(citiesData.map((c: Location) => ({ 
        value: c.id, 
        label: c.name 
      })));
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchBanis = async () => {
    try {
      const banisResponse = await fetch('/api/banis');
      if (!banisResponse.ok) {
        throw new Error(`HTTP error! status: ${banisResponse.status}`);
      }
      const banisData = await banisResponse.json();
      if (banisData?.data?.banis) {
        setBanis(banisData.data.banis.map((b: Bani) => ({ 
          value: b.id, 
          label: b.name 
        })));
      } else {
        setBanis([]);
      }
    } catch (error) {
      console.error('Error fetching banis:', error);
      setBanis([]); // Set empty array if error
    }
  };

  // Handle filters
  const handleFilter = () => {
    let filtered = [...data];
    
    if (selectedProvince) {
      filtered = filtered.filter(item => item.provinceId === selectedProvince);
    }
    
    if (selectedCity) {
      filtered = filtered.filter(item => item.cityId === selectedCity);
    }
    
    if (selectedBani) {
      filtered = filtered.filter(item => item.baniId === selectedBani);
    }
    
    setFilteredData(filtered);
  };

  // Reset filters
  const handleReset = () => {
    setSelectedProvince('');
    setSelectedCity('');
    setSelectedBani('');
    setFilteredData(data);
  };

  return (
    <ErrorBoundary>
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Data Keluarga</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Kelola dan lihat data anggota keluarga
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => exportToExcel(filteredData)}
            icon={<IconDownload className="w-4 h-4" />}
          >
            Excel
          </Button>
          <Button
            variant="outline"
            onClick={() => exportToPdf(filteredData)}
            icon={<IconDownload className="w-4 h-4" />}
          >
            PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => handlePrint(filteredData)}
            icon={<IconPrinter className="w-4 h-4" />}
          >
            Print
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          label="Provinsi"
          options={provinces}
          value={selectedProvince}
          onChange={(value: string) => {
            setSelectedProvince(value);
            fetchCities(value);
            handleFilter();
          }}
          isClearable
          placeholder="Pilih Provinsi"
        />

        <Select
          label="Kabupaten/Kota"
          options={cities}
          value={selectedCity}
          onChange={(value: string) => {
            setSelectedCity(value);
            handleFilter();
          }}
          isDisabled={!selectedProvince}
          isClearable
          placeholder="Pilih Kabupaten/Kota"
        />

        <Select
          label="Bani"
          options={banis}
          value={selectedBani}
          onChange={(value: string) => {
            setSelectedBani(value);
            handleFilter();
          }}
          isClearable
          placeholder="Pilih Bani"
        />
      </div>

      {/* DataTable */}
      <PersonsDataTable 
        data={filteredData} 
        loading={loading} 
      />
    </div>
    </ErrorBoundary>
  );
};

export default PersonsDataPage;
// end of frontend/app/(main)/persons-data/page.tsx