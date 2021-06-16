const completeStorageKey = 'completed-tasks';
const incompleteStorageKey = 'incomplete-tasks';

const addButton = document.getElementsByTagName("button")[0];
const taskInput = document.getElementById("new-task");
const incompleteTasksHolder = document.getElementById(incompleteStorageKey);
const completedTasksHolder = document.getElementById(completeStorageKey);

const manageAddForm = () => {
    taskInput.tabIndex = 1;
    addButton.tabIndex = 1;

    addButton.disabled = true;

    addButton.onclick = () => {
        addTask(taskInput.value);
    }

    taskInput.onkeydown = (event) => {
        runIf(event.code === 'Enter', () => addButton.click())
    }

    taskInput.oninput = () => {
        addButton.disabled = !taskInput.value
    }
}

const getTaskElement = (taskString, completed) => {
    const listItem = document.createElement("li");
    const checkBox = document.createElement("input");
    const label = document.createElement("label");
    const editInput = document.createElement("input");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    checkBox.type = "checkbox";
    checkBox.checked = completed;
    editInput.type = "text";
    editButton.innerText = "Edit";
    editButton.className = "edit";
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";
    label.innerText = taskString;

    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    bindTaskEvents(listItem);

    return listItem;
}

const addTask = (taskString = "New Item", skipDuplications = false, completed = false)  =>{
    const listItemName = taskInput.value || taskString;
    const listItem = getTaskElement(listItemName, completed);

    runIf(
        completed,
        () => {
            completedTasksHolder.appendChild(listItem);
            extendStoredArray(completeStorageKey, taskString, skipDuplications);
        },
        () => {
            incompleteTasksHolder.appendChild(listItem);
            extendStoredArray(incompleteStorageKey, taskString, skipDuplications);
        },
    )

    taskInput.value = "";
    addButton.disabled = true;
}

function editTask() {
    const listItem = this.parentNode;
    const editInput = listItem.querySelectorAll("input[type=text]")[0];
    const label = listItem.querySelector("label");

    editInput.value = label.innerText

    this.innerText = "Save";
    this.onclick = changeTask;

    listItem.classList.toggle("editMode");
}

function changeTask() {
    const listItem = this.parentNode;
    const editInput = listItem.querySelectorAll("input[type=text]")[0];
    const label = listItem.querySelector("label");
    const ul = listItem.parentNode;
    const listItemIndex = getLIIndexInUL(this.parentNode);

    editStoredArrayItem(ul.id, editInput.value, listItemIndex);

    label.innerText = editInput.value

    this.innerText = "Edit";
    this.onclick = editTask;

    listItem.classList.toggle("editMode");
}

function deleteTask() {
    const listItem = this.parentNode;
    const ul = listItem.parentNode;
    const listItemIndex = getLIIndexInUL(listItem);

    ul.removeChild(listItem);

    removeStoredArrayItem(ul.id, listItemIndex);
}

function toggleTask() {
    const label = this.parentNode.querySelector("label");

    runIf(
        this.checked,
        () => {
            removeStoredArrayItem(incompleteTasksHolder.id, getLIIndexInUL(this.parentNode));
            extendStoredArray(completedTasksHolder.id, label.innerText);

            completedTasksHolder.appendChild(this.parentNode);
        },
        () => {
            removeStoredArrayItem(completedTasksHolder.id, getLIIndexInUL(this.parentNode));
            extendStoredArray(incompleteTasksHolder.id, label.innerText);

            incompleteTasksHolder.appendChild(this.parentNode);
        }
    )
}

function bindTaskEvents(taskListItem) {
    const checkBox = taskListItem.querySelectorAll("input[type=checkbox]")[0];
    const editButton = taskListItem.querySelectorAll("button.edit")[0];
    const deleteButton = taskListItem.querySelectorAll("button.delete")[0];

    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
    checkBox.onchange = toggleTask;
}

(function () {
    const completeTasks = getStored(completeStorageKey, ['See the Doctor']);
    const incompleteTasks = getStored(incompleteStorageKey, ['Pay Bills', 'Go Shopping']);

    manageAddForm();

    completeTasks.forEach((taskString) => addTask(taskString, true, true));
    incompleteTasks.forEach((taskString) => addTask(taskString, true));
})()
