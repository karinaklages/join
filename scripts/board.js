
/**
 * Initializes the "Board" view.
 */
function initBoard() {
    init(),
        loadContentBoard(),
        loadEventlistener('overlay')
}


/**
 * Loads the entire content board.
 * Clears the board, fetches the latest tasks from Firebase, and populates each column based on task status.
 */
async function loadContentBoard() {
    resetBoardHTML();
    taskList = []
    await loadFirebaseData('tasks');
    await loadFirebaseData('contacts');
    checkStatusTask();
    initMobileDragAndDrop();
}


/**
 * Iterates through all tasks and calls loadBoardColumn to place each task in the correct column based on its status.
 */
function checkStatusTask() {
    Object.entries(taskList).forEach((taskElementofColumn, index) => {
        taskID = taskElementofColumn[1].id;
        taskContent = taskElementofColumn[1].task;
        if (taskContent.statusTask == "todo") {
            loadBoardColumn(taskID, taskContent, index, "todo");
        } else if (taskContent.statusTask == "inProgress") {
            loadBoardColumn(taskID, taskContent, index, "inProgress");
        } else if (taskContent.statusTask == "awaitFeedback") {
            loadBoardColumn(taskID, taskContent, index, "awaitFeedback");
        } else if (taskContent.statusTask == "done") {
            loadBoardColumn(taskID, taskContent, index, "done");
        }
    })
}


/**
 * Loads a specific task into its corresponding column.
 * Initializes the column if it's not yet initialized, then renders task content, assignees, priority icon, category label, and progress bar.
 *
 * @param {string} taskID - The unique ID of the task.
 * @param {Object} taskContent - The task data object.
 * @param {number} index - Index of the task in taskList.
 * @param {string} status - The status of the column.
 */
function loadBoardColumn(taskID, taskContent, index, status) {
    let columnElement = document.getElementById('board_column_' + status);
    if (columnElement.dataset.initialized == "false") {
        columnElement.innerHTML = "";
        columnElement.classList.remove("no_task_available");
        columnElement.dataset.initialized = "true";
    }
    loadTaskElementinColumn(taskID, taskContent, index, status);
    loadAssigneesOfTaks(taskContent, taskID);
    loadPriorityIcon(taskContent, taskID);
    loadCategoryLabelColor(taskContent, taskID);
    loadProgressbar(index, taskID);
}


/**
 * Creates a task element and appends it to the corresponding column.
 * Also loads the subtasks summary and the done subtasks counter.
 *
 * @param {string} taskID - The unique ID of the task.
 * @param {Object} taskContent - The task data object.
 * @param {number} index - Index of the task in the task list.
 * @param {string} status - The status of the column.
 */
function loadTaskElementinColumn(taskID, taskContent, index, status) {
    let columnElement = document.getElementById('board_column_' + status);
    let taskElementofColumnList = document.createElement('div');
    taskElementofColumnList.innerHTML = taskListElementTemplate(taskID, index);
    columnElement.appendChild(taskElementofColumnList);
    loadSummarySubtasks(taskID, index);
    loadCounterDoneSubtasks(taskID, index);
}


/**
 * Main function to load assignees.
 * Coordinates the rendering of visible avatars and the overflow counter.
 */
function loadAssigneesOfTaks(taskContent, taskID) {
    let taskAssigneeElement = document.getElementById("board_assignee_" + taskID);
    taskAssigneeElement.innerHTML = "";
    let assignees = taskContent.assignees || {};
    let existingContactsIds = contactsList.map(contact => contact.id);
    let validAssignees = Object.entries(assignees)
        .filter(([assigneesId]) => existingContactsIds.includes(assigneesId));
    Object.entries(assignees).forEach(([assigneeID]) => {
        if (!existingContactsIds.includes(assigneeID)) {
            deleteAssigneeInTaskList(assigneeID, 'tasks/', taskID);
        }
    });
    renderVisibleAssignees(validAssignees, 2, taskAssigneeElement);
    renderOverflowCounter(validAssignees.length, 2, taskAssigneeElement);
}


/**
 * Renders the visible assignee avatars (up to maxVisible).
 *
 * @param {Array} assigneeList - Array of assignee objects.
 * @param {number} maxVisible - Maximum number of avatars to show.
 * @param {HTMLElement} container - The DOM element to append to.
 */
