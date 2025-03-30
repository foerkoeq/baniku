import React from 'react';
import Select from '@/components/forms/Select';

interface BaniLevel {
  id: string;
  name: string;
  level: number;
}

interface BaniLevelSelectorProps {
  currentBani: BaniLevel;
  availableLevels: BaniLevel[];
  onLevelChange: (baniId: string) => void;
}

const BaniLevelSelector: React.FC<BaniLevelSelectorProps> = ({
  currentBani,
  availableLevels,
  onLevelChange
}) => {
  const options = availableLevels.map(bani => ({
    value: bani.id,
    label: `${bani.name} (Tingkat ${bani.level})`
  }));

  return (
    <div className="max-w-md mx-auto mb-8">
      <Select
        label="Pilih Tingkat Bani"
        value={options.find(opt => opt.value === currentBani.id)}
        options={options}
        onChange={(selected: any) => onLevelChange(selected.value)}
        className="w-full"
        isSearchable
        placeholder="Pilih tingkat bani yang ingin dilihat..."
      />
    </div>
  );
};

export default BaniLevelSelector;