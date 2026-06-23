// --- Streak System ---
function recordActivity() {
    const today = new Date().toDateString();
    
    if (!settings.lastActiveDate) {
        // First ever activity
        settings.currentStreak = 1;
        settings.lastActiveDate = today;
    } else if (settings.lastActiveDate !== today) {
        // Check if yesterday
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (settings.lastActiveDate === yesterday.toDateString()) {
            settings.currentStreak += 1;
        } else {
            // Missed a day or more
            settings.currentStreak = 1;
        }
        settings.lastActiveDate = today;
    }
    
    saveToLocalStorage();
    updateStreakDisplay();
}

function updateStreakDisplay() {
    const streakCount = document.getElementById('streak-count');
    if (streakCount) {
        streakCount.textContent = settings.currentStreak;
    }
}
