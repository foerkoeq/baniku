const cookieObj = typeof window === 'undefined' ? require('next/headers') : require('universal-cookie');

import Cookies from 'js-cookie';
import en from './public/locales/en.json';

export const get = async () => {
    const i18nextLng = Cookies.get('i18nextLng');
    return i18nextLng || 'id'; // Default ke bahasa Indonesia
}

  export const getLang = async () => {
    return await get();
  }

export const getTranslation = () => {
    const lang = getLang();
    const data: any = en; // Menggunakan file en.json yang sudah diimpor

    const t = (key: string) => {
        return data[key] ? data[key] : key;
    };

    const initLocale = async (themeLocale: string) => {
        const lang = await getLang();
        i18n.changeLanguage(lang || themeLocale);
    };
    const i18n = {
        language: getLang(),
        changeLanguage: (lang: string) => {
            const cookies = new cookieObj(null, { path: '/' });
            cookies.set('i18nextLng', lang);
        },
    };

    return { t, i18n, initLocale };
};
