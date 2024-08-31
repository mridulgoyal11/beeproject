const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const path = require('path');

// Path to properties JSON file
const propertiesFilePath = path.join(__dirname, '../data/properties.json');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../uploads'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'addProperty.html'));
});
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

// Route to add a property
router.post('/', upload.single('image'), (req, res) => {
    const { title, description, price, location } = req.body;
    const image = req.file.filename; // Image filename after upload

    // Read existing properties data
    fs.readFile(propertiesFilePath, 'utf8', (err, data) => {
        if (err) return res.status(500).json({ error: 'Failed to read properties data.' });

        const properties = JSON.parse(data);
        const newProperty = {
            id: properties.length + 1,
            title: title,
            description: description,
            price: Number(price),
            location: location,
            image: image,
           // addedBy: req.session.user.username // Assuming user session stores username
        };

        properties.push(newProperty);

        // Write the updated properties back to the file
        fs.writeFile(propertiesFilePath, JSON.stringify(properties, null, 2), 'utf8', (err) => {
            if (err) return res.status(500).json({ error: 'Failed to save property.' });
            res.json({ success: true, message: 'Property added successfully.' });
            
        });
    });
});

module.exports = router;
