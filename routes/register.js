const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();

// Path to the JSON file
const usersFilePath = path.join(__dirname, '../data', 'users.json');

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Helper function to read users from the JSON file
const readUsersFromFile = () => {
    try {
        const data = fs.readFileSync(usersFilePath);
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users file:', error);
        return [];
    }
};

// Helper function to write users to the JSON file
const writeUsersToFile = (users) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error('Error writing users file:', error);
    }
};

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'register.html'));
});

// Handle registration form submission with profile picture upload
router.post('/', upload.single('profilePicture'), (req, res) => {
    const { username, password } = req.body;
    const users = readUsersFromFile();

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.send('Username already taken.');
    }

    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    users.push({ username, password, profilePicture });
    writeUsersToFile(users);

    res.redirect('/login');
});

module.exports = router;
