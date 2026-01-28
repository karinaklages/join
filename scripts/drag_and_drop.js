let dragTimer;
let isMobileDragging = false;
let mobileDragElement = null;
let mobileDragClone = null;
let currentTouchTargetColumn = null;
const LONG_PRESS_DURATION = 250;
let autoScrollSpeed = 0;
let autoScrollFrame = null;
const SCROLL_ZONE_SIZE = 200;
const MAX_SCROLL_SPEED = 15;


/**
 * Initializes mobile drag-and-drop support for task cards.
 * Removes existing touch event listeners to prevent duplicates.
 * Adds touchstart, touchmove, and touchend listeners with passive disabled.
 */
function initMobileDragAndDrop() {
  const cards = document.querySelectorAll(".style_task_card");
  cards.forEach((card) => {
    card.removeEventListener("touchstart", handleTouchStart);
    card.removeEventListener("touchmove", handleTouchMove);
    card.removeEventListener("touchend", handleTouchEnd);
    card.addEventListener("touchstart", handleTouchStart, { passive: false });
    card.addEventListener("touchmove", handleTouchMove, { passive: false });
    card.addEventListener("touchend", handleTouchEnd, { passive: false });
  });
}


/**
 * Handles automatic vertical scrolling during drag operations.
 * Continuously scrolls the window while autoScrollSpeed is non-zero.
 * Stops scrolling when autoScrollSpeed is reset.
 */
function processAutoScroll() {
  if (autoScrollSpeed !== 0) {
    window.scrollBy(0, autoScrollSpeed);
    autoScrollFrame = requestAnimationFrame(processAutoScroll);
  } else {
    autoScrollFrame = null;
  }
}


/**
 * Handles the start of a touch interaction on a task card.
 * Ignores multi-touch gestures.
 * Starts a long-press timer to initiate mobile drag mode.
 * 
 * @param {TouchEvent} e - The touchstart event.
 */
function handleTouchStart(e) {
  if (e.touches.length > 1) return;
  const card = e.target.closest(".style_task_card");
  if (!card) return;
  dragTimer = setTimeout(() => {
    startMobileDrag(e, card);
  }, LONG_PRESS_DURATION);
}


/**
 * Handles touch movement during mobile drag-and-drop.
 * Cancels drag if not active.
 * Prevents default scrolling behavior.
 * Moves the drag clone and detects drop zones.
 * Triggers automatic scrolling near screen edges.
 * 
 * @param {TouchEvent} e - The touchmove event.
 */
function handleTouchMove(e) {
  if (!isMobileDragging) return clearTimeout(dragTimer);
  if (e.cancelable) e.preventDefault();
  const { clientX, clientY } = e.touches[0];
  moveClone(clientX, clientY);
  detectDropZone(clientX, clientY);
  autoScrollSpeed = calculateScrollSpeed(clientY);
  if (autoScrollSpeed !== 0 && !autoScrollFrame) processAutoScroll();
}


/**
 * Calculates the vertical auto-scroll speed based on touch position.
 * Scrolls up when touch is near the top edge.
 * Scrolls down when touch is near the bottom edge.
 * Returns 0 when touch is outside scroll zones.
 * 
 * @param {number} y - The vertical touch position (clientY).
 * @returns {number} - The calculated scroll speed.
 */
function calculateScrollSpeed(y) {
  const limit = window.innerHeight - SCROLL_ZONE_SIZE;
  if (y < SCROLL_ZONE_SIZE) {
    return -Math.floor(
      ((SCROLL_ZONE_SIZE - y) / SCROLL_ZONE_SIZE) * MAX_SCROLL_SPEED,
    );
  }
  if (y > limit) {
    return Math.floor(((y - limit) / SCROLL_ZONE_SIZE) * MAX_SCROLL_SPEED);
  }
  return 0;
}


/**
 * Handles the end of a touch interaction.
 * Clears the long-press timer.
 * Finalizes the mobile drag-and-drop operation if active.
 * 
 * @async
 * @param {TouchEvent} e - The touchend event.
 */
async function handleTouchEnd(e) {
  clearTimeout(dragTimer);
  if (isMobileDragging) {
    e.preventDefault();
    await finishMobileDrop();
  }
}


/**
 * Starts the mobile drag operation for a task card.
 * Activates mobile dragging state.
 * Triggers haptic feedback if supported.
 * Extracts task index and ID from the ondragstart attribute.
 * Creates a visual clone of the dragged card.
 * 
 * @param {TouchEvent} e - The touchstart event.
 * @param {HTMLElement} card - The task card element being dragged.
 */
function startMobileDrag(e, card) {
  isMobileDragging = true;
  mobileDragElement = card;
  if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.hasBeenActive)) navigator.vibrate(50);
  const match = card.getAttribute("ondragstart")?.match(/startDragging\(\w+,\s*(\d+),\s*'([^']+)'\)/);
  if (match) {
    currentDraggedElementIndex = parseInt(match[1]);
    currentDraggedElementID = match[2];
  }
  createMobileClone(card);
  card.classList.add("mobile_drag_active_original");
}


