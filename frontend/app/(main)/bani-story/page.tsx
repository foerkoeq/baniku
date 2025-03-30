// start of frontend/app/(main)/bani-story/page.tsx
'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import Breadcrumb from '@/components/ui/breadcrumb';
import Button from '@/components/ui/button';
import Select from '@/components/forms/Select';
import ProfileImage from '@/components/ui/ProfileImage';
import FamilyImage from '@/components/ui/FamilyImage';
import OrnamentalDivider from '@/components/ui/OrnamentalDivider';
import BookPage from '@/components/book/BookPage';
import BookCover from '@/components/book/BookCover';
import ChildCard from '@/components/bani/ChildCard';
import IconArrowLeft from '@/components/icon/icon-arrow-left';
import IconArrowRight from '@/components/icon/icon-arrow-right';
import IconSearch from '@/components/icon/icon-search';
import { Bani, BaniStory } from '@/types/bani';
import { showToast } from '@/components/ui/toast';
import 'swiper/css';
import '@/styles/book.css';

// Data dummy sementara
const dummyLevels: Bani[] = [
  { id: '1', name: 'Bani Ahmad', level: 1 },
  { id: '2', name: 'Bani Budi', level: 2 },
  { id: '3', name: 'Bani Candra', level: 3 },
  { id: '4', name: 'Bani Dimas', level: 3 },
  { id: '5', name: 'Bani Eko', level: 4 },
];

const dummyData: BaniStory = {
  id: '1',
  name: 'Bani Ahmad',
  photos: [
    '/assets/images/family.png',
    '/assets/images/family.png',
  ],
  husbandPhoto: '/assets/images/profile.png',
  husbandName: 'Ahmad',
  husbandBirthDate: '1920-01-15',
  husbandBirthPlace: 'Jakarta',
  husbandDeathDate: '1990-06-22',
  wifePhoto: '/assets/images/profile.png',
  wifeName: 'Aminah',
  wifeBirthDate: '1925-03-10',
  wifeBirthPlace: 'Surabaya',
  wifeDeathDate: null,
  marriageDate: '1945-05-20',
  story: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  children: [
    {
      id: '2',
      name: 'Bani Budi',
      birthDate: '1950-02-02',
      photo: '/assets/images/profile.png',
      gender: 'MALE'
    },
    {
      id: '3',
      name: 'Bani Candra',
      birthDate: '1952-03-01',
      photo: '/assets/images/profile.png',
      gender: 'FEMALE'
    },
    {
      id: '4',
      name: 'Bani Dimas',
      birthDate: '1956-07-12',
      photo: '/assets/images/profile.png',
      gender: 'MALE'
    },
    {
      id: '5',
      name: 'Bani Eko',
      birthDate: '1958-11-05',
      photo: '/assets/images/profile.png',
      gender: 'FEMALE'
    },
  ]
};

// Tipe untuk ref react-pageflip
interface PageFlipMethods {
  flipPrev: () => void;
  flipNext: () => void;
  turnToPage: (page: number) => void;
  getPageCount: () => number;
  getCurrentPageIndex: () => number;
}

interface PageFlip {
  pageFlip: () => PageFlipMethods;
}

interface BookPageEvent {
  data: number;
}

