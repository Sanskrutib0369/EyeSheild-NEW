const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = path.join(__dirname, '..', 'images');
        if (file.fieldname === 'testImages') {
            uploadPath = path.join(uploadPath, 'tests');
        } else if (file.fieldname === 'exerciseImages') {
            uploadPath = path.join(uploadPath, 'exercises');
        }
        fs.mkdir(uploadPath, { recursive: true })
            .then(() => cb(null, uploadPath))
            .catch(err => cb(err));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// JWT Secret
const JWT_SECRET = 'your-secret-key';

// Data files
const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const TESTS_FILE = path.join(DATA_DIR, 'tests.json');
const EXERCISES_FILE = path.join(DATA_DIR, 'exercises.json');

// Ensure data directory exists
async function initializeDataFiles() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });

        // Initialize users.json if it doesn't exist
        try {
            await fs.access(USERS_FILE);
        } catch {
            const defaultUser = {
                username: 'admin',
                password: await bcrypt.hash('admin123', 10)
            };
            await fs.writeFile(USERS_FILE, JSON.stringify([defaultUser], null, 2));
        }

        // Initialize other data files
        const files = [CONTENT_FILE, TESTS_FILE, EXERCISES_FILE];
        for (const file of files) {
            try {
                await fs.access(file);
            } catch {
                await fs.writeFile(file, JSON.stringify({}, null, 2));
            }
        }
    } catch (error) {
        console.error('Error initializing data files:', error);
    }
}

// Initialize data files
initializeDataFiles();

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

// Login route
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const usersData = await fs.readFile(USERS_FILE, 'utf8');
        const users = JSON.parse(usersData);

        const user = users.find(u => u.username === username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ username }, JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Content routes
app.get('/api/content', async (req, res) => {
    try {
        const content = await fs.readFile(CONTENT_FILE, 'utf8');
        res.json(JSON.parse(content));
    } catch (error) {
        res.status(500).json({ error: 'Error reading content' });
    }
});

app.post('/api/content', authenticateToken, upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'aboutImage', maxCount: 1 }
]), async (req, res) => {
    try {
        const content = JSON.parse(req.body.content);
        
        // Update image paths if new images were uploaded
        if (req.files) {
            if (req.files.heroImage) {
                content.hero.image = '/images/' + req.files.heroImage[0].filename;
            }
            if (req.files.aboutImage) {
                content.about.image = '/images/' + req.files.aboutImage[0].filename;
            }
        }

        await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2));

        // Update HTML files
        await updateHtmlContent(content);

        res.json({ message: 'Content updated successfully' });
    } catch (error) {
        console.error('Error saving content:', error);
        res.status(500).json({ error: 'Error saving content' });
    }
});

// Vision Tests routes
app.get('/api/vision-tests', async (req, res) => {
    try {
        const tests = await fs.readFile(TESTS_FILE, 'utf8');
        res.json(JSON.parse(tests));
    } catch (error) {
        res.status(500).json({ error: 'Error reading tests' });
    }
});

app.post('/api/vision-tests', authenticateToken, upload.array('testImages'), async (req, res) => {
    try {
        const tests = JSON.parse(req.body.tests);
        
        // Update image paths for uploaded files
        if (req.files) {
            tests.colorVision.plates.forEach((plate, index) => {
                if (req.files[index]) {
                    plate.image = '/images/tests/' + req.files[index].filename;
                }
            });
        }

        await fs.writeFile(TESTS_FILE, JSON.stringify(tests, null, 2));

        // Update HTML files
        await updateTestsContent(tests);

        res.json({ message: 'Tests updated successfully' });
    } catch (error) {
        console.error('Error saving tests:', error);
        res.status(500).json({ error: 'Error saving tests' });
    }
});

// Exercises routes
app.get('/api/exercises', async (req, res) => {
    try {
        const exercises = await fs.readFile(EXERCISES_FILE, 'utf8');
        res.json(JSON.parse(exercises));
    } catch (error) {
        res.status(500).json({ error: 'Error reading exercises' });
    }
});

app.post('/api/exercises', authenticateToken, upload.array('exerciseImages'), async (req, res) => {
    try {
        const exercises = JSON.parse(req.body.exercises);
        
        // Update image paths for uploaded files
        if (req.files) {
            exercises.forEach((exercise, index) => {
                if (req.files[index]) {
                    exercise.image = '/images/exercises/' + req.files[index].filename;
                }
            });
        }

        await fs.writeFile(EXERCISES_FILE, JSON.stringify(exercises, null, 2));

        // Update HTML files
        await updateExercisesContent(exercises);

        res.json({ message: 'Exercises updated successfully' });
    } catch (error) {
        console.error('Error saving exercises:', error);
        res.status(500).json({ error: 'Error saving exercises' });
    }
});

