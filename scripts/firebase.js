/**
 * Sends data to the backend using a POST request.
 * Creates a new entry at the specified path. Optionally clears or updates HTML elements after posting.
 * @async
 * @param {string} path - The backend path where the data should be stored.
 * @param {Object} Data - The data object to store.
 * @param {Object|string} [elements=""] - Optional form or HTML elements to clear/update after posting.
 * @param {string} [HTMLid] - Optional ID of an HTML element for UI updates.
 */
async function postToStorage(path, Data, elements = "", HTMLid) {
    try {
        let userStorage = await fetch(BASE_URL + path + ".json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Data),
        });
    } catch (error) {
        console.error("Fehler beim Updaten:", error);
    }
    checkClearElements(path, elements, HTMLid)
}


/**
 * Sends data to the backend using a PUT request to update an existing entry.
 * @async
 * @param {string} path - The backend path where the data should be updated.
 * @param {Object} Data - The data object to update.
 * @param {Object|string} [elements=""] - Optional form or HTML elements to update after putting.
 * @param {string} [HTMLid] - Optional ID of an HTML element for UI updates.
 * @param {string|number} taskID - The unique ID of the item to update.
 */
async function putToStorage(path, Data, elements = '', HTMLid, taskID) {
    try {
        let userStorage = await fetch(BASE_URL + path + "/" + taskID + ".json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Data),
        });
    } catch (error) {
        console.error("Fehler beim Updaten:", error);
    }
}


/**
 * Clears input fields or elements after data has been posted or updated.
 * Clears form elements for 'user' or 'contacts' paths.
 * Clears specific input fields for other paths.
 * @param {string} path - The backend path that was updated.
 * @param {Object|string} elements - The form elements to clear if applicable.
 * @param {string} HTMLid - The ID of the input to clear for other paths.
 */
function checkClearElements(path, elements, HTMLid) {
    if (path == 'user' || path == 'contacts') {
        clearElements(elements);
    } else {
        clearInputs(HTMLid);
    }
}


/**
 * Clears the values of a set of HTML input elements.
 * @param {Object} elements - An object containing input elements to clear.
 */
function clearElements(elements) {
    Object.values(elements).forEach(element => {
        element.value = ""
    });
}


/**
 * Loads data from Firebase for a given path and pushes it into an array.
 * @async
 * @param {string} path - The backend path to fetch data from.
 */
async function loadFirebaseData(path) {
    try {
        let responseFirebaseData = await fetch(BASE_URL + path + ".json");
        let responseFirebaseDataToJSON = await responseFirebaseData.json();
        let firebaseKeys = Object.keys(responseFirebaseDataToJSON);
        await checkPushToArray(firebaseKeys, responseFirebaseDataToJSON, path);
    } catch (error) {
        console.error("Fehler beim Updaten:", error);
    }
}


/**
 * Determines which array to populate based on the Firebase data path.
 * Calls the appropriate function to push data into contacts, tasks, or users array.
 * @async
 * @param {string[]} firebaseKeys - Array of keys retrieved from Firebase.
 * @param {Object} responseFirebaseDataToJSON - Firebase data object keyed by ID.
 * @param {string} path - The backend path (e.g., 'contacts', 'tasks', 'user').
 */
async function checkPushToArray(firebaseKeys, responseFirebaseDataToJSON, path) {
    if (path == 'contacts') {
        await pushToContactsArray(firebaseKeys, responseFirebaseDataToJSON);
    } else if (path == 'tasks') {
        await pushToTaskArray(firebaseKeys, responseFirebaseDataToJSON);
    } else {
        await pushToUserArray(firebaseKeys, responseFirebaseDataToJSON);
    }
}


/**
 * Pushes Firebase contact data into the local contacts array.
 * @async
 * @param {string[]} firebaseKeys - Array of Firebase keys for contacts.
 * @param {Object} responseFirebaseDataToJSON - Firebase data object keyed by ID.
 */
