/**
 * Opens the "Task Detail" dialog if it is not already open and loads the template.
 * setTimeout removes focus from any active element.
 * 
 * @function openTaskDetailDialog
 * @returns {void} - This function does not return a value.
 */
async function openTaskDetailDialog(taskID, taskIndex) {
  await loadFirebaseData("tasks");
  const currrentTaskElement = taskList.find(taskElement => taskElement.id === taskID);
  if (!currrentTaskElement) {
    return;
  }
  const currentTask = currrentTaskElement.task;
  const dialog = document.getElementById('taskDetailDialog');
  if (!dialog.open) {
    dialog.innerHTML = taskDetailTemplate(currentTask, taskID, taskIndex);
    loadAssigneesTaskDetails(currentTask, taskID);
    loadSubtaksTaskDetails(currentTask, taskID, taskIndex);
    colorLabelTaskDetails(currentTask, taskID);
    dialog.showModal();
    setTimeout(() => {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }, 0);
  }
}


/**
 * Closes the "User Story" dialog.
 * Removes its content and resets all contact input fields.
 * 
 * @function closeTaskDetailDialog
 * @returns {void} - This function does not return a value.
 */
function closeTaskDetailDialog() {
  const dialog = document.getElementById('taskDetailDialog');
  if (!dialog) return;
  dialog.close();
}


/**
 * Loads and renders all assignees for a task in the task details view.
 * Creates and appends assignee UI elements based on the task content.
 *
 * @param {Object} taskContent - The task data object.
 * @param {string|number} taskID - The unique ID of the task.
 */
function loadAssigneesTaskDetails(taskContent, taskID) {
  let taskAssigneeElement = document.getElementById("assignees_task_details_" + taskID);
  let assigneeList = taskContent.assignees;
  Object.values(assigneeList)
    .forEach(assignee => {
      let assigneeHTMLElement = document.createElement('div');
      assigneeHTMLElement.className = "user_info";
      assigneeHTMLElement.innerHTML = AssigneesTaskDetailsTemplate(assignee);
      taskAssigneeElement.appendChild(assigneeHTMLElement);
    })
}


/**
 * Loads and renders all subtasks for a task in the task details view.
 * Creates subtask elements, appends them to the list, and updates checkbox states.
 *
 * @param {Object} taskContent - The task data object.
 * @param {string|number} taskID - The unique ID of the task.
 * @param {number} taskIndex - The index of the task in the task list.
 */
function loadSubtaksTaskDetails(taskContent, taskID, taskIndex) {
  let subtaskListElement = document.getElementById("subtasks_task_detail_list");
  let subtaskList = taskContent.subtasks;
  if (subtaskList !== "") {
    Object.entries(subtaskList).forEach(subtaskElement => {
      let subtaskID = subtaskElement[0];
      let subtaskContent = subtaskElement[1];
      let subtaskHTMLElement = document.createElement('div');
      subtaskHTMLElement.className = "subtasks_container"
      subtaskHTMLElement.onclick = function () { toggleCheckedIconSubtasks(this, subtaskID, taskID, taskIndex) }
      subtaskHTMLElement.innerHTML = subtaskTaskDetailsTemplate(subtaskID, subtaskContent, taskID, taskIndex);
      subtaskListElement.appendChild(subtaskHTMLElement);
      checkCheckboxSubtaskTaskDetail(subtaskID, subtaskContent);
    })
  }
}


/**
 * Updates the checkbox icon for a subtask based on its completion status.
 *
 * @param {string|number} subtaskID - The unique ID of the subtask.
 * @param {Object} subtaskContent - The subtask data object.
 */
function checkCheckboxSubtaskTaskDetail(subtaskID, subtaskContent) {
  let subtaskCheckboxElement = document.getElementById("checkbox_subtask_task_detail_" + subtaskID);
  if (subtaskContent.done == "false") {
    subtaskCheckboxElement.src = "./assets/img/checkbox_unchecked_contact_form.svg";
  } else {
    subtaskCheckboxElement.src = "./assets/img/checkbox_checked_contact_form.svg";
  }
}


/**
 * Sets the category label color in the task details view.
 * Applies a background color based on the task category.
 *
 * @param {Object} taskContent - The task data object.
 * @param {string|number} taskID - The unique ID of the task.
 */
function colorLabelTaskDetails(taskContent, taskID) {
  let labelElement = document.getElementById("category_label_task_details_" + taskID)
  if (taskContent.category === "Technical Task") {
    labelElement.style.backgroundColor = '#0038FF';
  } else if (taskContent.category === "User Story") {
    labelElement.style.backgroundColor = '#1FD7C1';
  } else {
    labelElement.style.backgroundColor = '#ff00d9';
  }
}


/**
 * Toggles the checked state of a checkbox icon.
 *
 * @param {HTMLImageElement} img
 * The image element representing the checkbox icon.
 * Must contain a 'data-checked' attribute ('true' or 'false').
 */
async function toggleCheckedIconSubtasks(clickedItem, subtaskId, taskID, taskIndex) {
  const img = clickedItem.children[0]
  const checked = img.dataset.checked === "true";
  img.dataset.checked = !checked;
  img.src = checked
    ? "./assets/img/checkbox_unchecked_contact_form.svg"
    : "./assets/img/checkbox_checked_contact_form.svg";
  await updateSubtaskStatus(subtaskId, taskID, !checked, taskIndex);
  await loadFirebaseData("tasks");
  loadSummarySubtasks(taskID, taskIndex);
  loadCounterDoneSubtasks(taskID, taskIndex);
  loadProgressbar(taskIndex, taskID);
}


/**
 * Deletes a task with the given ID from Firebase if it exists in the task list.
 * Iterates over all tasks in `taskList` and calls `deleteTaskFromFirebase` when a task with a matching ID is found.
 *
 * @param {string|number} taskID - The ID of the task to delete.
 */
function deleteTask(taskID) {
  Object.values(taskList).forEach(taskElement => {
    if (taskElement.id == taskID) {
      deleteTaskFromFirebase(taskID, "tasks/");
      deleteTaskLocally(taskID)
    }
  })
}


/**
 * Removes a task from the local task list by its ID
 * and updates the board and task status.
 *
 * @param {number|string} taskID - The unique ID of the task to delete.
 */
function deleteTaskLocally(taskID) {
  const task = taskList.find(task => task.id === taskID)
  const index = taskList.indexOf(task)
  taskList.splice(index, 1)
  resetBoardHTML()
  checkStatusTask()
}