/**
 * Creates a visual clone of the dragged element for mobile drag feedback.
 * Copies size and position from the original element.
 * Adds a clone-specific CSS class.
 * 
 * @param {HTMLElement} original - The original task card element.
 */
function createMobileClone(original) {
  const rect = original.getBoundingClientRect();
  mobileDragClone = original.cloneNode(true);
  mobileDragClone.style.width = `${rect.width}px`;
  mobileDragClone.style.height = `${rect.height}px`;
  mobileDragClone.style.left = `${rect.left}px`;
  mobileDragClone.style.top = `${rect.top}px`;
  mobileDragClone.classList.add("mobile_drag_clone");
  document.body.appendChild(mobileDragClone);
}


/**
 * Moves the mobile drag clone to follow the touch position.
 * Centers the clone relative to the touch coordinates.
 * 
 * @param {number} x - The horizontal touch position (clientX).
 * @param {number} y - The vertical touch position (clientY).
 */
function moveClone(x, y) {
  if (mobileDragClone) {
    const width = mobileDragClone.offsetWidth;
    const height = mobileDragClone.offsetHeight;
    mobileDragClone.style.left = `${x - width / 2}px`;
    mobileDragClone.style.top = `${y - height / 2}px`;
  }
}


/**
 * Detects the board column currently under the touch position.
 * Temporarily hides the drag clone to detect underlying elements.
 * Highlights the detected column.
 * Stores the current target column for drop handling.
 * 
 * @param {number} x - The horizontal touch position (clientX).
 * @param {number} y - The vertical touch position (clientY).
 */
function detectDropZone(x, y) {
  mobileDragClone.style.display = "none";
  let elemBelow = document.elementFromPoint(x, y);
  mobileDragClone.style.display = "block";
  if (!elemBelow) return;
  let column = elemBelow.closest('[id^="board_column_"]');
  removeHighlight("todo", "inProgress", "awaitFeedback", "done");
  if (column) {
    let status = column.id.replace("board_column_", "");
    highlight(status);
    currentTouchTargetColumn = status;
  } else {
    currentTouchTargetColumn = null;
  }
}


/**
 * Finalizes the mobile drop: stops auto-scroll, removes temporary DOM elements,
 * clears highlights, executes the drop logic, and resets all state variables.
 */
async function finishMobileDrop() {
  autoScrollSpeed = 0;
  if (autoScrollFrame) cancelAnimationFrame(autoScrollFrame), autoScrollFrame = null;
  mobileDragClone?.remove();
  mobileDragElement?.classList.remove("mobile_drag_active_original");
  removeHighlight("todo", "inProgress", "awaitFeedback", "done");
  if (currentTouchTargetColumn) await drop(currentTouchTargetColumn);
  isMobileDragging = false;
  mobileDragElement = mobileDragClone = currentTouchTargetColumn = null;
}


/**
 * Initiates a desktop drag operation for a task card.
 * Sets the currently dragged task index and ID.
 * Adds a visual class to indicate the card is being dragged.
 * 
 * @param {DragEvent} event - The dragstart event.
 * @param {number} index - The index of the task in the local task array.
 * @param {string} taskID - The unique ID of the task being dragged.
 */
function startDragging(event, index, taskID) {
  currentDraggedElementIndex = index;
  currentDraggedElementID = taskID;
  let card = event.target;
  if (!card.classList.contains("style_task_card")) {
    card = card.closest(".style_task_card");
  }
  if (card) {
    card.classList.add("dragged_task_visual");
  }
}


/**
 * Ends the drag operation for a task card.
 * Removes the visual dragging class from the card.
 * 
 * @param {DragEvent} event - The dragend event.
 */
function stopDragging(event) {
  let card = event.target;
  if (!card.classList.contains("style_task_card")) {
    card = card.closest(".style_task_card");
  }
  if (card) {
    card.classList.remove("dragged_task_visual");
  }
}


/**
 * Allows a drop operation by preventing the default browser behavior.
 * 
 * @param {DragEvent} event - The dragover event.
 */
function allowDrop(event) {
  event.preventDefault();
}


/**
 * Handles dropping a task into a new category.
 * Updates the task status in Firebase.
 * Reloads the board content to reflect changes.
 * 
 * @async
 * @param {string} category - The target category/status for the dropped task.
 */
async function drop(category) {
  await updateTaskStatus(category);
  await loadContentBoard();
}


/**
 * Highlights one or more board columns as valid drop targets.
 * 
 * @param {...string} ids - Column identifiers (e.g., 'todo', 'inProgress', 'done').
 */
function highlight(...ids) {
  ids.forEach((id) => {
    let element = document.getElementById("board_column_" + id);
    if (element) {
      element.classList.add("drag_area_highlight");
    }
  });
}


/**
 * Removes the highlight from one or more board columns.
 * 
 * @param {...string} ids - Column identifiers (e.g., 'todo', 'inProgress', 'done').
 */
function removeHighlight(...ids) {
  ids.forEach((id) => {
    let element = document.getElementById("board_column_" + id);
    if (element) {
      element.classList.remove("drag_area_highlight");
    }
  });
}