// Environment configuration for browser
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key',
    serviceRoleKey: import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY
  },
  emailJs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_2s6nrem',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_hri11x',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'imR8Q6_Cr0gNIga6Q'
  },
  app: {
    baseUrl: import.meta.env.VITE_BASE_URL || 'https://daleandkirsten.com',
    backupEncryptionKey: import.meta.env.BACKUP_ENCRYPTION_KEY || 'default-key'
  }
};