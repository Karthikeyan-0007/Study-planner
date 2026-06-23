// --- Theme and Common Page Setup ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupThemeToggle();
    updateDateDisplay();
    setupMobileMenu();
});

function initTheme() {
    if (settings.theme === 'dark') {
        document.body.classList.add('dark-mode');
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i><span>Light Mode</span>';
        }
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    settings.theme = isDark ? 'dark' : 'light';
    saveToLocalStorage();
    
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        if (isDark) {
            toggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i><span>Light Mode</span>';
        } else {
            toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i><span>Dark Mode</span>';
        }
    }
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

function updateDateDisplay() {
    const dateDisplay = document.getElementById('current-date');
    if (dateDisplay) {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
    }
    
    const motivationalQuote = document.getElementById('motivational-quote');
    if (motivationalQuote) {
        const quotes = [
            "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            "The secret of getting ahead is getting started.",
            "It always seems impossible until it's done.",
            "Don't let what you cannot do interfere with what you can do.",
            "Strive for progress, not perfection."
        ];
        motivationalQuote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
    }
    updateStreakDisplay();
}

function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (toggle && sidebar) {
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
}
