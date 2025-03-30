// Utils untuk perhitungan umur
const calculateAge = (birthDate, targetDate) => {
    if (!birthDate || !targetDate) return null;
    const birth = new Date(birthDate);
    const target = new Date(targetDate);
    return Math.floor((target - birth) / (365.25 * 24 * 60 * 60 * 1000));
  };
  
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };
  
  const generateStory = (person) => {
    let story = '';
    const genderPrefix = person.gender === 'MALE' ? 'bin' : 'binti';
  
    // Nama lengkap dan gelar
    story += `${person.titlePrefix ? person.titlePrefix + ' ' : ''}${person.fullName} ${genderPrefix} ${person.parent?.fullName || '(Nama Ayah)'}${person.titleSuffix ? ' ' + person.titleSuffix : ''}`;
    
    // Informasi kelahiran
    if (person.birthPlace || person.birthDate) {
      story += ` lahir`;
      if (person.birthPlace) story += ` di ${person.birthPlace}`;
      if (person.birthDate) story += ` pada ${formatDate(person.birthDate)}`;
      story += '.';
    }
  
    // Informasi pernikahan dan keluarga dalam satu paragraf
    if (person.maritalStatus && person.maritalStatus !== 'SINGLE') {
      const marriages = person.previousMarriages || [];
      
      story += ' ';  // Spasi untuk menghubungkan dengan kalimat sebelumnya
      
      // Pernikahan saat ini
      if (person.spouse && person.marriageDate) {
        const ageAtMarriage = calculateAge(person.birthDate, person.marriageDate);
        story += `${ageAtMarriage ? `Pada usia ${ageAtMarriage} tahun, ` : ''}${person.gender === 'MALE' ? 'menikah dengan' : 'dinikahi oleh'} ${person.spouse.fullName}`;
        story += ` pada ${formatDate(person.marriageDate)}. `;
      }
  
      // Pernikahan sebelumnya
      if (marriages.length > 0) {
        story += 'Sebelumnya, ';
        marriages.forEach((marriage, index) => {
          if (index > 0) story += ', dan ';
          story += `pernah ${person.gender === 'MALE' ? 'menikah dengan' : 'dinikahi oleh'} ${marriage.spouseName}`;
          if (marriage.marriageDate) story += ` pada ${formatDate(marriage.marriageDate)}`;
          
          if (marriage.isSpouseDeceased) {
            story += ` yang telah wafat`;
            if (marriage.divorceDate) story += ` pada ${formatDate(marriage.divorceDate)}`;
          } else if (marriage.isDivorced) {
            story += ` namun bercerai`;
            if (marriage.divorceDate) story += ` pada ${formatDate(marriage.divorceDate)}`;
          }
        });
        story += '. ';
      }
  
      // Informasi anak - dalam paragraf
      if (person.children && person.children.length > 0) {
        if (person.spouse) {
          story += `Dari pernikahan dengan ${person.spouse.fullName}`;
        }
        story += ` dikaruniai ${person.children.length === 1 ? 'seorang' : person.children.length} anak. `;
      } else {
        story += 'Hingga saat ini belum dikaruniai keturunan. ';
      }
  
      // Daftar anak dalam format list
      if (person.children && person.children.length > 0) {
        story += '\n\nPutra-putri beliau:\n';
        person.children.forEach((child, index) => {
          story += `${index + 1}. ${child.titlePrefix ? child.titlePrefix + ' ' : ''}${child.fullName}${child.titleSuffix ? ' ' + child.titleSuffix : ''}\n`;
        });
      }
    }
  
    // Informasi tempat tinggal
    if (person.address) {
      if (person.status === 'DECEASED') {
        story += `Semasa hidupnya bertempat tinggal di ${person.address}. `;
      } else {
        story += `Saat ini bertempat tinggal di ${person.address}. `;
      }
    }
  
    // Informasi kematian
    if (person.status === 'DECEASED' && person.deathDate) {
      story += `${person.fullName} telah wafat`;
      if (person.deathPlace) story += ` di ${person.deathPlace}`;
      story += ` pada ${formatDate(person.deathDate)}`;
      const ageAtDeath = calculateAge(person.birthDate, person.deathDate);
      if (ageAtDeath) story += ` dalam usia ${ageAtDeath} tahun`;
      story += '. ';
    }
  
    // Cerita tambahan jika ada
    if (person.story) {
      story += `\n\n${person.story}`;
    }
  
    return story;
  };
  
  module.exports = generateStory;