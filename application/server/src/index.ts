import app from "./app";
import dotenv from 'dotenv';
dotenv.config();

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
