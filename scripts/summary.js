
/**
 * Initializes the "Add Task" view.
 */
function initSummary() {
 init(),
 loadSummary(), 
 loadNumberofTasks()
}


/**
 * Loads and displays various task summaries on the summary page.
 */
async function loadNumberofTasks(){
    await loadFirebaseData('tasks')
    loadSumAllTasks();
    loadSumOfEachTask();
    loadUrgentTasks();
    loadEarliestDueDate();
}


/**
 * Loads and displays the total number of tasks.
 */
function loadSumAllTasks(){
    let allTaskSummaryElement = document.getElementById('id_summary_allTasks');
    let sumAllTasks = taskList.length;
    allTaskSummaryElement.innerHTML = sumAllTasks;
}


/**
 * Loads and displays the number of tasks for each status category.
 */
function loadSumOfEachTask(){
let status = ['todo', 'done', 'inProgress', 'awaitFeedback'];
    status.forEach(statusElement => {
        let numberStatusTask = 0;
        taskList.forEach(taskElement => {
            if(statusElement == taskElement.task.statusTask)
            numberStatusTask ++;
        })    
        let taskHTMLElement = document.getElementById('id_summary_'+ statusElement);
        taskHTMLElement.innerHTML = numberStatusTask;
        numberStatusTask = 0;
    })
}


/**
 * Loads and displays the number of urgent tasks.
 */
function loadUrgentTasks(){
    let sumUrgentTasks = 0;
    taskList.forEach(taskElement => {
        if (taskElement.task.priority.name == 'urgent')
            sumUrgentTasks++
    })
    let taskHTMLElement = document.getElementById("id_summary_urgent");
    taskHTMLElement.innerHTML = sumUrgentTasks;
}


/**
 * Loads and displays the earliest due date among urgent tasks.
 */
function loadEarliestDueDate(){
    let dueDateHTMLElement = document.getElementById("id_summary_dueDate");
    let now = new Date();
    let urgentDueDates = taskList
        .filter(taskElement => taskElement.task.priority.name === "urgent" && new Date(taskElement.task.dueDate) >= now)
        .map(taskElement => new Date(taskElement.task.dueDate));
      if (urgentDueDates.length === 0) {
        dueDateHTMLElement.textContent = "No Urgent Task available";
        return;
    }
    const earliestDueDate = urgentDueDates.reduce((closest, current) => {
        return Math.abs(current - now) < Math.abs(closest - now) ? current : closest;
    });
    dueDateHTMLElement.innerHTML =earliestDueDate.toISOString().split("T")[0];
}