
/**
 * LogiTrack Master Configuration
 */

// 1. حدد نوع التطبيق للنسخة الحالية
export const APP_TYPE: 'USER' | 'ADMIN' | 'DRIVER' = 'USER'; 

// 2. إعدادات قاعدة البيانات (Supabase)
export const DB_CONFIG = {
  enabled: true, 
  url: 'https://zdcngosnxowrycqtmvkt.supabase.co', 
  key: 'sb_publishable_RhYLt_aihE-tIbliAM_Xcg_FCUOkTEz' 
};
