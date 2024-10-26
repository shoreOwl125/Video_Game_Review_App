export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  theme_preference: "light" | "dark";
  user_data_id: number | null; // Optional if nullable in DB
  created_at: Date;
  updated_at: Date;
}
