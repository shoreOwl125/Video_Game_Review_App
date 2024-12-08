import bcrypt from 'bcryptjs';
import { getPool } from '../src/connections/database';
import { connectUserDB } from '../src/connections/database'; // Import connectUserDB

// Define the structure of a user
interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  profile_pic: string;
  theme_preference: string;
  user_data_id: number;
  created_at: string;
  updated_at: string;
}

const hashPasswords = async () => {
  // Ensure the database connection is initialized
  connectUserDB();

  const pool = getPool(); // Get the pool connection
  
  try {
    // Fetch all users from the database
    const [users] = await pool.query('SELECT * FROM users') as [User[], any];

    if (users.length > 0) {
      // Iterate through each user to hash the password
      for (const user of users) {
        if (user.password) {
          // Hash the password
          const hashedPassword = await bcrypt.hash(user.password, 10);

          // Update the user with the hashed password
          await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user.id]);

          console.log(`Password for user ${user.name} (ID: ${user.id}) has been hashed and updated.`);
        }
      }
      console.log('Password hashing completed.');
    } else {
      console.log('No users found to update.');
    }
  } catch (error) {
    console.error('Error hashing passwords:', error);
  }
};

// Run the password hashing function
hashPasswords();
