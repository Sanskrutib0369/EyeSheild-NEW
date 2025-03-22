// Notification System
class NotificationSystem {
    constructor() {
        this.checkPermission();
        this.loadSettings();
        this.initializeTimers();
    }

    loadSettings() {
        const savedSettings = JSON.parse(localStorage.getItem('settings')) || {};
        this.breakReminders = savedSettings.breakReminders ?? true;
        this.exerciseReminders = savedSettings.exerciseReminders ?? true;
        this.reminderInterval = savedSettings.reminderInterval ?? 20;
    }

    async checkPermission() {
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications");
            return;
        }

        if (Notification.permission !== "granted") {
            try {
                const permission = await Notification.requestPermission();
                if (permission === "granted") {
                    this.initializeTimers();
                }
            } catch (error) {
                console.error("Error requesting notification permission:", error);
            }
        }
    }

    initializeTimers() {
        // Clear existing timers
        if (this.breakTimer) clearInterval(this.breakTimer);
        if (this.exerciseTimer) clearInterval(this.exerciseTimer);

        // Set up break reminder timer
        if (this.breakReminders) {
            this.breakTimer = setInterval(() => {
                this.showBreakNotification();
            }, this.reminderInterval * 60 * 1000); // Convert minutes to milliseconds
        }

        // Set up exercise reminder timer
        if (this.exerciseReminders) {
            this.exerciseTimer = setInterval(() => {
                this.showExerciseNotification();
            }, this.reminderInterval * 2 * 60 * 1000); // Exercise reminder at twice the break interval
        }
    }

    showBreakNotification() {
        if (Notification.permission === "granted" && this.breakReminders) {
            const notification = new Notification("Time for an Eye Break!", {
                body: "Look at something 20 feet away for 20 seconds to reduce eye strain.",
                icon: "/icons/eye-icon.png",
                badge: "/icons/eye-icon.png"
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            // Auto close after 10 seconds
            setTimeout(() => notification.close(), 10000);
        }
    }

    showExerciseNotification() {
        if (Notification.permission === "granted" && this.exerciseReminders) {
            const notification = new Notification("Time for Eye Exercises!", {
                body: "Take a moment to do some eye exercises to maintain eye health.",
                icon: "/icons/exercise-icon.png",
                badge: "/icons/exercise-icon.png"
            });

            notification.onclick = () => {
                window.focus();
                window.location.href = 'exercises.html';
                notification.close();
            };

            // Auto close after 10 seconds
            setTimeout(() => notification.close(), 10000);
        }
    }

    updateSettings(settings) {
        this.breakReminders = settings.breakReminders;
        this.exerciseReminders = settings.exerciseReminders;
        this.reminderInterval = settings.reminderInterval;
        this.initializeTimers();
    }

    // Manually trigger notifications (for testing)
    testBreakNotification() {
        this.showBreakNotification();
    }

    testExerciseNotification() {
        this.showExerciseNotification();
    }
}

// Initialize notification system
const notificationSystem = new NotificationSystem();

// Export for use in other files
window.notificationSystem = notificationSystem;
