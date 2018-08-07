let todoList;
let todoListState;

function init() {
    todoList = [];
    todoListState = [];
}

function addEntry(entryName, state) {
    todoList.push(entryName);
}

function removeEntry(entryName) {
    let index = todoList.indexOf(entry);
    if (index > -1) {
        todoList.splice(index, 1);
    }
}

function showEntryNameDialog() {

}