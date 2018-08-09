var todoList;
var listEntryTemplate = '<li class="mdl-list__item mdl-list__item--two-line"> ' +
    '<button class="mdl-button mdl-js-button mdl-button--icon mdl-ext__micro-button">'+
    '<i class="material-icons">keyboard_arrow_up</i>'+
    '</button>'+
    '<button class="mdl-button mdl-js-button mdl-button--icon mdl-ext__micro-button">'+
    '<i class="material-icons">keyboard_arrow_down</i>'+
    '</button>'+
    '<span class="mdl-list__item-primary-content"> ' +
    '<span>{$title}</span> ' +
    '<span class="mdl-list__item-sub-title">{$text}</span> ' +
    '</span> ' +
    '<span class="mdl-list__item-secondary-action"> ' +
    '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="{$id}"> ' +
    '<input type="checkbox" id="{$id}" class="mdl-checkbox__input" {$state}/> </label> </span> </li>';

function initTestData() {
    todoList = new TodoList();

    createNewEntry("a", "lorem ipsum dolor sit amet");
    createNewEntry("b", "lorem ipsum dolor sit amet");
    createNewEntry("c", "lorem ipsum dolor sit amet");
    createNewEntry("d", "lorem ipsum dolor sit amet");
}

function initTodoListHandler() {
    bindButtonEvents();
    loadEntriesFromStorage();
}

function bindButtonEvents() {
    $("#addTodoButton").click(function() {
        showAddEntryDialog();
    })
}

function showAddEntryDialog() {

}

function loadEntriesFromStorage() {
    loadTodoListData();

    cleanupEntryHtml();
    todoList.entries.forEach(entry => {
        appendEntryHtml(entry);
    })
}

function createNewEntry(title, text) {
    const entry = new TodoListEntry(title, text, false);

    todoList.add(entry);
    appendEntryHtml(entry);

    storeTodoListData();
}

function deleteEntryById(id) {
    todoList.removeEntryById(id);
    removeEntryHtmlById(id);

    storeTodoListData();
}

function cleanupEntryHtml() {
    $("#myTodoList").empty();
}

function removeEntryHtmlById(id) {
    const idString = "#" + id;

    $(idString).parents("li").remove();
}

function appendEntryHtml(entry) {
    let template = listEntryTemplate;

    template = template.replace(/{\$title}/g, entry.title);
    template = template.replace(/{\$text}/g, entry.text);
    template = template.replace(/{\$id}/g, entry.id);

    let checked = "";
    if(entry.state === true) {
        checked = "checked";
    }

    template = template.replace(/{\$state}/g, checked);

    console.log(template);

    $("#myTodoList").append($(template));

    let htmlEntry = $("#" + entry.id)
    htmlEntry.parent().change(function () {
        let input = $(this).find("input");
        let id = input.attr("id");

        console.log(input.prop("checked"));
        todoList.getEntryById(id).state = input.prop("checked");

        storeTodoListData();
    });

    htmlEntry.parents("li").find(".mdl-button:contains('keyboard_arrow_up')").click(function() {
        moveHtmlEntryUp(entry.id);
    });

    htmlEntry.parents("li").find(".mdl-button:contains('keyboard_arrow_down')").click(function() {
        moveHtmlEntryDown(entry.id);
    });

    componentHandler.upgradeDom();
}

function moveHtmlEntryUp(id) {
    console.log("Move up for " + id);

    if(todoList.moveEntryUpById(id)) {
        storeTodoListData();
        loadEntriesFromStorage();
    }
}

function moveHtmlEntryDown(id) {
    console.log("Move down for " + id);

    if(todoList.moveEntryDownById(id)) {
        storeTodoListData();
        loadEntriesFromStorage();
    }
}


function storeTodoListData() {
    console.log("Storing TodoListData");

    let json = JSON.stringify(todoList);
    localStorage.setItem("myTodo", json);
}

function loadTodoListData() {
    let json = localStorage.getItem("myTodo");
    let jsonObject = JSON.parse(json);
    todoList = Object.assign(new TodoList, jsonObject);

    if(todoList === null) {
        todoList = new TodoList();
    }
}

class TodoListEntry {
    constructor(title, text, state) {
        this.id = guid();
        this.title = title;
        this.text = text;
        this.state = state;
    }
}

class TodoList {
    constructor() {
        this.entries = []
    }

    add(entry) {
        this.entries.push(entry);
    }

    removeEntryById(id) {
        const result = this.entries.filter(e => e.id === id);

        if(result.length > 0) {
            let i = this.entries.indexOf(result[0]);

            if(i !== -1) {
                this.entries.splice(i, 1);
            }
        }
    }

    getEntryById(id) {
        return this.entries.filter(e => e.id === id)[0];
    }

    moveEntryUpById(id) {
        let entry = this.getEntryById(id);
        if(entry === undefined) return false;

        let pos = this.entries.indexOf(entry);
        let newPos = pos-1;

        if(newPos >= 0) {
            TodoList.array_move(this.entries, pos, newPos);
            console.log("Moved + " + id + " from " + pos + " to " + newPos);

            return true;
        }

        return false;
    }

    moveEntryDownById(id) {
        let entry = this.getEntryById(id);
        if(entry === undefined) return false;

        let pos = this.entries.indexOf(entry);
        let newPos = pos+1;

        if(newPos < this.entries.length) {
            TodoList.array_move(this.entries, pos, newPos);
            console.log("Moved + " + id + " from " + pos + " to " + newPos);

            return true;
        }

        return false;
    }

    static array_move(arr, old_index, new_index) {
        if (new_index >= arr.length) {
            let k = new_index - arr.length + 1;
            while (k--) {
                arr.push(undefined);
            }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr;
    }
}