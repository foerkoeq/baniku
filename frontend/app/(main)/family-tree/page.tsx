// start of frontend/app/(main)/family-tree/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FamilyTree from '@/components/family-tree/FamilyTree';
import { NodeClickData, TreeNodeData } from '@/components/family-tree/types';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/Modal';
import IconPlus from '@/components/icon/icon-plus';
import IconInfo from '@/components/icon/icon-info-circle';
import IconArrowRight from '@/components/icon/icon-arrow-right';
import IconCalendar from '@/components/icon/icon-calendar';
import IconLocation from '@/components/icon/icon-map-pin';
import IconPhone from '@/components/icon/icon-phone';
import ProfileImage from '@/components/ui/ProfileImage';
import Alert from '@/components/ui/alert';
import { showToast } from '@/components/ui/toast';
import IconEdit from '@/components/icon/icon-edit';
import { Role, RoleString, stringToRole, hasAccessLevel, isAdmin, isSuperAdmin, getRoleLabel } from '@/types/role';

export default function FamilyTreePage() {
  const router = useRouter();
  const [treeData, setTreeData] = useState<TreeNodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<Role>(Role.MEMBER);
  
  // State untuk modal konfirmasi penambahan data
  const [showAddConfirmationModal, setShowAddConfirmationModal] = useState(false);
  const [targetNodeId, setTargetNodeId] = useState<string | null>(null);

  // State untuk modal detail biodata
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<TreeNodeData | null>(null);

  // Template data awal untuk silsilah kosong
  const emptyTreeTemplate: TreeNodeData = {
    id: 'root-template',
    name: 'Silsilah Bani',
    fullName: 'Silsilah Bani',
    nodeType: 'PERSON',
    gender: 'MALE',
    children: [
      {
        id: 'placeholder-1',
        name: 'Anggota Keluarga',
        fullName: 'Anggota Keluarga',
        nodeType: 'PLACEHOLDER',
        gender: 'MALE'
      },
      {
        id: 'placeholder-2',
        name: 'Anggota Keluarga',
        fullName: 'Anggota Keluarga',
        nodeType: 'PLACEHOLDER',
        gender: 'FEMALE'
      },
      {
        id: 'placeholder-3',
        name: 'Anggota Keluarga',
        fullName: 'Anggota Keluarga',
        nodeType: 'PLACEHOLDER',
        gender: 'MALE'
      }
    ]
  };

  useEffect(() => {
    let isMounted = true;

    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          console.warn('Gagal mendapatkan informasi user');
          return;
        }
        const userData = await response.json();
        
        if (isMounted) {
          // Konversi string role dari API ke enum Role
          const roleString = userData.data?.role as RoleString;
          setUserRole(roleString ? stringToRole(roleString) : Role.MEMBER);
        }
      } catch (error) {
        console.warn('Error fetching user role:', error);
      }
    };

    const fetchTreeData = async () => {
      try {
        const response = await fetch('/api/persons/tree/root');
        if (!response.ok) {
          if (response.status === 404) {
            // Jika belum ada data, gunakan template kosong
            if (isMounted) {
              setTreeData(emptyTreeTemplate);
              setLoading(false);
            }
            return;
          }
          throw new Error('Gagal mengambil data silsilah');
        }
        
        const data = await response.json();
        if (isMounted) {
          // Preprocess data untuk memastikan properti yang diperlukan tersedia
          const familyTree = data.data?.familyTree || emptyTreeTemplate;
          
          // Tambahkan nodeType jika belum ada
          const processedTree = processTreeData(familyTree);
          setTreeData(processedTree);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error:', err);
        // Jika terjadi error, tetap tampilkan template kosong
        if (isMounted) {
          setTreeData(emptyTreeTemplate);
          setLoading(false);
          
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Terjadi kesalahan saat memuat data');
          }
        }
      }
    };

    // Function untuk memproses data pohon dan menambahkan properti yang diperlukan
    const processTreeData = (node: TreeNodeData): TreeNodeData => {
      // Tentukan nodeType
      const nodeType = node.id?.startsWith('placeholder-') ? 'PLACEHOLDER' : 'PERSON';
      
      // Proses children secara rekursif jika ada
      const processedChildren = node.children?.map(child => processTreeData(child));
      
      return {
        ...node,
        nodeType: node.nodeType || nodeType,
        gender: node.gender || 'MALE', // Default gender jika tidak ada
        children: processedChildren
      };
    };

    // Panggil kedua fungsi fetch
    fetchUserRole();
    fetchTreeData();

    // Cleanup function untuk mencegah update state setelah komponen di-unmount
    return () => {
      isMounted = false;
    };
  }, []);

  // Handler ketika user ingin menambahkan data root/awal
  const handleAddRoot = () => {
    // Tampilkan modal konfirmasi
    setTargetNodeId('root-template');
    setShowAddConfirmationModal(true);
  };

  // Handler untuk konfirmasi penambahan data
  const handleConfirmAddPerson = () => {
    console.log("Konfirmasi penambahan data:", targetNodeId);
    
    // Tutup modal
    setShowAddConfirmationModal(false);
    
    // Navigasi ke halaman add-person
    if (targetNodeId === 'root-template' || targetNodeId === 'root') {
      // Untuk node root, langsung navigasi ke add-person tanpa parentId
      router.push('/family-tree/add-person');
    } else if (targetNodeId) {
      // Navigasi ke halaman tambah anggota dengan parent ID
      router.push(`/family-tree/add-person?parentId=${targetNodeId}`);
    }
  };

  // Format tanggal untuk ditampilkan
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const handleNodeClick = (node: NodeClickData) => {
    console.log('Node clicked:', node);
    
    // Jika aksinya adalah melihat detail
    if (node.action === 'details') {
      // Navigasi ke halaman detail jika bukan placeholder
      if (!node.nodeData.id.startsWith('placeholder-')) {
        // Tampilkan modal detail
        setSelectedPerson(node.nodeData);
        setShowDetailModal(true);
      }
    } else if (node.action === 'add') {
      console.log('Add action triggered for node:', node.nodeData.id);
      
      // Set node target dan tampilkan modal konfirmasi
      setTargetNodeId(node.nodeData.id);
      setShowAddConfirmationModal(true);
    } else if (node.action === 'edit') {
      // Navigasi ke halaman edit
      router.push(`/family-tree/${node.nodeData.id}/edit`);
    } else if (node.action === 'expand') {
      // Handle expand di level komponen tree
      // Di masa depan bisa diimplementasikan untuk mengambil data lebih banyak
      showToast('info', 'Sedang memuat data anak...');
    }
  };

  // Navigasi ke halaman detail cerita bani
  const handleViewStory = () => {
    if (selectedPerson && selectedPerson.id) {
      router.push(`/bani/${selectedPerson.id}`);
    }
    setShowDetailModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen py-10">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary border-t-transparent shadow-lg"></div>
      </div>
    );
  }

  const isEmptyOrTemplateData = !treeData || 
    treeData.id === 'root-template' || 
    (treeData.children && treeData.children.some(child => child.id.startsWith('placeholder-')));

  const canAddRootData = isSuperAdmin(userRole) && isEmptyOrTemplateData;
  
  const getRoleInfo = () => {
    if (isSuperAdmin(userRole)) {
      return {
        message: isEmptyOrTemplateData 
          ? 'Silahkan tambahkan anggota keluarga utama dengan klik pada node/kotak di bawah ini atau gunakan tombol "Tambah Data Awal".'
          : 'Anda memiliki akses penuh untuk mengelola seluruh silsilah keluarga.'
      };
    } else if (isAdmin(userRole)) {
      return {
        message: isEmptyOrTemplateData 
          ? 'Menunggu Super Admin menambahkan data awal silsilah keluarga.' 
          : 'Anda dapat mengelola anggota keluarga sesuai dengan tingkat akses Anda.'
      };
    } else {
      return {
        message: isEmptyOrTemplateData 
          ? 'Silsilah keluarga belum tersedia. Menunggu Admin untuk menambahkan data.' 
          : 'Anda dapat melihat silsilah keluarga Bani.'
      };
    }
  };

  const roleInfo = getRoleInfo();

  return (
    <div className="py-6 px-4 md:px-6 flex flex-col h-full min-h-screen max-w-[1600px] mx-auto">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Silsilah Keluarga Bani</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Visualisasi hubungan kekerabatan dalam keluarga Bani
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800">
              <IconInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {getRoleLabel(userRole)}
              </span>
            </div>

            {canAddRootData && (
              <Button
                variant="solid"
                onClick={handleAddRoot}
                icon={<IconPlus className="w-4 h-4" />}
                className="shadow-md"
              >
                Tambah Data Awal
              </Button>
            )}
          </div>
        </div>

        {/* Info panel dengan alert */}
        <Alert 
          type={isEmptyOrTemplateData ? "default" : "info"}
          className="mb-4"
        >
          <div className="flex items-start">
            <IconInfo className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">
                {userRole === Role.SUPER_ADMIN ? 'Super Admin' : 
                 userRole === Role.ADMIN_BANI ? 'Admin Bani' : 
                 userRole === Role.ADMIN_KELUARGA ? 'Admin Keluarga' : 'Anggota'}
              </p>
              <p className="text-sm mt-1">{roleInfo.message}</p>
            </div>
          </div>
        </Alert>

        {error && (
          <Alert 
            type="error"
            className="mb-4"
          >
            <div className="flex items-start">
              <div className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-full h-full">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <div>
                <p className="font-medium text-red-700 dark:text-red-400">Terjadi Kesalahan</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </div>
          </Alert>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex-grow overflow-hidden mb-6">
        <FamilyTree
          data={treeData || emptyTreeTemplate}
          userRole={userRole}
          onNodeClick={handleNodeClick}
          onAddInitialData={handleAddRoot}
          className="p-2 h-full"
        />
      </div>

      {/* Modal Konfirmasi Penambahan Data */}
      <Modal
        open={showAddConfirmationModal}
        onClose={() => setShowAddConfirmationModal(false)}
        title="Tambah Data Keluarga"
        size="md"
      >
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <IconPlus className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {targetNodeId === 'root-template' || targetNodeId === 'root'
                  ? 'Tambah Data Awal Silsilah'
                  : 'Tambah Anggota Keluarga'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {targetNodeId === 'root-template' || targetNodeId === 'root'
                  ? 'Belum ada data silsilah. Anda akan menambahkan data awal untuk silsilah keluarga.'
                  : 'Belum ada data untuk anggota keluarga ini. Ingin menambahkannya sekarang?'}
              </p>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddConfirmationModal(false)}
            >
              Batal
            </Button>
            <Button
              variant="solid"
              onClick={handleConfirmAddPerson}
            >
              Tambah Data
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal Detail Anggota Keluarga */}
      <Modal
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detail Anggota Keluarga"
        size="lg"
      >
        <div className="p-4">
          {selectedPerson && (
            <div className="space-y-6">
              {/* Header dengan foto dan nama */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="relative">
                  <ProfileImage
                    src={selectedPerson.photo}
                    alt={selectedPerson.fullName || selectedPerson.name || ''}
                    size={120}
                    className={`rounded-full border-4 ${
                      selectedPerson.gender === 'FEMALE'
                        ? 'border-pink-400 dark:border-pink-600'
                        : 'border-blue-400 dark:border-blue-600'
                    } shadow-md`}
                  />
                  {selectedPerson.status === 'DECEASED' && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-base">
                      ✝
                    </div>
                  )}
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold">
                    {selectedPerson.titlePrefix && (
                      <span className="font-normal text-gray-600 dark:text-gray-400">{selectedPerson.titlePrefix} </span>
                    )}
                    {selectedPerson.fullName || selectedPerson.name}
                    {selectedPerson.titleSuffix && (
                      <span className="font-normal text-gray-600 dark:text-gray-400"> {selectedPerson.titleSuffix}</span>
                    )}
                  </h3>
                  
                  {/* Status pernikahan */}
                  {selectedPerson.maritalStatus && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Status: {selectedPerson.maritalStatus === 'MARRIED' ? 'Menikah' : 
                              selectedPerson.maritalStatus === 'SINGLE' ? 'Belum Menikah' :
                              selectedPerson.maritalStatus === 'DIVORCED' ? 'Bercerai' :
                              selectedPerson.maritalStatus === 'WIDOWED' ? 'Janda/Duda' :
                              selectedPerson.maritalStatus === 'REMARRIED' ? 'Menikah Kembali' : ''}
                    </div>
                  )}
                  
                  {/* Jenis kelamin */}
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Jenis Kelamin: {selectedPerson.gender === 'MALE' ? 'Laki-laki' : 
                                    selectedPerson.gender === 'FEMALE' ? 'Perempuan' : 'Lainnya'}
                  </div>
                  
                  {/* Pasangan */}
                  {selectedPerson.spouses && selectedPerson.spouses.length > 0 && selectedPerson.spouses.some(s => s.isCurrentSpouse) && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Pasangan: {selectedPerson.spouses.find(s => s.isCurrentSpouse)?.fullName}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
              
              {/* Biodata */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Bagian kiri */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Informasi Pribadi</h4>
                  
                  {/* Tanggal dan Tempat Lahir */}
                  {(selectedPerson.birthDate || selectedPerson.birthPlace) && (
                    <div className="flex items-start">
                      <IconCalendar className="w-5 h-5 mt-0.5 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Kelahiran</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedPerson.birthDate && formatDate(selectedPerson.birthDate)}
                          {selectedPerson.birthPlace && selectedPerson.birthDate && <span> • </span>}
                          {selectedPerson.birthPlace && selectedPerson.birthPlace}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Alamat */}
                  {selectedPerson.address && (
                    <div className="flex items-start">
                      <IconLocation className="w-5 h-5 mt-0.5 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Alamat</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedPerson.address}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Bagian kanan */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 dark:text-gray-300">Kontak</h4>
                  
                  {/* Telepon */}
                  {selectedPerson.phone && (
                    <div className="flex items-start">
                      <IconPhone className="w-5 h-5 mt-0.5 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Telepon</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedPerson.phone}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Tanggal dan Tempat Meninggal (jika ada) */}
                  {selectedPerson.status === 'DECEASED' && (selectedPerson.deathDate || selectedPerson.deathPlace) && (
                    <div className="flex items-start">
                      <IconCalendar className="w-5 h-5 mt-0.5 mr-2 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <div>
                        <div className="font-medium">Meninggal</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedPerson.deathDate && formatDate(selectedPerson.deathDate)}
                          {selectedPerson.deathPlace && selectedPerson.deathDate && <span> • </span>}
                          {selectedPerson.deathPlace && selectedPerson.deathPlace}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Tombol Tindakan */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button
                  variant="outline"
                  onClick={() => setShowDetailModal(false)}
                >
                  Tutup
                </Button>
                
                {userRole !== Role.MEMBER && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowDetailModal(false);
                      router.push(`/family-tree/${selectedPerson.id}/edit`);
                    }}
                    icon={<IconEdit className="w-4 h-4 mr-1" />}
                  >
                    Edit Data
                  </Button>
                )}
                
                <Button
                  variant="solid"
                  onClick={handleViewStory}
                  icon={<IconArrowRight className="w-4 h-4 ml-1" />}
                  iconPosition="right"
                >
                  Lihat Cerita Lengkap
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
// end of frontend/app/(main)/family-tree/page.tsx