function renderVisibleAssignees(assigneeList, maxVisible, container) {
    let countToRender = Math.min(assigneeList.length, maxVisible);
    for (let i = 0; i < countToRender; i++) {
        let assignee = assigneeList[i];
        let avatar = document.createElement('div');
        avatar.className = "user_circle_task_card";
        avatar.style.backgroundColor = assignee[1].assigneeColor;
        avatar.innerHTML = assignee[1].assigneeInitial;
        container.appendChild(avatar);
    }
}


/**
 * Renders the overflow counter (e.g., "+2") if there are more assignees than maxVisible.
 *
 * @param {number} totalAssignees - Total count of assignees.
 * @param {number} maxVisible - Limit before overflow triggers.
 * @param {HTMLElement} container - The DOM element to append to.
 */
function renderOverflowCounter(totalAssignees, maxVisible, container) {
    if (totalAssignees > maxVisible) {
        let remaining = totalAssignees - maxVisible;
        let overflowCircle = document.createElement('div');
        overflowCircle.className = "user_circle_task_card";
        overflowCircle.style.backgroundColor = "#29abe2"
        overflowCircle.style.color = 'white';
        overflowCircle.innerHTML = `+${remaining}`;
        container.appendChild(overflowCircle);
    }
}


/**
 * Sets the priority icon for a task based on its priority level.
 *
 * @param {Object} taskContent - The task data object containing priority information.
 * @param {string} taskID - The unique ID of the task.
 */
function loadPriorityIcon(taskContent, taskID) {
    let iconPriorityElement = document.getElementById("icon_priority_" + taskID);
    if (taskContent.priority.name === "low") {
        iconPriorityElement.src = "./assets/img/prio_low_green.svg";
    } else if (taskContent.priority.name === "medium") {
        iconPriorityElement.src = "./assets/img/prio_medium_yellow.svg";
    } else {
        iconPriorityElement.src = "./assets/img/prio_urgent_red.svg";
    }
}


/**
 * Sets the background color of a task's category label based on its category.
 *
 * @param {Object} taskContent - The task data object containing category information.
 * @param {string} taskID - The unique ID of the task.
 */
function loadCategoryLabelColor(taskContent, taskID) {
    let categoryLabel = document.getElementById("category_label_" + taskID);
    if (taskContent.category === "Technical Task") {
        categoryLabel.style.backgroundColor = '#0038FF';
    } else if (taskContent.category === "User Story") {
        categoryLabel.style.backgroundColor = '#1FD7C1';
    } else {
        categoryLabel.style.backgroundColor = '#ff5eb3';
    }
}


/**
 * Updates the total number of subtasks for a task and displays it in the corresponding element.
 *
 * @param {string} taskID - The unique ID of the task.
 */
function loadSummarySubtasks(taskID, index) {
    const currrentTaskElement = taskList.find(taskElement => taskElement.id === taskID);
    if (!currrentTaskElement) {
        return;
    }
    const currentTask = currrentTaskElement.task;
    const allSubtasks = document.getElementById("counterAllSubtasks_" + taskID);
    const tooltipAllSubtasks = document.getElementById("tooltip_all_subtasks_" + taskID)
    let elementSubtasks = currentTask.subtasks;
    let counterAllSubtaks = 0
    Object.entries(elementSubtasks).forEach(eachElement => {
        counterAllSubtaks++;
    })
    allSubtasks.innerHTML = counterAllSubtaks;
    tooltipAllSubtasks.innerHTML = counterAllSubtaks;
}


/**
 * Updates the number of completed subtasks for a task and displays it in the corresponding element.
 *
 * @param {string} taskID - The unique ID of the task.
 */
function loadCounterDoneSubtasks(taskID, index) {
    const currrentTaskElement = taskList.find(taskElement => taskElement.id === taskID);
    if (!currrentTaskElement) {
        return;
    }
    const currentTask = currrentTaskElement.task;
    const doneSubtasks = document.getElementById("counterDoneSubtasks_" + taskID);
    const tooltipDoneSubtasks = document.getElementById("tooltip_done_subtasks_" + taskID)
    let elementSubtasks = currentTask.subtasks;
    let counterDoneSubtasks = 0;
    Object.values(elementSubtasks).forEach(eachElement => {
        if (eachElement.done == true) {
            counterDoneSubtasks++;
        }
    })
    doneSubtasks.innerHTML = counterDoneSubtasks;
    tooltipDoneSubtasks.innerHTML = counterDoneSubtasks;
}


