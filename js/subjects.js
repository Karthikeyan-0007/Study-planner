// --- Subjects Logic ---
document.addEventListener('DOMContentLoaded', () => {
    renderSubjects();
    setupSubjectForm();
    setupSearch();
});

function renderSubjects() {
    const grid = document.getElementById('subjects-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (subjects.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1">No subjects yet. Click "Add Subject" to begin.</div>';
        return;
    }
    
    const globalSearch = document.getElementById('global-search');
    const searchVal = globalSearch ? globalSearch.value.toLowerCase() : '';
    
    subjects.filter(s => s.name.toLowerCase().includes(searchVal)).forEach(subject => {
        const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
        const el = document.createElement('div');
        el.className = 'subject-card';
        el.innerHTML = `
            <div class="subject-color-strip" style="background-color: ${subject.color}"></div>
            <div class="subject-header">
                <div class="subject-title">${subject.name}</div>
                <div class="subject-actions">
                    <button onclick="deleteSubject('${subject.id}')"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            <div class="subject-stats">
                <span class="stat"><i class="fa-solid fa-list-check"></i> ${subjectTasks.length} Tasks</span>
            </div>
        `;
        grid.appendChild(el);
    });
}

function setupSubjectForm() {
    const subjectForm = document.getElementById('subject-form');
    if (subjectForm) {
        subjectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('subject-name').value.trim();
            const color = document.getElementById('subject-color').value;
            
            if (subjects.some(s => s.name.toLowerCase() === name.toLowerCase())) {
                alert("A subject with this name already exists.");
                return;
            }
            
            const newSubject = {
                id: 'sub_' + Date.now(),
                name,
                color
            };
            
            subjects.push(newSubject);
            saveToLocalStorage();
            recordActivity(); // Meaningful activity
            closeModal('subject-modal');
            subjectForm.reset();
            renderSubjects();
        });
    }
}

function deleteSubject(id) {
    if(confirm('Are you sure? Deleting this subject will also delete all associated tasks.')) {
        subjects = subjects.filter(s => s.id !== id);
        tasks = tasks.filter(t => t.subjectId !== id);
        saveToLocalStorage();
        renderSubjects();
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

function setupSearch() {
    const searchInput = document.getElementById('global-search');
    if (searchInput) {
        searchInput.addEventListener('input', renderSubjects);
    }
}