async function pushToContactsArray(firebaseKeys, responseFirebaseDataToJSON) {
    contactsList = [];
    for (let index = 0; index < firebaseKeys.length; index++) {
        contactsList.push(
            {
                "id": firebaseKeys[index],
                "contact": responseFirebaseDataToJSON[firebaseKeys[index]],
            }
        )
    }
}


/**
 * Pushes Firebase task data into the local task array.
 * @async
 * @param {string[]} firebaseKeys - Array of Firebase keys for tasks.
 * @param {Object} responseFirebaseDataToJSON - Firebase data object keyed by ID.
 */
async function pushToTaskArray(firebaseKeys, responseFirebaseDataToJSON) {
    taskList = [];
    for (let index = 0; index < firebaseKeys.length; index++) {
        taskList.push(
            {
                "id": firebaseKeys[index],
                "task": responseFirebaseDataToJSON[firebaseKeys[index]],
            }
        )
    }
}


async function pushToUserArray(firebaseKeys, responseFirebaseDataToJSON) {
    userList = [];
    for (let index = 0; index < firebaseKeys.length; index++) {
        userList.push(
            {
                "id": firebaseKeys[index],
                "user": responseFirebaseDataToJSON[firebaseKeys[index]],
            }
        )
    }
}


/**
 * Deletes a task from Firebase by its ID and refreshes the UI.
 * - Closes the task detail dialog.
 * - Reloads the page after deletion.
 * @async
 * @param {string|number} taskID - The unique ID of the task to delete.
 * @param {string} path - The Firebase path where the task is stored.
 */
async function deleteTaskFromFirebase(taskID, path) {
    try {
        let userStorage = await fetch(BASE_URL + path + taskID + ".json", {
            method: "DELETE",
        });
    } catch (error) {
        console.error("Fehler beim Updaten:", error);
    }
    closeTaskDetailDialog();
}


/**
 * Deletes an assignee from a task in Firebase.
 * @async
 * @param {string|number} assigneeID - The unique ID of the assignee to delete.
 * @param {string} path - The Firebase path for the task collection.
 * @param {string|number} taskID - The ID of the task from which the assignee should be removed.
 */
async function deleteAssigneeInTaskList(assigneeID, path, taskID) {
    try {
        let userstorage = await fetch(BASE_URL + path + taskID + "/assignees/" + assigneeID + ".json", {
            method: "DELETE",
        });
    } catch (error) {
        console.error("Fehler beim Updaten:", error);
    }
}


/**
 * Updates the completion status of a subtask in Firebase.
 * Updates the subtask's 'done' property.
 * Refreshes the summary subtasks and done counter in the UI.
 * @async
 * @param {string|number} subtaskId - The ID of the subtask to update.
 * @param {string|number} taskID - The ID of the parent task.
 * @param {boolean} statusSubtask - True if subtask is done, false otherwise.
 * @param {number} taskIndex - Index of the task in the local array/UI.
 * @param {Object} taskContent - The content of the task (optional, for UI update).
 */
async function updateSubtaskStatus(subtaskId, taskID, statusSubtask, taskIndex, taskContent) {
    try {
        let userStorage = await fetch(BASE_URL + "tasks/" + taskID + "/" + "subtasks/" + subtaskId + "/done.json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(statusSubtask),
        });
    } catch (error) {
        console.error("Fehler beim Updaten:", error);
    }

    loadSummarySubtasks(taskID, taskIndex);
    loadCounterDoneSubtasks(taskID, taskIndex);
}


/**
 * Updates the status category of a task in Firebase.
 * @async
 * @param {string} category - The new status/category to set for the task.
 */
async function updateTaskStatus(category) {
    try {
        let taskElement = await fetch(BASE_URL + "tasks/" + currentDraggedElementID + "/statusTask.json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(category),
        });
    } catch (error) {
        console.error("Fehler beim Updaten:", error);
    }


}