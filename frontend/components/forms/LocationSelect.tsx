// start of frontend/components/forms/LocationSelect.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Select from './Select';

interface Location {
    id: string;
    name: string;
}

interface LocationSelectProps {
    value: {
        provinceId: string;
        cityId: string;
        districtId: string;
    };
    onChange: (location: {
        provinceId: string;
        cityId: string;
        districtId: string;
    }) => void;
    error?: {
        province?: string;
        city?: string;
        district?: string;
    };
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

const LocationSelect: React.FC<LocationSelectProps> = ({
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    className = ''
}) => {
    // State untuk menyimpan opsi
    const [provinces, setProvinces] = useState<Location[]>([]);
    const [cities, setCities] = useState<Location[]>([]);
    const [districts, setDistricts] = useState<Location[]>([]);

    // Loading states
    const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
    const [isLoadingCities, setIsLoadingCities] = useState(false);
    const [isLoadingDistricts, setIsLoadingDistricts] = useState(false);

    // Fetch provinces on mount
    useEffect(() => {
        const fetchProvinces = async () => {
            setIsLoadingProvinces(true);
            try {
                const response = await fetch('/api/locations/provinces');
                const data = await response.json();
                setProvinces(data);
            } catch (error) {
                console.error('Error fetching provinces:', error);
            } finally {
                setIsLoadingProvinces(false);
            }
        };

        fetchProvinces();
    }, []);

    // Fetch cities when province changes
    useEffect(() => {
        const fetchCities = async () => {
            if (!value.provinceId) {
                setCities([]);
                return;
            }

            setIsLoadingCities(true);
            try {
                const response = await fetch(`/api/locations/cities/${value.provinceId}`);
                const data = await response.json();
                setCities(data);
            } catch (error) {
                console.error('Error fetching cities:', error);
            } finally {
                setIsLoadingCities(false);
            }
        };

        fetchCities();
    }, [value.provinceId]);

    // Fetch districts when city changes
    useEffect(() => {
        const fetchDistricts = async () => {
            if (!value.cityId) {
                setDistricts([]);
                return;
            }

            setIsLoadingDistricts(true);
            try {
                const response = await fetch(`/api/locations/districts/${value.cityId}`);
                const data = await response.json();
                setDistricts(data);
            } catch (error) {
                console.error('Error fetching districts:', error);
            } finally {
                setIsLoadingDistricts(false);
            }
        };

        fetchDistricts();
    }, [value.cityId]);

    // Handle value changes
    const handleProvinceChange = (selectedProvinceId: string) => {
        onChange({
            provinceId: selectedProvinceId,
            cityId: '',
            districtId: ''
        });
    };

    const handleCityChange = (selectedCityId: string) => {
        onChange({
            ...value,
            cityId: selectedCityId,
            districtId: ''
        });
    };

    const handleDistrictChange = (selectedDistrictId: string) => {
        onChange({
            ...value,
            districtId: selectedDistrictId
        });
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Province Select */}
            <Select
                label="Provinsi"
                value={value.provinceId}
                onChange={handleProvinceChange}
                options={provinces.map(province => ({
                    value: province.id,
                    label: province.name
                }))}
                error={error?.province}
                required={required}
                isDisabled={disabled}
                isLoading={isLoadingProvinces}
                placeholder="Pilih Provinsi"
            />

            {/* City Select */}
            <Select
                label="Kota/Kabupaten"
                value={value.cityId}
                onChange={handleCityChange}
                options={cities.map(city => ({
                    value: city.id,
                    label: city.name
                }))}
                error={error?.city}
                required={required}
                isDisabled={disabled || !value.provinceId || isLoadingCities}
                isLoading={isLoadingCities}
                placeholder={!value.provinceId ? 'Pilih Provinsi terlebih dahulu' : 'Pilih Kota/Kabupaten'}
            />

            {/* District Select */}
            <Select
                label="Kecamatan"
                value={value.districtId}
                onChange={handleDistrictChange}
                options={districts.map(district => ({
                    value: district.id,
                    label: district.name
                }))}
                error={error?.district}
                required={required}
                isDisabled={disabled || !value.cityId || isLoadingDistricts}
                isLoading={isLoadingDistricts}
                placeholder={!value.cityId ? 'Pilih Kota/Kabupaten terlebih dahulu' : 'Pilih Kecamatan'}
            />
        </div>
    );
};

export default LocationSelect;
// end of frontend/components/forms/LocationSelect.tsx