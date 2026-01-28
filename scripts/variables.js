let colorIndex = 0;

const colors = [
  "#f0abfc",
  "#e879f9",
  "#b578fb",
  "#781ad7",
  "#29abe2",
  "#1fd7c1",
  "#847ce1",
  "#cd88ed",
  "#2ba296",
  "#1e95a7",
  "#146178",
  "#6bc4df",
]


// FIREBASE
const BASE_URL = "https://join-f5da0-default-rtdb.europe-west1.firebasedatabase.app/";


// GET DATA
let contactsList = [];
let taskList = [];


// SIGN UP
const ICONS = {
  LOCK: './assets/img/lock_icon.svg',
  OFF: './assets/img/visibility_off.svg',
  ON: './assets/img/visibility.svg'
};


// BOARD
let currentDraggedElementIndex;
let currentDraggedElementID;
let prefillAssigneeCheckbox = [];
