// Global tasks array to keep track of all tasks
let tasks = [];

// DOM elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateEmptyState();
    
    // Add event listeners
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText) {
            addTask(taskText, true); // true indicates to save to localStorage
            taskInput.value = '';
        }
    });

    // Allow Enter key to add tasks
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const taskText = taskInput.value.trim();
            if (taskText) {
                addTask(taskText, true);
                taskInput.value = '';
            }
        }
    });
});

/**
 * Load tasks from Local Storage when the page loads
 */
function loadTasks() {
    // Check Local Storage for existing tasks
    const storedTasks = localStorage.getItem('tasks');
    
    if (storedTasks) {
        try {
            // Parse tasks from JSON to array
            const parsedTasks = JSON.parse(storedTasks);
            tasks = parsedTasks;
            
            // Clear existing tasks in DOM
            taskList.innerHTML = '';
            
            // Populate the task list on the page
            parsedTasks.forEach(taskText => {
                addTask(taskText, false); // false indicates not to save again to localStorage
            });
            
            console.log(`Loaded ${parsedTasks.length} tasks from Local Storage`);
        } catch (error) {
            console.error('Error parsing tasks from Local Storage:', error);
            tasks = [];
        }
    } else {
        // No tasks found in Local Storage
        tasks = [];
        console.log('No tasks found in Local Storage');
    }
}

/**
 * Add a new task to the list
 * @param {string} taskText - The text of the task
 * @param {boolean} save - Whether to save to localStorage (default: true)
 */
function addTask(taskText, save = true) {
    if (!taskText.trim()) {
        return;
    }

    // Create task element
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.innerHTML = `
        <span class="task-text">${escapeHtml(taskText)}</span>
        <button class="remove-btn" onclick="removeTask(this, '${escapeHtml(taskText)}')">Remove</button>
    `;

    // Add to DOM
    taskList.appendChild(taskItem);

    // Save to localStorage if requested
    if (save) {
        // Update tasks array
        tasks.push(taskText);
        
        // Save updated array to Local Storage
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
            console.log('Task saved to Local Storage:', taskText);
        } catch (error) {
            console.error('Error saving task to Local Storage:', error);
        }
    }

    updateEmptyState();
}

/**
 * Remove a task from the list
 * @param {HTMLElement} button - The remove button that was clicked
 * @param {string} taskText - The text of the task to remove
 */
function removeTask(button, taskText) {
    // Remove from DOM
    const taskItem = button.closest('.task-item');
    taskItem.remove();

    // Remove from tasks array
    const taskIndex = tasks.indexOf(taskText);
    if (taskIndex > -1) {
        tasks.splice(taskIndex, 1);
    }

    // Update localStorage
    saveTasksToStorage();
    updateEmptyState();
}

/**
 * Save the current tasks array to Local Storage
 */
function saveTasksToStorage() {
    try {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        console.log('Tasks saved to Local Storage:', tasks);
    } catch (error) {
        console.error('Error saving tasks to Local Storage:', error);
    }
}

/**
 * Update the empty state visibility
 */
function updateEmptyState() {
    if (tasks.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - The text to escape
 * @returns {string} - The escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Optional: Add a function to clear all tasks (for testing)
function clearAllTasks() {
    tasks = [];
    taskList.innerHTML = '';
    localStorage.removeItem('tasks');
    updateEmptyState();
    console.log('All tasks cleared');
}

// Optional: Add a function to export tasks (for backup)
function exportTasks() {
    const tasksJson = JSON.stringify(tasks, null, 2);
    console.log('Current tasks:', tasksJson);
    return tasksJson;
}
