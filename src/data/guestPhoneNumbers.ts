// Guest phone numbers for WhatsApp invitations
// This is used for generating WhatsApp invitation links with proper contact numbers

export const guestPhoneNumbers: Record<string, string> = {
  'Allison': '071 212 1730',
  'Andrea': '061 282 5479',
  'Angelique': '079 145 5690',
  'Ashlee': '074 950 5291',
  'Audrey': '072 110 1146',
  'Brian': '082 694 5577',
  'Bridgette': '082 500 6338',
  'Candice': '083 577 1763',
  'Cheryl': '084 250 9446',
  'Cyril': '',
  'Debbie': '072 242 6503',
  'Derrick': '072 512 1990',
  'Emile': '083 613 5717',
  'Eustacia': '071 142 7229',
  'Gail': '079 282 0394',
  'Gladys': '',
  'Helen': '084 068 6900',
  'Husband Susan': '',
  'Ian': '081 319 9603',
  'Jenna': '060 677 6267',
  'Jill': '082 465 2724',
  'JP': '083 556 5287',
  'Judy': '078 538 6577',
  'Julian': '072 861 8679',
  'Kim': '083 729 5131',
  'Liam': '081 459 9747',
  'Luca': '',
  'Lyndon': '+96892374325',
  'Mark W': '',
  'Mark P': '079 452 8388',
  'Marlene': '084 608 9788',
  'Marlon M': '063 013 1491',
  'Moira': '072 196 9804',
  'Morgan': '',
  'Nicci': '074 023 8805',
  'Patty': '071 103 2411',
  'Portia': '062 763 1852',
  'Robynne': '076 164 1347',
  'Rylie': '078 650 2483',
  'Shaun': '072 482 6656',
  'Simone': '076 562 2515',
  'Spencer': '082 351 2554',
  'Stefan': '067 956 4535',
  'Susan': '063 698 6163',
  'Tania': '081 270 5888',
  'Tertia S': '+96892374325',
  'Trevor': '064 653 0546',
  'Trixie': '064 653 0546',
  'Victor': '',
  'Vanessa': '073 621 2568',
  'Duncan': '084 222 1383',
  'Berenice': '081 769 2341',
  'Tayla': '071 370 0061',
  'Lindsay': '0844803961',
  'Amari': '',
  'Ma': '0733555856',
  'Attie': '0784398077',
  'Virgy': '0825586631',
  'Jamie': '0722108714',
  'Tasmin': '072 826 4723',
  'Zac': '',
  'Tasneem': '0837301250',
  'Lameez': '0722821968',
  'Wesley': '072 545 5251',
  'Lindsay J': '0727103067',
  'Marlon K': '0826394205',
  'Rowena': '0783491939',
  'Ushrie': '073187785',
  'Smiley': '0613560391',
  'Jeremy': '0794421170',
  'Mauvina': '0721020328',
  'Arthur': '',
  'Michelle': '0835814128',
  'Stephan': '',
  'Sandra': '0824954931',
  'Norman': '',
  'Charmaine': '0847396725',
  'Monray': '0734475029',
  'Nicole': '0798896289',
  'June': '0725761296',
  'Dayne': '0719292323',
  'Tatum': '0730278750',
  'Warren': '0714303428',
  'Kelly': '0711742116',
  'Chadwin': '0611713760',
  'Tertia R': '0621230736',
  'Mike': '0604924034',
  'Liezel': '0843681550',
  'Sulaiman': '0825610807',
  'Thalia': '',
  'Pastor Granville': '0734460022',
  'Denise': '0825552782',
  'Craig': '0828730852',
  'Jermaine': '0825464813',
  'Toby': '0784165767',
  'Suzanne': '0627171510',
  'Ferdinand': '0824276360',
  'Megan': '0827024957',
  'Sven': '',
  'Mikail': '0680332997',
  'Lucien': '0606860631',
  'Dene': '',
  'Julie': '0673936529',
  'Tristan': '0712566444',
  'Skye': '',
  'Ruth': '',
  'Kirsten': '',
  'Dale': '',
  'DJ': '',
  'Photographer - Kyla': ''
};

// Format phone number for WhatsApp (remove spaces and add country code if needed)
export function formatPhoneForWhatsApp(phone: string): string {
  if (!phone) return '';
  
  // Remove all spaces and special characters
  let cleaned = phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
  
  // If it starts with 0, replace with +27 (South Africa)
  if (cleaned.startsWith('0')) {
    cleaned = '+27' + cleaned.substring(1);
  }
  
  // If it doesn't start with +, add +27
  if (!cleaned.startsWith('+')) {
    cleaned = '+27' + cleaned;
  }
  
  return cleaned;
}

// Get WhatsApp link for a guest
export function getGuestWhatsAppLink(guestName: string, message: string): string {
  const phone = guestPhoneNumbers[guestName] || '';
  if (!phone) {
    // Return link without phone number (will open WhatsApp contact picker)
    return `https://wa.me/?text=${encodeURIComponent(message)}`;
  }
  
  const formattedPhone = formatPhoneForWhatsApp(phone);
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}