// HTML update functions
async function updateHtmlContent(content) {
    try {
        // Update index.html
        let indexHtml = await fs.readFile(path.join(__dirname, '..', 'index.html'), 'utf8');
        
        // Update hero section
        indexHtml = indexHtml.replace(
            /<h1[^>]*>(.*?)<\/h1>/,
            `<h1>${content.hero.title}</h1>`
        );
        indexHtml = indexHtml.replace(
            /<h2[^>]*>(.*?)<\/h2>/,
            `<h2>${content.hero.subtitle}</h2>`
        );
        indexHtml = indexHtml.replace(
            /<p class="hero-description"[^>]*>(.*?)<\/p>/,
            `<p class="hero-description">${content.hero.description}</p>`
        );

        // Update about section
        indexHtml = indexHtml.replace(
            /<h2 class="about-title"[^>]*>(.*?)<\/h2>/,
            `<h2 class="about-title">${content.about.title}</h2>`
        );
        indexHtml = indexHtml.replace(
            /<p class="about-content"[^>]*>(.*?)<\/p>/,
            `<p class="about-content">${content.about.content}</p>`
        );

        // Update features
        let featuresHtml = content.features.map(feature => `
            <div class="feature-card">
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            </div>
        `).join('');
        indexHtml = indexHtml.replace(
            /<div class="features-grid"[^>]*>(.*?)<\/div>/s,
            `<div class="features-grid">${featuresHtml}</div>`
        );

        await fs.writeFile(path.join(__dirname, '..', 'index.html'), indexHtml);
    } catch (error) {
        console.error('Error updating HTML content:', error);
        throw error;
    }
}

async function updateTestsContent(tests) {
    try {
        // Update visual-acuity.html
        let acuityHtml = await fs.readFile(path.join(__dirname, '..', 'visual-acuity.html'), 'utf8');
        acuityHtml = acuityHtml.replace(
            /<h1[^>]*>(.*?)<\/h1>/,
            `<h1>${tests.visualAcuity.title}</h1>`
        );
        acuityHtml = acuityHtml.replace(
            /<div class="instructions"[^>]*>(.*?)<\/div>/s,
            `<div class="instructions">${tests.visualAcuity.instructions}</div>`
        );
        await fs.writeFile(path.join(__dirname, '..', 'visual-acuity.html'), acuityHtml);

        // Update color-vision.html
        let colorHtml = await fs.readFile(path.join(__dirname, '..', 'color-vision.html'), 'utf8');
        colorHtml = colorHtml.replace(
            /<h1[^>]*>(.*?)<\/h1>/,
            `<h1>${tests.colorVision.title}</h1>`
        );
        colorHtml = colorHtml.replace(
            /<div class="instructions"[^>]*>(.*?)<\/div>/s,
            `<div class="instructions">${tests.colorVision.instructions}</div>`
        );
        await fs.writeFile(path.join(__dirname, '..', 'color-vision.html'), colorHtml);
    } catch (error) {
        console.error('Error updating tests HTML:', error);
        throw error;
    }
}

async function updateExercisesContent(exercises) {
    try {
        let exercisesHtml = await fs.readFile(path.join(__dirname, '..', 'exercises.html'), 'utf8');
        
        let exercisesContent = exercises.map(exercise => `
            <div class="exercise-card">
                <h3>${exercise.name}</h3>
                <p>${exercise.description}</p>
                <div class="exercise-timer" data-duration="${exercise.duration}">
                    <button class="start-timer">Start Exercise</button>
                    <span class="timer-display">${exercise.duration}s</span>
                </div>
                ${exercise.image ? `<img src="${exercise.image}" alt="${exercise.name}">` : ''}
            </div>
        `).join('');

        exercisesHtml = exercisesHtml.replace(
            /<div class="exercises-grid"[^>]*>(.*?)<\/div>/s,
            `<div class="exercises-grid">${exercisesContent}</div>`
        );

        await fs.writeFile(path.join(__dirname, '..', 'exercises.html'), exercisesHtml);
    } catch (error) {
        console.error('Error updating exercises HTML:', error);
        throw error;
    }
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