export default function BaniStoryPage() {
  const [currentBani, setCurrentBani] = useState<Bani>(dummyLevels[0]);
  const [currentBaniData, setCurrentBaniData] = useState<BaniStory>(dummyData);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('landscape');
  const bookRef = useRef<PageFlip | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Ubah orientasi berdasarkan lebar layar
      if (window.innerWidth < 768) {
        setOrientation('portrait');
      } else {
        setOrientation('landscape');
      }
    };
    
    // Set orientasi awal
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Simulasi loading data saat memilih bani
    const fetchBaniData = async () => {
      setIsLoading(true);
      try {
        // Kode untuk fetch data dari API
        // Untuk sekarang gunakan dummy data
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulasi network delay
        setCurrentBaniData({
          ...dummyData,
          name: currentBani.name
        });
        
        // Tunggu sedikit untuk memastikan referensi bookRef sudah ter-render
        setTimeout(() => {
          // Reset ke halaman pertama jika book sudah terinisialisasi
          if (bookRef.current && bookRef.current.pageFlip) {
            try {
              bookRef.current.pageFlip().turnToPage(0);
            } catch (err) {
              console.log('Book not fully initialized yet, will reset on next render');
            }
          }
          setIsLoading(false);
        }, 100);
      } catch (error) {
        console.error("Gagal mengambil data bani:", error);
        showToast('error', 'Gagal mengambil data bani, silakan coba lagi nanti');
        setIsLoading(false);
      }
    };

    fetchBaniData();
  }, [currentBani.id]);

  // Menentukan ukuran buku berdasarkan ukuran layar dan orientasi
  const getBookSize = () => {
    if (orientation === 'portrait') {
      if (windowWidth < 640) { // Mobile portrait
        return { width: 300, height: 450 };
      } else { // Tablet/desktop portrait
        return { width: 380, height: 570 };
      }
    } else { // Landscape
      if (windowWidth < 640) { // Mobile landscape
        return { width: 450, height: 300 };
      } else if (windowWidth < 1024) { // Tablet landscape
        return { width: 550, height: 367 };
      } else { // Desktop landscape
        return { width: 650, height: 433 };
      }
    }
  };

  const { width, height } = getBookSize();

  // Filter bani berdasarkan pencarian
  const filteredBanis = dummyLevels.filter(bani => 
    bani.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLevelChange = (baniId: string) => {
    const selectedBani = dummyLevels.find(level => level.id === baniId);
    if (selectedBani) {
      setCurrentBani(selectedBani);
    }
  };

  // Menghitung jumlah halaman berdasarkan konten cerita
  const calculateStoryPages = () => {
    // Mengurangi jumlah karakter per halaman untuk memastikan muat di halaman
    const charsPerPage = orientation === 'portrait' ? 250 : 400; // Kurangi lagi jumlah karakter per halaman
    // Menghitung berdasarkan paragraf untuk pembagian yang lebih natural
    const paragraphs = currentBaniData.story.split('\n\n');
    let pages = [];
    let currentPage = '';
    
    for (const paragraph of paragraphs) {
      // Jika paragraf ini ditambahkan akan melebihi batas karakter per halaman
      if (currentPage.length + paragraph.length > charsPerPage) {
        // Simpan halaman saat ini dan mulai halaman baru
        pages.push(currentPage);
        currentPage = paragraph;
      } else {
        // Tambahkan paragraf ke halaman saat ini
        currentPage = currentPage ? `${currentPage}\n\n${paragraph}` : paragraph;
      }
    }
    
    // Tambahkan halaman terakhir jika ada
    if (currentPage) {
      pages.push(currentPage);
    }
    
    return pages.length;
  };

  const storyPages = calculateStoryPages();

  // Membagi cerita menjadi beberapa halaman
  const getStoryChunk = (index: number) => {
    // Mengurangi jumlah karakter per halaman untuk memastikan muat di halaman
    const charsPerPage = orientation === 'portrait' ? 250 : 400;
    const paragraphs = currentBaniData.story.split('\n\n');
    let pages = [];
    let currentPage = '';
    
    for (const paragraph of paragraphs) {
      // Jika paragraf ini ditambahkan akan melebihi batas karakter per halaman
      if (currentPage.length + paragraph.length > charsPerPage) {
        // Simpan halaman saat ini dan mulai halaman baru
        pages.push(currentPage);
        currentPage = paragraph;
      } else {
        // Tambahkan paragraf ke halaman saat ini
        currentPage = currentPage ? `${currentPage}\n\n${paragraph}` : paragraph;
      }
    }
    
    // Tambahkan halaman terakhir jika ada
    if (currentPage) {
      pages.push(currentPage);
    }
    
    return index < pages.length ? pages[index] : '';
  };

  // Navigasi buku
  const handlePrevPage = () => {
    try {
      if (bookRef.current && bookRef.current.pageFlip) {
        const pageFlipObj = bookRef.current.pageFlip();
        if (pageFlipObj && typeof pageFlipObj.flipPrev === 'function') {
          pageFlipObj.flipPrev();
        }
      }
    } catch (error) {
      console.error('Error flipping to previous page:', error);
    }
  };

  const handleNextPage = () => {
    try {
      if (bookRef.current && bookRef.current.pageFlip) {
        const pageFlipObj = bookRef.current.pageFlip();
        if (pageFlipObj && typeof pageFlipObj.flipNext === 'function') {
          pageFlipObj.flipNext();
        }
      }
    } catch (error) {
      console.error('Error flipping to next page:', error);
    }
  };

  // Saat page flip
  const onPageFlip = (e: BookPageEvent) => {
    try {
      if (e && typeof e.data === 'number') {
        setPageNumber(e.data);
      }
    } catch (error) {
      console.error('Error handling page flip:', error);
    }
  };

  // Saat buku dimuat
  const onInit = () => {
    try {
      if (bookRef.current && bookRef.current.pageFlip) {
        const pageFlipObj = bookRef.current.pageFlip();
        if (pageFlipObj) {
          const pageCount = pageFlipObj.getPageCount();
          setTotalPages(pageCount);
          // Perbarui pageNumber setelah inisialisasi
          setPageNumber(pageFlipObj.getCurrentPageIndex());
        }
      }
    } catch (error) {
      console.log('Book initialization in progress...');
      // Coba lagi setelah sedikit delay
      setTimeout(() => {
        try {
          if (bookRef.current && bookRef.current.pageFlip) {
            const pageCount = bookRef.current.pageFlip().getPageCount();
            setTotalPages(pageCount);
          }
        } catch (err) {
          console.error('Failed to initialize book:', err);
        }
      }, 500);
    }
  };

  // Navigasi ke bani anak
  const navigateToChildBani = (childId: string) => {
    const childBani = dummyLevels.find(bani => bani.id === childId);
    if (childBani) {
      handleLevelChange(childId);
      showToast('info', `Menuju buku ${childBani.name}`);
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Tidak tersedia';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Menghitung usia
  const calculateAge = (birthDate: string, deathDate: string | null): string => {
    if (!birthDate) return 'Tidak tersedia';
    
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    
    let age = end.getFullYear() - birth.getFullYear();
    const m = end.getMonth() - birth.getMonth();
    
    if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    
    return `${age} tahun`;
  };

  const baniSurname = currentBaniData.name.split(' ').slice(1).join(' ');
  
  return (
    <div className="min-h-screen bg-[#f9f5ea] pb-12">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb dan judul halaman */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              { title: 'Beranda', href: '/dashboard' },
              { title: 'Buku Kita', href: '/bani-story' },
            ]}
          />
          <h1 className="text-3xl font-bold mt-4 mb-2 text-gray-800 dark:text-white">
            Buku Kita
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-4xl">
            Cerita tentang {currentBani.name} untuk kenangan tak terputus.
          </p>
        </div>

        {/* Pemilihan & Pencarian Bani */}
        <div className="max-w-md mx-auto mb-8">
          <label htmlFor="baniSelect" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            Memilih kategori:
          </label>
          <div className="relative">
            <Select
              id="baniSelect"
              value={filteredBanis.find(bani => bani.id === currentBani.id)}
              options={filteredBanis.map(bani => ({
                value: bani.id,
                label: `${bani.name} (Tingkat ${bani.level})`
              }))}
              onChange={(selected: any) => handleLevelChange(selected.value)}
              className="w-full"
              isSearchable
              onInputChange={(value: string) => setSearchTerm(value)}
              placeholder="Pilih atau cari bani..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <IconSearch className="h-5 w-5 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Kontrol buku dan indikator halaman */}
        <div className="flex justify-between items-center mb-6 max-w-3xl mx-auto">
          <Button 
            variant="outline"
            color="secondary"
            icon={<IconArrowLeft />}
            onClick={handlePrevPage}
            disabled={pageNumber === 0 || isLoading}
          >
            Sebelumnya
          </Button>
          
          <span className="text-gray-600 dark:text-gray-400 font-serif">
            {isLoading ? 'Memuat...' : `Halaman ${pageNumber + 1} dari ${totalPages}`}
          </span>
          
          <Button 
            variant="outline"
            color="secondary"
            icon={<IconArrowRight />}
            iconPosition="right"
            onClick={handleNextPage}
            disabled={pageNumber === totalPages - 1 || isLoading}
          >
            Selanjutnya
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-amber-700"></div>
          </div>
        ) : (
          /* Buku flip */
          <div className="flex justify-center my-8 mx-auto relative">
            {/* Efek bayangan buku */}
            <div className="book-shadow"></div>
            
            {/* Punggung buku (hanya tampil di mode landscape) */}
            {orientation === 'landscape' && <div className="book-spine"></div>}
            
            <HTMLFlipBook
              width={width}
              height={height}
              size="fixed"
              minWidth={280}
              useMouseEvents={true}
              swipeDistance={0}
              showPageCorners={true}
              disableFlipByClick={false}
              usePortrait={false}
              startZIndex={0}
              autoSize={true}
              clickEventForward={true}
              maxWidth={1000}
              minHeight={400}
              maxHeight={1000}
              showCover={true}
              mobileScrollSupport={true}
              onFlip={onPageFlip}
              onInit={onInit}
              className="book-container shadow-2xl book-effect"
              ref={bookRef}
              drawShadow={true}
              flippingTime={800}
              maxShadowOpacity={0.7}
              startPage={0}
              style={{
                backgroundImage: 'linear-gradient(to right, #eee7d7, #fffbf0)'
              }}
            >
              {/* Cover depan */}
              <BookCover position="top">
                <OrnamentalDivider symbol="❦" className="mb-12 mt-6" />
                
                <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#f5edd0] text-center mb-12">
                  BANI {baniSurname}
                </h1>
                
                <OrnamentalDivider symbol="✤" className="mb-auto" />
                
                <div className="text-[#f5edd0] text-center mt-auto flex flex-col justify-center">
                  <p className="text-sm md:text-base font-arabic text-center mx-auto max-w-md my-6">
                    تَعَلَّمُوا مِنْ أَنْسَابِكُمْ مَا تَصِلُونَ بِهِ أَرْحَامَكُمْ فَإِنَّ صِلَةَ الرَّحِمِ مَحَبَّةٌ فِي الأَهْلِ مَثْرَاةٌ فِي الْمَالِ مَنْسَأَةٌ فِي الأَثَرِ
                  </p>
                  <p className="text-xs md:text-sm italic max-w-xs mx-auto">
                    "Pelajarilah nasab-nasab (silsilah) kalian yang dengannya kalian dapat menyambung silaturahmi, karena silaturahmi menimbulkan kecintaan dalam keluarga, menambah harta, dan memperpanjang umur." (HR. Tirmidzi)
                  </p>
                  <OrnamentalDivider symbol="❧" className="mt-4" />
                </div>
              </BookCover>

              {/* Halaman judul dalam */}
              <BookPage number={1} hardCover={true}>
                <div className="h-full flex flex-col items-center justify-center text-center p-4 overflow-hidden">
                  <div className="page-fold"></div>
                  <h1 className="text-3xl sm:text-4xl font-bold font-serif text-gray-800 mb-6">
                    {currentBaniData.name}
                  </h1>
                  
                  <div className="w-24 h-1 bg-amber-800 mb-8"></div>
                  
                  <div className="flex justify-center space-x-8 mb-8">
                    <div className="text-center">
                      <ProfileImage 
                        src={currentBaniData.husbandPhoto} 
                        alt={currentBaniData.husbandName}
                        size={orientation === 'portrait' ? 90 : 120}
                        className="mb-2"
                      />
                      <p className="text-sm text-gray-600">{currentBaniData.husbandName}</p>
                    </div>
                    <div className="text-center">
                      <ProfileImage 
                        src={currentBaniData.wifePhoto} 
                        alt={currentBaniData.wifeName}
                        size={orientation === 'portrait' ? 90 : 120}
                        className="mb-2"
                      />
                      <p className="text-sm text-gray-600">{currentBaniData.wifeName}</p>
                    </div>
                  </div>
                  
                  <p className="text-md text-gray-600 italic font-serif mb-8">
                    "Setiap keluarga memiliki cerita untuk diceritakan"
                  </p>
                  
                  <div className="mt-auto text-sm text-gray-500">
                    <p>Ditulis dan disusun dengan penuh kasih</p>
                  </div>
                </div>
              </BookPage>

              {/* Halaman foto keluarga dan awal cerita */}
              <BookPage number={2}>
                <div className="h-full flex flex-col p-4 overflow-hidden">
                  <div className="page-fold"></div>
                  <h2 className="text-xl md:text-2xl font-serif text-center mb-4">
                    Cerita {currentBaniData.name}
                  </h2>
                  
                  <div className="mb-4 flex justify-center">
                    <FamilyImage 
                      src={currentBaniData.photos[0]} 
                      alt={`Foto keluarga ${currentBaniData.name}`}
                      width={orientation === 'portrait' ? 220 : 300}
                      height={orientation === 'portrait' ? 140 : 180}
                      className="mx-auto"
                    />
                  </div>
                  
                  <div className="prose prose-sm dark:prose-invert max-w-none overflow-hidden
                    first-letter:text-3xl first-letter:font-bold 
                    first-letter:float-left first-letter:mr-3 flex-grow">
                    <p className="text-justify text-sm leading-relaxed">
                      {getStoryChunk(0)}
                    </p>
                  </div>
                  
                  <div className="page-footer mt-auto pt-2 border-t border-amber-100">
                    <span className="text-center block">{3}</span>
                  </div>
                </div>
              </BookPage>

              {/* Halaman-halaman cerita */}
              {Array.from({ length: Math.max(0, storyPages - 1) }).map((_, index) => (
                <BookPage key={`story-${index + 1}`} number={index + 3}>
                  <div className="h-full flex flex-col p-4 overflow-hidden">
                    <div className="page-fold"></div>
                    <h2 className="text-xl md:text-2xl font-serif text-center mb-4">
                      Cerita {currentBaniData.name}
                    </h2>
                    
                    {index === 1 && index < currentBaniData.photos.length - 1 && (
                      <div className="mb-4 flex justify-center">
                        <FamilyImage 
                          src={currentBaniData.photos[index + 1]} 
                          alt={`Foto keluarga ${currentBaniData.name}`}
                          width={orientation === 'portrait' ? 220 : 300}
                          height={orientation === 'portrait' ? 140 : 180}
                          className="mx-auto"
                        />
                      </div>
                    )}
                    
                    <div className="prose prose-sm dark:prose-invert max-w-none overflow-hidden flex-grow">
                      <p className="text-justify text-sm leading-relaxed">
                        {getStoryChunk(index + 1)}
                      </p>
                    </div>
                    
                    <div className="page-footer mt-auto pt-2 border-t border-amber-100">
                      <span className="text-center block">{index + 4}</span>
                    </div>
                  </div>
                </BookPage>
              ))}

              {/* Halaman biodata lengkap */}
              <BookPage number={storyPages + 2}>
                <div className="h-full flex flex-col p-4 overflow-hidden">
                  <div className="page-fold"></div>
                  <h2 className="text-xl md:text-2xl font-serif text-center mb-4">
                    Biodata {currentBaniData.name}
                  </h2>
                  
                  <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-4">
                    <div className="text-center">
                      <ProfileImage 
                        src={currentBaniData.husbandPhoto} 
                        alt={currentBaniData.husbandName}
                        size={orientation === 'portrait' ? 100 : 130}
                        className="mx-auto mb-4"
                      />
                      <h3 className="font-semibold text-md md:text-lg mb-2">{currentBaniData.husbandName}</h3>
                      <ul className="text-xs md:text-sm text-gray-600 space-y-1 text-left">
                        <li><span className="font-medium">Lahir:</span> {formatDate(currentBaniData.husbandBirthDate)} di {currentBaniData.husbandBirthPlace}</li>
                        {currentBaniData.husbandDeathDate && (
                          <li><span className="font-medium">Wafat:</span> {formatDate(currentBaniData.husbandDeathDate)}</li>
                        )}
                        <li><span className="font-medium">Usia:</span> {calculateAge(currentBaniData.husbandBirthDate, currentBaniData.husbandDeathDate)}</li>
                      </ul>
                    </div>
                    <div className="text-center">
                      <ProfileImage 
                        src={currentBaniData.wifePhoto} 
                        alt={currentBaniData.wifeName}
                        size={orientation === 'portrait' ? 100 : 130}
                        className="mx-auto mb-4"
                      />
                      <h3 className="font-semibold text-md md:text-lg mb-2">{currentBaniData.wifeName}</h3>
                      <ul className="text-xs md:text-sm text-gray-600 space-y-1 text-left">
                        <li><span className="font-medium">Lahir:</span> {formatDate(currentBaniData.wifeBirthDate)} di {currentBaniData.wifeBirthPlace}</li>
                        {currentBaniData.wifeDeathDate && (
                          <li><span className="font-medium">Wafat:</span> {formatDate(currentBaniData.wifeDeathDate)}</li>
                        )}
                        <li><span className="font-medium">Usia:</span> {calculateAge(currentBaniData.wifeBirthDate, currentBaniData.wifeDeathDate)}</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="text-center mb-4">
                    <p className="text-xs md:text-sm"><span className="font-medium">Menikah pada:</span> {formatDate(currentBaniData.marriageDate)}</p>
                    <p className="text-xs md:text-sm"><span className="font-medium">Jumlah anak:</span> {currentBaniData.children.length} orang</p>
                  </div>
                  
                  <OrnamentalDivider symbol="✿" className="my-2" />
                  
                  <div className="page-footer mt-auto pt-2 border-t border-amber-100">
                    <span className="text-center block">{storyPages + 3}</span>
                  </div>
                </div>
              </BookPage>

              {/* Halaman putra-putri */}
              <BookPage number={storyPages + 3}>
                <div className="h-full flex flex-col p-4 overflow-hidden">
                  <div className="page-fold"></div>
                  <h2 className="text-xl md:text-2xl font-serif text-center mb-4">
                    Putra-Putri dari {currentBaniData.name}
                  </h2>
                  
                  <div className={`grid ${orientation === 'portrait' ? 'grid-cols-2 gap-3' : 'grid-cols-2 gap-4'} flex-grow`}>
                    {currentBaniData.children.map((child) => (
                      <ChildCard 
                        key={child.id}
                        child={child}
                        onClick={navigateToChildBani}
                      />
                    ))}
                  </div>
                  
                  <OrnamentalDivider symbol="❧" className="mt-auto mb-2" />
                  
                  <div className="page-footer mt-auto pt-2 border-t border-amber-100">
                    <span className="text-center block">{storyPages + 4}</span>
                  </div>
                </div>
              </BookPage>

              {/* Cover belakang */}
              <BookCover bgColor="from-amber-900 to-amber-800" position="bottom">
                <div className="text-center h-full flex flex-col justify-between py-8">
                  <div className="text-[#f5edd0]">
                    <OrnamentalDivider symbol="❦" className="mb-8" />
                    <h2 className="text-2xl font-serif italic mb-4">
                      Bani {baniSurname}
                    </h2>
                    <p className="text-sm max-w-sm mx-auto mb-4">
                      "Mengenang masa lalu untuk menginspirasi masa depan"
                    </p>
                  </div>
                  
                  <div className="text-[#f5edd0]/80 mt-auto text-sm">
                    <p>© {new Date().getFullYear()} Bani Web</p>
                    <p className="mt-2">Melestarikan sejarah keluarga</p>
                    <OrnamentalDivider symbol="✤" className="mt-4" />
                  </div>
                </div>
              </BookCover>
            </HTMLFlipBook>
          </div>
        )}
      </div>
    </div>
  );
}
// end of frontend/app/(main)/bani-story/page.tsx