import { db } from './firebase-config.js';

// Function to update website content
async function updateContent(sectionId, data) {
    try {
        await db.collection('website-content').doc(sectionId).set(data, { merge: true });
        showAlert('Content updated successfully!', 'success');
    } catch (error) {
        console.error('Error updating content:', error);
        showAlert('Error updating content', 'danger');
    }
}

// Function to load content
async function loadContent(sectionId) {
    try {
        const doc = await db.collection('website-content').doc(sectionId).get();
        return doc.exists ? doc.data() : null;
    } catch (error) {
        console.error('Error loading content:', error);
        showAlert('Error loading content', 'danger');
        return null;
    }
}

// Function to upload image to Cloudinary
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'eyeshield'); // Replace with your upload preset

    try {
        const response = await fetch('https://api.cloudinary.com/v1_1/your-cloud-name/image/upload', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Error uploading image:', error);
        showAlert('Error uploading image', 'danger');
        return null;
    }
}

// Event listeners for content forms
document.addEventListener('DOMContentLoaded', () => {
    // Load content for each section
    loadContent('home').then(data => {
        if (data) {
            document.getElementById('heroTitle').value = data.heroTitle || '';
            document.getElementById('heroSubtitle').value = data.heroSubtitle || '';
            document.getElementById('heroDescription').value = data.heroDescription || '';
        }
    });

    // Handle form submissions
    document.getElementById('heroForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            heroTitle: document.getElementById('heroTitle').value,
            heroSubtitle: document.getElementById('heroSubtitle').value,
            heroDescription: document.getElementById('heroDescription').value
        };

        // Handle hero image if uploaded
        const heroImage = document.getElementById('heroImage').files[0];
        if (heroImage) {
            const imageUrl = await uploadImage(heroImage);
            if (imageUrl) {
                data.heroImage = imageUrl;
            }
        }

        await updateContent('home', data);
    });

    // Similar event listeners for other sections
    // Color Vision Test
    document.getElementById('colorVisionForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            title: document.getElementById('colorTitle').value,
            instructions: document.getElementById('colorInstructions').value
        };
        await updateContent('color-vision-test', data);
    });

    // Eye Exercises
    document.getElementById('exercisesForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            title: document.getElementById('exercisesTitle').value,
            description: document.getElementById('exercisesDescription').value
        };
        await updateContent('exercises', data);
    });
});

// Utility function to show alerts
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
