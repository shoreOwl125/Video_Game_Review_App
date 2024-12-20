export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  profile_pic: string | null;
  theme_preference: 'light' | 'dark';
  user_data_id: number | null;
  created_at: Date;
  updated_at: Date;
}
