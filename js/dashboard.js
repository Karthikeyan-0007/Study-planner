// --- Dashboard Logic ---
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
});

function renderDashboard() {
    const totalSubjects = document.getElementById('dash-total-subjects');
    const totalTasks = document.getElementById('dash-total-tasks');
    const completedTasksEl = document.getElementById('dash-completed-tasks');
    const pendingTasksEl = document.getElementById('dash-pending-tasks');
    
    if (totalSubjects) totalSubjects.textContent = subjects.length;
    if (totalTasks) totalTasks.textContent = tasks.length;
    
    const completedTasks = tasks.filter(t => t.completed).length;
    if (completedTasksEl) completedTasksEl.textContent = completedTasks;
    if (pendingTasksEl) pendingTasksEl.textContent = tasks.length - completedTasks;
    
    renderDashboardProgress();
    renderDashboardExams();
}

function renderDashboardProgress() {
    const container = document.getElementById('dash-subject-progress');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (subjects.length === 0) {
        container.innerHTML = '<div class="empty-state">No subjects added yet.</div>';
        return;
    }
    
    subjects.forEach(subject => {
        const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
        const completed = subjectTasks.filter(t => t.completed).length;
        const total = subjectTasks.length;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
        
        const el = document.createElement('div');
        el.className = 'progress-item';
        el.innerHTML = `
            <div class="progress-header">
                <span>${subject.name}</span>
                <span>${percentage}%</span>
            </div>
            <div class="progress-bar-bg">
                <div class="progress-bar-fill" style="width: ${percentage}%; background-color: ${subject.color}"></div>
            </div>
        `;
        container.appendChild(el);
    });
}

function renderDashboardExams() {
    const container = document.getElementById('dash-upcoming-exams');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (exams.length === 0) {
        container.innerHTML = '<div class="empty-state">No upcoming exams.</div>';
        return;
    }
    
    const sortedExams = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 5);
    
    sortedExams.forEach(exam => {
        const days = calculateDaysRemaining(exam.date);
        let statusClass = days <= 7 ? 'near' : 'far';
        let daysText = days === 0 ? 'Today' : (days < 0 ? 'Passed' : `${days} days`);
        
        const el = document.createElement('div');
        el.className = 'upcoming-exam-item';
        el.innerHTML = `
            <div class="ue-left">
                <h4>${exam.name}</h4>
                <p>${new Date(exam.date).toLocaleDateString()}</p>
            </div>
            <div class="ue-right ${statusClass}">
                ${daysText}
            </div>
        `;
        container.appendChild(el);
    });
}

function calculateDaysRemaining(targetDate) {
    const oneDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(targetDate);
    target.setHours(0,0,0,0);
    
    return Math.round((target - today) / oneDay);
}
