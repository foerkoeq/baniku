import IconPhone from '@/components/icon/icon-phone';
import IconMail from '@/components/icon/icon-mail';
import { TutorialVideo } from '@/components/help/VideoTutorial';
import { FaqItem } from '@/components/help/Faq';
import { ContactItem } from '@/components/help/Contact';
import React from 'react';

export const tutorialVideos: TutorialVideo[] = [
    {
        id: '1',
        title: 'Cara Menggunakan Silsilah',
        thumbnail: '/api/placeholder/400/250',
        videoUrl: 'URL_VIDEO_1'
    },
    {
        id: '2',
        title: 'Cara Menambah Anggota Keluarga',
        thumbnail: '/api/placeholder/400/250',
        videoUrl: 'URL_VIDEO_2'
    },
    {
        id: '3',
        title: 'Cara Mengelola Data Bani',
        thumbnail: '/api/placeholder/400/250',
        videoUrl: 'URL_VIDEO_3'
    }
];

export const faqItems: FaqItem[] = [
    {
        question: 'Bagaimana cara mendapatkan akun?',
        answer: 'Akun hanya bisa dibuat oleh Super Admin atau Admin Bani. Silakan hubungi Admin Bani Anda untuk mendapatkan akun.'
    },
    {
        question: 'Bagaimana jika lupa password?',
        answer: 'Klik tombol "Lupa Password" di halaman login, masukkan email yang terdaftar, dan ikuti instruksi yang dikirim ke email Anda.'
    },
    {
        question: 'Siapa yang bisa menambah anggota keluarga?',
        answer: 'Super Admin dapat menambah semua anggota. Admin Bani hanya bisa menambah anggota dalam Bani-nya.'
    },
    {
        question: 'Bagaimana cara mengubah data pribadi?',
        answer: 'Masuk ke menu profil, klik tombol edit, ubah data yang diinginkan, lalu simpan perubahan.'
    }
];

export const contactItems: ContactItem[] = [
    {
        icon: React.createElement(IconPhone, { className: "w-5 h-5" }),
        title: 'Telepon',
        value: '+62 812-3456-7890',
        link: 'tel:+6281234567890'
    },
    {
        icon: React.createElement(IconMail, { className: "w-5 h-5" }),
        title: 'Email',
        value: 'support@baniweb.com',
        link: 'mailto:support@baniweb.com'
    }
];