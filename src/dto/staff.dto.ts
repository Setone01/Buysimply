export interface Staff {
  email: string;
  password: string;
  role: 'admin' | 'superAdmin' | 'staff';
}