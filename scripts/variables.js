const colors = [
  "#ff7a00",
  "#ff5eb3",
  "#5848e6",
  "#9327ff",
  "#00bee8",
  "#1fd7c1",
  "#c37fed",
  "#4eefac",
  "#fc71ff",
  "#ffc800",
  "#0038ff",
  "#7Ae229",
  "#ffdc2f",
  "#ff3d00",
  "#ffa800",
]

let colorIndex = 0;


const BASE_URL = "https://join-f5da0-default-rtdb.europe-west1.firebasedatabase.app/";


let contactsList = [];
let taskList = [];


const ICONS = {
  LOCK: './assets/img/lock_icon.svg',
  OFF: './assets/img/visibility_off.svg',
  ON: './assets/img/visibility.svg'
};


let currentDraggedElementIndex;
let currentDraggedElementID;
let prefillAssigneeCheckbox = [];