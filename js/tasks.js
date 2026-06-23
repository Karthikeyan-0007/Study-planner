// --- Tasks Logic ---
document.addEventListener('DOMContentLoaded', () => {
    populateSubjectFilter();
    renderTasks();
    setupTaskForm();
    setupFiltersAndSearch();
});

function renderTasks() {
    const list = document.getElementById('tasks-list');
    if (!list) return;
    
    list.innerHTML = '';
    
    const filterSubjectEl = document.getElementById('filter-subject');
    const filterStatusEl = document.getElementById('filter-status');
    const globalSearch = document.getElementById('global-search');
    
    const subjectFilter = filterSubjectEl ? filterSubjectEl.value : 'all';
    const statusFilter = filterStatusEl ? filterStatusEl.value : 'all';
    const searchVal = globalSearch ? globalSearch.value.toLowerCase() : '';
    
    let filteredTasks = tasks.filter(t => {
        let matchSearch = t.title.toLowerCase().includes(searchVal);
        let matchSubject = subjectFilter === 'all' || t.subjectId === subjectFilter;
        let matchStatus = statusFilter === 'all' || 
                          (statusFilter === 'completed' && t.completed) || 
                          (statusFilter === 'pending' && !t.completed);
        return matchSearch && matchSubject && matchStatus;
    });

    if (filteredTasks.length === 0) {
        list.innerHTML = '<div class="empty-state">No tasks found.</div>';
        return;
    }

    // Sort by due date, incomplete first
    filteredTasks.sort((a, b) => {
        if(a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    filteredTasks.forEach(task => {
        const subject = subjects.find(s => s.id === task.subjectId);
        const subjectName = subject ? subject.name : 'Unknown';
        const subjectColor = subject ? subject.color : '#666';
        const dueDate = new Date(task.dueDate).toLocaleDateString();
        
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <div class="task-left">
                <div class="task-checkbox" onclick="toggleTaskCompletion('${task.id}')">
                    <i class="fa-solid fa-check"></i>
                </div>
                <div class="task-info">
                    <h4>${task.title}</h4>
                    <div class="task-meta">
                        <span class="task-subject-tag" style="background-color: ${subjectColor}">${subjectName}</span>
                        <span class="task-due-date"><i class="fa-regular fa-clock"></i> ${dueDate}</span>
                    </div>
                </div>
            </div>
            <div class="task-actions">
                <button class="action-btn edit" onclick="editTask('${task.id}')"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn delete" onclick="deleteTask('${task.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        list.appendChild(li);
    });
}

function populateSubjectDropdown() {
    const select = document.getElementById('task-subject');
    if (!select) return;
    
    select.innerHTML = '<option value="" disabled selected>Select Subject</option>';
    subjects.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.name;
        select.appendChild(opt);
    });
}

function populateSubjectFilter() {
    const select = document.getElementById('filter-subject');
    if (!select) return;
    
    const currentVal = select.value;
    select.innerHTML = '<option value="all">All Subjects</option>';
    subjects.forEach(s => {
        const opt = document.createElement('option');
        opt.value = s.id;
        opt.textContent = s.name;
        select.appendChild(opt);
    });
    // restore value if it still exists
    if(subjects.some(s => s.id === currentVal) || currentVal === 'all') {
        select.value = currentVal;
    }
}

function setupTaskForm() {
    const taskForm = document.getElementById('task-form');
    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('task-id').value;
            const title = document.getElementById('task-title').value.trim();
            const subjectId = document.getElementById('task-subject').value;
            const dueDate = document.getElementById('task-due').value;
            
            if(id) {
                // Edit
                const taskIndex = tasks.findIndex(t => t.id === id);
                if(taskIndex > -1) {
                    tasks[taskIndex].title = title;
                    tasks[taskIndex].subjectId = subjectId;
                    tasks[taskIndex].dueDate = dueDate;
                }
            } else {
                // Add
                const newTask = {
                    id: 'task_' + Date.now(),
                    title,
                    subjectId,
                    dueDate,
                    completed: false
                };
                tasks.push(newTask);
                recordActivity(); // Meaningful activity
            }
            
            saveToLocalStorage();
            closeModal('task-modal');
            renderTasks();
        });
    }
}

function toggleTaskCompletion(id) {
    const task = tasks.find(t => t.id === id);
    if(task) {
        task.completed = !task.completed;
        if(task.completed) {
            recordActivity(); // Meaningful activity when completing
        } else {
            saveToLocalStorage(); // Just save if unchecking
        }
        renderTasks();
    }
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if(task) {
        openModal('task-modal');
        const taskModalTitle = document.getElementById('task-modal-title');
        const taskId = document.getElementById('task-id');
        const taskTitle = document.getElementById('task-title');
        const taskSubject = document.getElementById('task-subject');
        const taskDue = document.getElementById('task-due');
        
        if (taskModalTitle) taskModalTitle.textContent = 'Edit Task';
        if (taskId) taskId.value = task.id;
        if (taskTitle) taskTitle.value = task.title;
        if (taskSubject) taskSubject.value = task.subjectId;
        if (taskDue) taskDue.value = task.dueDate;
    }
}

function deleteTask(id) {
    if(confirm('Delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveToLocalStorage();
        renderTasks();
    }
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        if (modalId === 'task-modal') {
            populateSubjectDropdown();
            const taskId = document.getElementById('task-id');
            const taskModalTitle = document.getElementById('task-modal-title');
            const taskForm = document.getElementById('task-form');
            if (taskId) taskId.value = '';
            if (taskModalTitle) taskModalTitle.textContent = 'Add New Task';
            if (taskForm) taskForm.reset();
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function setupFiltersAndSearch() {
    const filterSubject = document.getElementById('filter-subject');
    const filterStatus = document.getElementById('filter-status');
    const globalSearch = document.getElementById('global-search');
    
    if (filterSubject) filterSubject.addEventListener('change', renderTasks);
    if (filterStatus) filterStatus.addEventListener('change', renderTasks);
    if (globalSearch) globalSearch.addEventListener('input', renderTasks);
}