/**
 * Loads the progress bar for a specific task.
 * Hides the progress container if no subtasks are completed.
 */
function loadProgressbar(index, taskID) {
    let progressbarElement = document.getElementById('progressbar_' + taskID);
    let progressContainer = document.getElementById('progress_container_' + taskID);
    let sumAllSubtasks = numberAllSubtasks(index);
    let sumDoneSubtasks = numberDoneSubstask(index);
    if (sumDoneSubtasks > 0) {
        progressContainer.style.display = 'flex';
        let calculatesSubtaksProgress = sumDoneSubtasks / sumAllSubtasks;
        let progressPercent = Math.round(calculatesSubtaksProgress * 100);
        progressbarElement.style.width = progressPercent + '%';
    } else {
        progressContainer.style.display = 'none';
    }
}


/**
 * Counts the total number of subtasks for a given task.
 *
 * @param {number} index - The index of the task in the task list.
 * @returns {number} - The total number of subtasks.
 */
function numberAllSubtasks(index) {
    let numberAllSubtasks = 0;
    let taskElement = taskList[index].task.subtasks;
    Object.keys(taskElement).forEach(element => {
        numberAllSubtasks++;
    })
    return numberAllSubtasks;
}


/**
 * Counts the number of completed subtasks for a given task.
 *
 * @param {number} index - The index of the task in the task list.
 * @returns {number} - The number of completed subtasks.
 */
function numberDoneSubstask(index) {
    let doneSubtasks = 0;
    let taskElement = taskList[index].task.subtasks;
    Object.values(taskElement).forEach(element => {
        if (element.done == true) {
            doneSubtasks++;
        }
    })
    return doneSubtasks;
}


/**
 * Main function to initiate filtering.
 * Handles UI reset and error message display.
 */
function filterTasks() {
    let searchTerm = document.querySelector('.style_input_searchbar').value.toLowerCase();
    let msgBox = document.getElementById('searchMsg');
    resetBoardHTML();
    let matchCount = findAndDisplayTasks(searchTerm);
    if (searchTerm.length > 0 && matchCount === 0) {
        msgBox.innerHTML = "No results found";
    } else {
        msgBox.innerHTML = "";
    }
}


/**
 * Iterates through the task list and loads matching tasks to the board.
 * 
 * @param {string} searchTerm - The string to search for.
 * @returns {number} - The count of tasks found.
 */
function findAndDisplayTasks(searchTerm) {
    let matchCount = 0;
    taskList.forEach((taskItem, index) => {
        let taskContent = taskItem.task;
        let title = taskContent.title.toLowerCase();
        let description = taskContent.description.toLowerCase();

        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            loadBoardColumn(taskItem.id, taskContent, index, taskContent.statusTask);
            matchCount++;
        }
    });
    return matchCount;
}


/**
 * Resets the HTML of all board columns to their default "No tasks" state.
 * Removed the customMessage parameter as requested.
 */
function resetBoardHTML() {
    const columns = [
        { id: 'todo', text: 'To Do' },
        { id: 'inProgress', text: 'Progress' },
        { id: 'awaitFeedback', text: 'Await Feedback' },
        { id: 'done', text: 'Done' }
    ];
    columns.forEach(col => {
        let columnElement = document.getElementById('board_column_' + col.id);
        let message = `No tasks in ${col.text}`;
        columnElement.innerHTML = `<div class="no_task_message">${message}</div>`;
        columnElement.classList.add("no_task_available");
        columnElement.dataset.initialized = "false";
    });
}


/**
 * Checks if the "Add Task" dialog is currently visible and if the screen width is less than 700 pixels.
 * If both conditions are met, it redirects the user to the "add_task.html" page.
 * This function is triggered on page load and window resize.
 */
function checkOverlayRedirect() {
    const overlay = document.getElementById('addTaskDialog');
    if (!overlay) return;
    const style = window.getComputedStyle(overlay);
    if (style.display === 'none' || style.visibility === 'hidden') return;
    if (window.innerWidth < 700) {
        window.location.href = "add_task.html";
    }
}
window.addEventListener('load', checkOverlayRedirect);
window.addEventListener('resize', checkOverlayRedirect);