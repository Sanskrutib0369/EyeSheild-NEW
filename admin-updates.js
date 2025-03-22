// Function to update theme across all pages
function updateTheme(theme) {
    const root = document.documentElement;
    root.style.setProperty('--primary-red', theme.primaryColor);
    root.style.setProperty('--black', theme.textColor);
    root.style.setProperty('--white', theme.backgroundColor);
}

// Function to update content across pages
function updateContent(content) {
    const siteTitle = document.querySelector('.site-title');
    const heroText = document.querySelector('.hero-text');
    
    if (siteTitle) siteTitle.textContent = content.siteTitle;
    if (heroText) heroText.textContent = content.heroText;
}

// Function to update exercises
function updateExercises(exercises) {
    const exerciseContainer = document.querySelector('.exercise-container');
    if (!exerciseContainer) return;

    exerciseContainer.innerHTML = exercises.map(exercise => `
        <div class="exercise-card">
            <h3>${exercise.name}</h3>
            ${exercise.image ? `<img src="${exercise.image}" alt="${exercise.name}" class="exercise-image">` : ''}
            <p>${exercise.instructions}</p>
            <div class="exercise-timer">
                <span class="time">${exercise.duration}s</span>
                <button class="btn start-btn">Start</button>
            </div>
        </div>
    `).join('');

    // Initialize timers and animations
    initializeExerciseTimers();
}

// Initialize exercise timers and animations
function initializeExerciseTimers() {
    document.querySelectorAll('.exercise-card').forEach(card => {
        const startBtn = card.querySelector('.start-btn');
        const timeDisplay = card.querySelector('.time');
        let timer;

        startBtn.addEventListener('click', () => {
            if (startBtn.textContent === 'Start') {
                startBtn.textContent = 'Stop';
                let time = parseInt(timeDisplay.textContent);
                timer = setInterval(() => {
                    time--;
                    timeDisplay.textContent = time + 's';
                    if (time <= 0) {
                        clearInterval(timer);
                        startBtn.textContent = 'Start';
                        timeDisplay.textContent = card.querySelector('.time').textContent;
                    }
                }, 1000);
            } else {
                clearInterval(timer);
                startBtn.textContent = 'Start';
                timeDisplay.textContent = card.querySelector('.time').textContent;
            }
        });
    });
}
