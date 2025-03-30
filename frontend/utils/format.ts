// start of frontend/utils/format.ts
export const formatPhoneNumber = (phone: string | null | undefined): string => {
    if (!phone) return '-';
    
    // Hapus semua karakter non-digit
    const cleaned = phone.replace(/\D/g, '');
    
    // Format nomor telepon Indonesia
    if (cleaned.startsWith('62')) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{4})(\d{4})/, '+$1 $2-$3-$4');
    }
    
    // Format untuk nomor yang dimulai dengan 0
    if (cleaned.startsWith('0')) {
      return cleaned.replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    
    return cleaned;
  };

  export const formatDate = (date: Date | string, format: 'short' | 'long' | 'full' = 'short'): string => {
    const d = new Date(date);
    
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta'
    };

    switch (format) {
        case 'long':
            options.weekday = 'long';
            options.day = 'numeric';
            options.month = 'long';
            options.year = 'numeric';
            break;
        case 'full':
            options.weekday = 'long';
            options.day = 'numeric';
            options.month = 'long';
            options.year = 'numeric';
            options.hour = '2-digit';
            options.minute = '2-digit';
            break;
        default: // short
            options.day = 'numeric';
            options.month = 'short';
            options.year = 'numeric';
    }

    return d.toLocaleString('id-ID', options);
};

  // end of frontend/utils/format.ts