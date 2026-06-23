// --- Exams Logic ---
document.addEventListener('DOMContentLoaded', () => {
    renderExams();
    setupExamForm();
});

function renderExams() {
    const grid = document.getElementById('exams-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (exams.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1">No exams scheduled.</div>';
        return;
    }
    
    // Sort exams by date closest to today
    const sortedExams = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sortedExams.forEach(exam => {
        const days = calculateDaysRemaining(exam.date);
        let statusClass = days <= 7 && days >= 0 ? 'near' : '';
        let displayDays = days < 0 ? 0 : days;
        let label = days < 0 ? 'Passed' : 'Days Remaining';
        
        const el = document.createElement('div');
        el.className = `exam-card ${statusClass}`;
        el.innerHTML = `
            <button class="exam-delete-btn" onclick="deleteExam('${exam.id}')"><i class="fa-solid fa-trash"></i></button>
            <div class="countdown">${displayDays}</div>
            <div class="countdown-label">${label}</div>
            <div class="exam-name">${exam.name}</div>
            <div class="exam-date-text">${new Date(exam.date).toLocaleDateString()}</div>
        `;
        grid.appendChild(el);
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

function setupExamForm() {
    const examForm = document.getElementById('exam-form');
    if (examForm) {
        examForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('exam-name').value.trim();
            const date = document.getElementById('exam-date').value;
            
            const newExam = {
                id: 'exam_' + Date.now(),
                name,
                date
            };
            
            exams.push(newExam);
            saveToLocalStorage();
            recordActivity(); // Meaningful activity
            closeModal('exam-modal');
            examForm.reset();
            renderExams();
        });
    }
}

function deleteExam(id) {
    if(confirm('Delete this exam?')) {
        exams = exams.filter(e => e.id !== id);
        saveToLocalStorage();
        renderExams();
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}
