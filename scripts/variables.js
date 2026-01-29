let colorIndex = 0;

const colors = [
  "#f4b8fe",
  "#f175fa",
  "#b279f5",
  "#8331d5",
  "#29abe2",
  "#1fd7c1",
  "#877fe3",
  "#d992fa",
  "#34a59a",
  "#1999ac",
  "#0f657f",
  "#7bd2ec",
]


// FIREBASE
const BASE_URL = "https://join-0126-default-rtdb.europe-west1.firebasedatabase.app/";


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
