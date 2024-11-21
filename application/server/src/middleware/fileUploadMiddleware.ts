
import path from 'path';
import fs from 'fs';
import multer from 'multer';

// Optional: Ensure the 'uploads' directory exists before using it
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer to save files temporarily in the 'uploads/' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Use the resolved 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Use a timestamp to ensure unique filenames
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Set up the Multer instance for handling a single file upload
const upload = multer({ storage });

// Export middleware to use in routes
export const fileUploadMiddleware = upload.single('profilePicture');

