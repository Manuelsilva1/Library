export interface User {
  id?: any; // Can be number (from backend Long) or string
  email: string;
  fullName?: string;
  token?: string; // For storing JWT token
  roles?: string[]; // Para almacenar los roles del usuario
  // Backend User also has createdAt, updatedAt but not strictly needed on client unless used
}
