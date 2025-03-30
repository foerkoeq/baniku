// start of backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Cek apakah super admin sudah ada
    const existingSuperAdmin = await prisma.user.findFirst({
      where: {
        role: 'SUPER_ADMIN'
      }
    });

    if (!existingSuperAdmin) {
      // Hash password
      const hashedPassword = await bcrypt.hash('superadmin123', 10);

      // Buat super admin
      await prisma.user.create({
        data: {
          username: 'superadmin',
          email: 'superadmin@baniweb.com',
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          isActive: true
        }
      });

      console.log('Super Admin berhasil dibuat');
    } else {
      console.log('Super Admin sudah ada');
    }

    // Tambahkan data provinsi dan kota
    await seedProvincesAndCities();

  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

async function seedProvincesAndCities() {
  // Cek apakah data provinsi sudah ada
  const provinceCount = await prisma.province.count();
  
  if (provinceCount > 0) {
    console.log('Data provinsi dan kota sudah ada, melewati proses seeding...');
    return;
  }

  console.log('Mulai mengimpor data provinsi dan kota...');

  // Data Provinsi Indonesia
  const provincesData = [
    { name: 'Aceh', cities: ['Banda Aceh', 'Langsa', 'Lhokseumawe', 'Sabang', 'Subulussalam', 'Aceh Barat', 'Aceh Barat Daya', 'Aceh Besar', 'Aceh Jaya', 'Aceh Selatan', 'Aceh Singkil', 'Aceh Tamiang', 'Aceh Tengah', 'Aceh Tenggara', 'Aceh Timur', 'Aceh Utara', 'Bener Meriah', 'Bireuen', 'Gayo Lues', 'Nagan Raya', 'Pidie', 'Pidie Jaya', 'Simeulue'] },
    { name: 'Sumatera Utara', cities: ['Medan', 'Binjai', 'Gunungsitoli', 'Padang Sidempuan', 'Pematangsiantar', 'Sibolga', 'Tanjungbalai', 'Tebing Tinggi', 'Asahan', 'Batu Bara', 'Dairi', 'Deli Serdang', 'Humbang Hasundutan', 'Karo', 'Labuhanbatu', 'Labuhanbatu Selatan', 'Labuhanbatu Utara', 'Langkat', 'Mandailing Natal', 'Nias', 'Nias Barat', 'Nias Selatan', 'Nias Utara', 'Padang Lawas', 'Padang Lawas Utara', 'Pakpak Bharat', 'Samosir', 'Serdang Bedagai', 'Simalungun', 'Tapanuli Selatan', 'Tapanuli Tengah', 'Tapanuli Utara', 'Toba Samosir'] },
    { name: 'Sumatera Barat', cities: ['Padang', 'Bukittinggi', 'Padang Panjang', 'Pariaman', 'Payakumbuh', 'Sawahlunto', 'Solok', 'Agam', 'Dharmasraya', 'Kepulauan Mentawai', 'Lima Puluh Kota', 'Padang Pariaman', 'Pasaman', 'Pasaman Barat', 'Pesisir Selatan', 'Sijunjung', 'Solok', 'Solok Selatan', 'Tanah Datar'] },
    { name: 'Riau', cities: ['Pekanbaru', 'Dumai', 'Bengkalis', 'Indragiri Hilir', 'Indragiri Hulu', 'Kampar', 'Kepulauan Meranti', 'Kuantan Singingi', 'Pelalawan', 'Rokan Hilir', 'Rokan Hulu', 'Siak'] },
    { name: 'Jambi', cities: ['Jambi', 'Sungai Penuh', 'Batanghari', 'Bungo', 'Kerinci', 'Merangin', 'Muaro Jambi', 'Sarolangun', 'Tanjung Jabung Barat', 'Tanjung Jabung Timur', 'Tebo'] },
    { name: 'Sumatera Selatan', cities: ['Palembang', 'Lubuklinggau', 'Pagar Alam', 'Prabumulih', 'Banyuasin', 'Empat Lawang', 'Lahat', 'Muara Enim', 'Musi Banyuasin', 'Musi Rawas', 'Musi Rawas Utara', 'Ogan Ilir', 'Ogan Komering Ilir', 'Ogan Komering Ulu', 'Ogan Komering Ulu Selatan', 'Ogan Komering Ulu Timur', 'Penukal Abab Lematang Ilir'] },
    { name: 'Bengkulu', cities: ['Bengkulu', 'Bengkulu Selatan', 'Bengkulu Tengah', 'Bengkulu Utara', 'Kaur', 'Kepahiang', 'Lebong', 'Muko Muko', 'Rejang Lebong', 'Seluma'] },
    { name: 'Lampung', cities: ['Bandar Lampung', 'Metro', 'Lampung Barat', 'Lampung Selatan', 'Lampung Tengah', 'Lampung Timur', 'Lampung Utara', 'Mesuji', 'Pesawaran', 'Pesisir Barat', 'Pringsewu', 'Tanggamus', 'Tulang Bawang', 'Tulang Bawang Barat', 'Way Kanan'] },
    { name: 'Kepulauan Bangka Belitung', cities: ['Pangkalpinang', 'Bangka', 'Bangka Barat', 'Bangka Selatan', 'Bangka Tengah', 'Belitung', 'Belitung Timur'] },
    { name: 'Kepulauan Riau', cities: ['Tanjungpinang', 'Batam', 'Bintan', 'Karimun', 'Kepulauan Anambas', 'Lingga', 'Natuna'] },
    { name: 'DKI Jakarta', cities: ['Jakarta Pusat', 'Jakarta Barat', 'Jakarta Selatan', 'Jakarta Timur', 'Jakarta Utara', 'Kepulauan Seribu'] },
    { name: 'Jawa Barat', cities: ['Bandung', 'Banjar', 'Bekasi', 'Bogor', 'Cimahi', 'Cirebon', 'Depok', 'Sukabumi', 'Tasikmalaya', 'Bandung Barat', 'Bekasi', 'Bogor', 'Ciamis', 'Cianjur', 'Cirebon', 'Garut', 'Indramayu', 'Karawang', 'Kuningan', 'Majalengka', 'Pangandaran', 'Purwakarta', 'Subang', 'Sukabumi', 'Sumedang', 'Tasikmalaya'] },
    { name: 'Jawa Tengah', cities: ['Semarang', 'Magelang', 'Pekalongan', 'Salatiga', 'Surakarta', 'Tegal', 'Banjarnegara', 'Banyumas', 'Batang', 'Blora', 'Boyolali', 'Brebes', 'Cilacap', 'Demak', 'Grobogan', 'Jepara', 'Karanganyar', 'Kebumen', 'Kendal', 'Klaten', 'Kudus', 'Magelang', 'Pati', 'Pekalongan', 'Pemalang', 'Purbalingga', 'Purworejo', 'Rembang', 'Semarang', 'Sragen', 'Sukoharjo', 'Tegal', 'Temanggung', 'Wonogiri', 'Wonosobo'] },
    { name: 'DI Yogyakarta', cities: ['Yogyakarta', 'Bantul', 'Gunungkidul', 'Kulon Progo', 'Sleman'] },
    { name: 'Jawa Timur', cities: ['Surabaya', 'Batu', 'Blitar', 'Kediri', 'Madiun', 'Malang', 'Mojokerto', 'Pasuruan', 'Probolinggo', 'Bangkalan', 'Banyuwangi', 'Blitar', 'Bojonegoro', 'Bondowoso', 'Gresik', 'Jember', 'Jombang', 'Kediri', 'Lamongan', 'Lumajang', 'Madiun', 'Magetan', 'Malang', 'Mojokerto', 'Nganjuk', 'Ngawi', 'Pacitan', 'Pamekasan', 'Pasuruan', 'Ponorogo', 'Probolinggo', 'Sampang', 'Sidoarjo', 'Situbondo', 'Sumenep', 'Trenggalek', 'Tuban', 'Tulungagung'] },
    { name: 'Banten', cities: ['Serang', 'Cilegon', 'Tangerang', 'Tangerang Selatan', 'Lebak', 'Pandeglang', 'Serang', 'Tangerang'] },
    { name: 'Bali', cities: ['Denpasar', 'Badung', 'Bangli', 'Buleleng', 'Gianyar', 'Jembrana', 'Karangasem', 'Klungkung', 'Tabanan'] },
    { name: 'Nusa Tenggara Barat', cities: ['Mataram', 'Bima', 'Bima', 'Dompu', 'Lombok Barat', 'Lombok Tengah', 'Lombok Timur', 'Lombok Utara', 'Sumbawa', 'Sumbawa Barat'] },
    { name: 'Nusa Tenggara Timur', cities: ['Kupang', 'Alor', 'Belu', 'Ende', 'Flores Timur', 'Kupang', 'Lembata', 'Malaka', 'Manggarai', 'Manggarai Barat', 'Manggarai Timur', 'Nagekeo', 'Ngada', 'Rote Ndao', 'Sabu Raijua', 'Sikka', 'Sumba Barat', 'Sumba Barat Daya', 'Sumba Tengah', 'Sumba Timur', 'Timor Tengah Selatan', 'Timor Tengah Utara'] },
    { name: 'Kalimantan Barat', cities: ['Pontianak', 'Singkawang', 'Bengkayang', 'Kapuas Hulu', 'Kayong Utara', 'Ketapang', 'Kubu Raya', 'Landak', 'Melawi', 'Mempawah', 'Sambas', 'Sanggau', 'Sekadau', 'Sintang'] },
    { name: 'Kalimantan Tengah', cities: ['Palangka Raya', 'Barito Selatan', 'Barito Timur', 'Barito Utara', 'Gunung Mas', 'Kapuas', 'Katingan', 'Kotawaringin Barat', 'Kotawaringin Timur', 'Lamandau', 'Murung Raya', 'Pulang Pisau', 'Sukamara', 'Seruyan'] },
    { name: 'Kalimantan Selatan', cities: ['Banjarmasin', 'Banjarbaru', 'Balangan', 'Banjar', 'Barito Kuala', 'Hulu Sungai Selatan', 'Hulu Sungai Tengah', 'Hulu Sungai Utara', 'Kotabaru', 'Tabalong', 'Tanah Bumbu', 'Tanah Laut', 'Tapin'] },
    { name: 'Kalimantan Timur', cities: ['Samarinda', 'Balikpapan', 'Bontang', 'Berau', 'Kutai Barat', 'Kutai Kartanegara', 'Kutai Timur', 'Mahakam Ulu', 'Paser', 'Penajam Paser Utara'] },
    { name: 'Kalimantan Utara', cities: ['Tanjung Selor', 'Tarakan', 'Bulungan', 'Malinau', 'Nunukan', 'Tana Tidung'] },
    { name: 'Sulawesi Utara', cities: ['Manado', 'Bitung', 'Kotamobagu', 'Tomohon', 'Bolaang Mongondow', 'Bolaang Mongondow Selatan', 'Bolaang Mongondow Timur', 'Bolaang Mongondow Utara', 'Kepulauan Sangihe', 'Kepulauan Siau Tagulandang Biaro', 'Kepulauan Talaud', 'Minahasa', 'Minahasa Selatan', 'Minahasa Tenggara', 'Minahasa Utara'] },
    { name: 'Sulawesi Tengah', cities: ['Palu', 'Banggai', 'Banggai Kepulauan', 'Banggai Laut', 'Buol', 'Donggala', 'Morowali', 'Morowali Utara', 'Parigi Moutong', 'Poso', 'Sigi', 'Tojo Una-Una', 'Tolitoli'] },
    { name: 'Sulawesi Selatan', cities: ['Makassar', 'Palopo', 'Parepare', 'Bantaeng', 'Barru', 'Bone', 'Bulukumba', 'Enrekang', 'Gowa', 'Jeneponto', 'Kepulauan Selayar', 'Luwu', 'Luwu Timur', 'Luwu Utara', 'Maros', 'Pangkajene dan Kepulauan', 'Pinrang', 'Sidenreng Rappang', 'Sinjai', 'Soppeng', 'Takalar', 'Tana Toraja', 'Toraja Utara', 'Wajo'] },
    { name: 'Sulawesi Tenggara', cities: ['Kendari', 'Baubau', 'Bombana', 'Buton', 'Buton Selatan', 'Buton Tengah', 'Buton Utara', 'Kolaka', 'Kolaka Timur', 'Kolaka Utara', 'Konawe', 'Konawe Kepulauan', 'Konawe Selatan', 'Konawe Utara', 'Muna', 'Muna Barat', 'Wakatobi'] },
    { name: 'Gorontalo', cities: ['Gorontalo', 'Boalemo', 'Bone Bolango', 'Gorontalo', 'Gorontalo Utara', 'Pohuwato'] },
    { name: 'Sulawesi Barat', cities: ['Mamuju', 'Majene', 'Mamasa', 'Mamuju Tengah', 'Pasangkayu', 'Polewali Mandar'] },
    { name: 'Maluku', cities: ['Ambon', 'Tual', 'Buru', 'Buru Selatan', 'Kepulauan Aru', 'Maluku Barat Daya', 'Maluku Tengah', 'Maluku Tenggara', 'Maluku Tenggara Barat', 'Seram Bagian Barat', 'Seram Bagian Timur'] },
    { name: 'Maluku Utara', cities: ['Sofifi', 'Ternate', 'Tidore Kepulauan', 'Halmahera Barat', 'Halmahera Tengah', 'Halmahera Timur', 'Halmahera Selatan', 'Halmahera Utara', 'Kepulauan Sula', 'Pulau Morotai', 'Pulau Taliabu'] },
    { name: 'Papua Barat', cities: ['Manokwari', 'Fakfak', 'Kaimana', 'Manokwari Selatan', 'Maybrat', 'Pegunungan Arfak', 'Raja Ampat', 'Sorong', 'Sorong Selatan', 'Tambrauw', 'Teluk Bintuni', 'Teluk Wondama'] },
    { name: 'Papua', cities: ['Jayapura', 'Asmat', 'Biak Numfor', 'Boven Digoel', 'Deiyai', 'Dogiyai', 'Intan Jaya', 'Jayapura', 'Jayawijaya', 'Keerom', 'Kepulauan Yapen', 'Lanny Jaya', 'Mamberamo Raya', 'Mamberamo Tengah', 'Mappi', 'Merauke', 'Mimika', 'Nabire', 'Nduga', 'Paniai', 'Pegunungan Bintang', 'Puncak', 'Puncak Jaya', 'Sarmi', 'Supiori', 'Tolikara', 'Waropen', 'Yahukimo', 'Yalimo'] },
    { name: 'Papua Selatan', cities: ['Merauke', 'Asmat', 'Boven Digoel', 'Mappi'] },
    { name: 'Papua Tengah', cities: ['Nabire', 'Deiyai', 'Dogiyai', 'Intan Jaya', 'Mimika', 'Paniai', 'Puncak', 'Puncak Jaya'] },
    { name: 'Papua Pegunungan', cities: ['Jayawijaya', 'Lanny Jaya', 'Mamberamo Tengah', 'Nduga', 'Pegunungan Bintang', 'Tolikara', 'Yahukimo', 'Yalimo'] }
  ];

  // Simpan provinsi dan kota
  for (const province of provincesData) {
    console.log(`Menambahkan provinsi: ${province.name}`);
    
    const createdProvince = await prisma.province.create({
      data: {
        name: province.name
      }
    });
    
    // Simpan kota untuk provinsi ini
    for (const cityName of province.cities) {
      await prisma.city.create({
        data: {
          name: cityName,
          provinceId: createdProvince.id
        }
      });
    }
    
    console.log(`Ditambahkan ${province.cities.length} kota/kabupaten untuk ${province.name}`);
  }

  console.log('Selesai mengimpor data provinsi dan kota');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
// end of backend/prisma/seed.ts