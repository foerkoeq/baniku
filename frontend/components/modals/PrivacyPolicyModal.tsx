// start of frontend/components/modals/PrivacyPolicyModal.tsx
import React from 'react';
import Modal from '@/components/ui/Modal';

interface PrivacyPolicyModalProps {
    open: boolean;
    onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ open, onClose }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            title="Kebijakan Privasi"
            size="xl"
        >
            <div className="prose dark:prose-invert max-w-none">
                <h2>Kebijakan Privasi Bani Web</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>

                <section className="mb-6">
                    <h3>1. Informasi yang Kami Kumpulkan</h3>
                    <p>
                        Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk:
                    </p>
                    <ul>
                        <li>Data pribadi (nama, tanggal lahir, alamat, dll)</li>
                        <li>Foto-foto keluarga</li>
                        <li>Informasi silsilah keluarga</li>
                        <li>Informasi kontak (email, nomor telepon)</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h3>2. Penggunaan Informasi</h3>
                    <p>
                        Informasi yang kami kumpulkan digunakan untuk:
                    </p>
                    <ul>
                        <li>Menyediakan dan memelihara silsilah keluarga</li>
                        <li>Menghubungkan antar anggota keluarga</li>
                        <li>Memberikan pembaruan tentang acara keluarga</li>
                        <li>Meningkatkan layanan kami</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h3>3. Perlindungan Data</h3>
                    <p>
                        Kami mengimplementasikan langkah-langkah keamanan yang ketat untuk melindungi data Anda:
                    </p>
                    <ul>
                        <li>Enkripsi data sensitif</li>
                        <li>Akses terbatas berdasarkan peran</li>
                        <li>Pemantauan keamanan berkelanjutan</li>
                        <li>Backup data regular</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h3>4. Berbagi Informasi</h3>
                    <p>
                        Kami tidak akan menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga 
                        tanpa izin Anda, kecuali jika diwajibkan oleh hukum.
                    </p>
                </section>

                <section className="mb-6">
                    <h3>5. Hak Pengguna</h3>
                    <p>
                        Anda memiliki hak untuk:
                    </p>
                    <ul>
                        <li>Mengakses data pribadi Anda</li>
                        <li>Memperbarui atau mengoreksi data Anda</li>
                        <li>Meminta penghapusan data Anda</li>
                        <li>Membatasi penggunaan data Anda</li>
                    </ul>
                </section>

                <section className="mb-6">
                    <h3>6. Perubahan Kebijakan</h3>
                    <p>
                        Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan signifikan 
                        akan diberitahukan melalui email atau pemberitahuan di aplikasi.
                    </p>
                </section>

                <section>
                    <h3>7. Kontak</h3>
                    <p>
                        Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi admin Bani.
                    </p>
                </section>
            </div>
        </Modal>
    );
};

export default PrivacyPolicyModal;
// end of frontend/components/modals/PrivacyPolicyModal.tsx