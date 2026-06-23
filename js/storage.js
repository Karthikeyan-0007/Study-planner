// --- Data Models and LocalStorage ---
let subjects = JSON.parse(localStorage.getItem('subjects')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let exams = JSON.parse(localStorage.getItem('exams')) || [];
let settings = JSON.parse(localStorage.getItem('settings')) || {
    theme: 'light',
    lastActiveDate: null,
    currentStreak: 0
};

function saveToLocalStorage() {
    localStorage.setItem('subjects', JSON.stringify(subjects));
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('exams', JSON.stringify(exams));
    localStorage.setItem('settings', JSON.stringify(settings));
}
