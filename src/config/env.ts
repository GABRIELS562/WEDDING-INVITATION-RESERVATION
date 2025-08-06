// Environment configuration that works in browser
export const config = {
  googleSheets: {
    spreadsheetId: import.meta.env.VITE_GOOGLE_SHEET_ID || '1nsxR7ZJT2Zu1gC5jpXpNcy21KfU_fHk17lklK9uOTYc',
    apiKey: import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || 'AIzaSyDmGdJda-9ipoXnqrCm83HOPjmguy7fx1c',
    range: 'RSVP_Individual!A1:N'
  },
  emailJs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_2s6nrem',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_hri11x',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'imR8Q6_Cr0gNIga6Q'
  }
};

// Fallback for React env vars (in case Vite vars don't work)
if (typeof window !== 'undefined') {
  // @ts-ignore
  const reactEnv = window.env || {};
  
  if (!config.googleSheets.spreadsheetId && reactEnv.REACT_APP_GOOGLE_SPREADSHEET_ID) {
    config.googleSheets.spreadsheetId = reactEnv.REACT_APP_GOOGLE_SPREADSHEET_ID;
  }
  if (!config.googleSheets.apiKey && reactEnv.REACT_APP_GOOGLE_SHEETS_API_KEY) {
    config.googleSheets.apiKey = reactEnv.REACT_APP_GOOGLE_SHEETS_API_KEY;
  }
}