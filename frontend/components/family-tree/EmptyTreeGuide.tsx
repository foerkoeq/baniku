'use client';
import React from 'react';
import Image from 'next/image';
import Button from '../ui/button';
import IconArrowLeft from '../icon/icon-arrow-left';
import IconArrowRight from '../icon/icon-arrow-right';
import { EmptyTreeGuideProps, UserRole } from './types';

const EmptyTreeGuide: React.FC<EmptyTreeGuideProps> = ({
  step,
  onNextStep,
  onPrevStep,
  onFinish,
  userRole,
}) => {
  // Konten untuk setiap langkah
  const steps = [
    {
      title: 'Selamat Datang di Silsilah Keluarga Bani!',
      description: 'Silsilah ini akan membantu Anda melihat hubungan kekeluargaan dalam Bani. Mari kita mulai!',
      image: '/assets/images/family-tree-welcome.png',
    },
    {
      title: 'Menambahkan Anggota Keluarga',
      description: 'Silsilah dimulai dengan menambahkan data awal keluarga. Sebagai Super Admin, Anda dapat menambahkan anggota pertama.',
      image: '/assets/images/family-tree-add.png',
    },
    {
      title: 'Navigasi Silsilah',
      description: 'Gunakan kontrol zoom dan pan untuk melihat seluruh silsilah. Klik node untuk melihat detail atau menambahkan anggota baru.',
      image: '/assets/images/family-tree-navigation.png',
    },
    {
      title: 'Melihat Detail Anggota',
      description: 'Klik pada anggota keluarga untuk melihat informasi detailnya termasuk tanggal lahir, status, dan informasi kontak.',
      image: '/assets/images/family-tree-details.png',
    },
    {
      title: 'Siap Menggunakan Silsilah!',
      description: 'Anda sekarang siap untuk mulai membangun silsilah keluarga. Klik tombol "Mulai" untuk memulai.',
      image: '/assets/images/family-tree-ready.png',
    },
  ];

  // Filter langkah berdasarkan peran pengguna
  const filteredSteps = steps.filter((_, index) => {
    if (userRole !== 'SUPER_ADMIN' && index === 1) {
      return false; // Sembunyikan langkah menambahkan anggota untuk non-super admin
    }
    return true;
  });

  const currentStep = filteredSteps[step];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {currentStep.title}
        </h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl">
          {currentStep.description}
        </p>
      </div>

      <div className="relative h-[300px] mb-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Image
          src={currentStep.image}
          alt={`Langkah ${step + 1}`}
          fill
          style={{ objectFit: 'contain' }}
          className="p-4"
        />
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={onPrevStep}
          disabled={step === 0}
          icon={<IconArrowLeft className="w-4 h-4 mr-2" />}
        >
          Sebelumnya
        </Button>

        <div className="flex space-x-2">
          {filteredSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === step ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {step < filteredSteps.length - 1 ? (
          <Button
            variant="outline"
            onClick={onNextStep}
            icon={<IconArrowRight className="w-4 h-4 ml-2" />}
            iconPosition="right"
          >
            Selanjutnya
          </Button>
        ) : (
          <Button variant="solid" onClick={onFinish}>
            Mulai
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyTreeGuide; 