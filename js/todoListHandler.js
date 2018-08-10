var myTodoList;
var startupTodoList;
var listEntryTemplate = '<li class="mdl-list__item mdl-ext_todolist__item"> ' +
    '{$uparrowbutton}'+
    '{$downarrowbutton}'+
    '<span class="mdl-list__item-primary-content"> ' +
    '<span class="wrapped">{$title}</span> ' +
    '</span> ' +
    '<span class="mdl-list__item-secondary-action"> ' +
    '<label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="{$id}"> ' +
    '<input type="checkbox" id="{$id}" class="mdl-checkbox__input" {$state}/> </label> </span> </li>';

var upArrowButtonTemplate = '<button class="mdl-button mdl-js-button mdl-button--icon mdl-ext__micro-button">'+
    '<i class="material-icons">keyboard_arrow_up</i>'+
    '</button>';

var downArrowButtonTemplate = '<button class="mdl-button mdl-js-button mdl-button--icon mdl-ext__micro-button">'+
    '<i class="material-icons">keyboard_arrow_down</i>'+
    '</button>';

function initTestData() {
    createNewEntry("a", myTodoList, "myTodoList");
    createNewEntry("b", myTodoList, "myTodoList");
    createNewEntry("c", myTodoList, "myTodoList");
    createNewEntry("d", myTodoList, "myTodoList");
}

function initTodoListHandler() {
    loadMyTodoListEntriesFromStorage();
    loadStartupTodoListEntriesFromStorage();

    initDeleteAllDialog();
    initAddEntryDialog();
    initProgressbars();
}

function initProgressbars() {
    updateProgressbar("myTodoProgressbar", myTodoList);
    updateProgressbar("startupTodoProgressbar", startupTodoList);
}

function updateProgressbar(id, list) {
    let entries = list.entries.length;
    let done = list.entries.filter(e => e.state).length;
    let val = (done / entries) * 100;

    $("#"+id+">.progressbar").css("width", val + "%");
}

function initAddEntryDialog() {
    let dialog = document.querySelector('#createDialog');

    if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }

    $("#addTodoButton").click(function() {
        dialog.showModal();
    });

    $("#newEntryCancel").click(function() {
        let title = $("#newEntryTitle");
        let text = $("#newEntryText");

        title.val("");
        title.parent().removeClass("is-dirty");

        text.val("");
        text.parent().removeClass("is-dirty");

        dialog.close();
    });

    $("#newEntryCreate").click(function() {
        let title = $("#newEntryTitle");
        //let text = $("#newEntryText");

        createNewEntry(title.val(), myTodoList, "myTodoList");

        title.val("");
        title.parent().removeClass("is-dirty");

        //text.val("");
        //text.parent().removeClass("is-dirty");

        dialog.close();
    });
}

function initDeleteAllDialog() {
    let dialog = document.querySelector('#deleteDialog');

    if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }

    $("#deleteAllButton").click(() => {
        dialog.showModal();
    });

    $("#deleteAllConfirm").click(() => {
        let ids = myTodoList.entries.map(e => e.id);

        ids.forEach(id => {
            deleteEntryById(id);
        });

        dialog.close();
    });

    $("#deleteAllCancel").click(() => {
        dialog.close();
    })
}

function loadMyTodoListEntriesFromStorage() {
    myTodoList = loadTodoListData("myTodo");
    cleanupEntryHtml("myTodoList");
    myTodoList.entries.forEach(entry => {
        appendEntryHtml(entry, "myTodoList", myTodoList);
    });
}

function loadStartupTodoListEntriesFromStorage() {
    startupTodoList = loadTodoListData("startupTodo");
    cleanupEntryHtml("startupTodoList");

    if(startupTodoList.entries.length === 0) {
        initStartupTodoListEntries();
    } else {
        startupTodoList.entries.forEach(entry => {
            appendEntryHtml(entry, "startupTodoList", startupTodoList, true);
        });
    }
}

function initStartupTodoListEntries() {
    newStartupEntry("Businessplan aufstellen");
    newStartupEntry("Finanzierung absichern");
    newStartupEntry("Versicherungen abklären");
    newStartupEntry("Genehmigungpflicht prüfen");
    newStartupEntry("Rechtsform wählen");
    newStartupEntry("Standort festsetzen");
    newStartupEntry("Unternehmen anmelden");
}

function newStartupEntry(title) {
    createNewEntry(title, startupTodoList, "startupTodoList", true);
}

function handleChangedTodoListData(listId) {
    switch(listId) {
        case "myTodoList":
            storeTodoListData("myTodo", myTodoList);
            updateProgressbar("myTodoProgressbar", myTodoList);
            break;
        case "startupTodoList":
            storeTodoListData("startupTodo", startupTodoList);
            updateProgressbar("startupTodoProgressbar", startupTodoList);
            break;
        default:
    }
}

function createNewEntry(title, todoList, htmlId, simple = false) {
    const entry = new TodoListEntry(title, false);

    todoList.add(entry);
    appendEntryHtml(entry, htmlId, todoList, simple);

    handleChangedTodoListData(htmlId);
}


function deleteEntryById(id) {
    myTodoList.removeEntryById(id);
    removeEntryHtmlById(id);

    handleChangedTodoListData("myTodoList");
}

function cleanupEntryHtml(todoListId) {
    $("#" + todoListId).empty();
}

function removeEntryHtmlById(id) {
    const idString = "#" + id;

    $(idString).parents("li").remove();
}

function appendEntryHtml(entry, todoListId, todoList, simple = false) {
    let template = listEntryTemplate;

    template = template.replace(/{\$title}/g, entry.title);
    template = template.replace(/{\$text}/g, entry.text);
    template = template.replace(/{\$id}/g, entry.id);

    let checked = "";
    if(entry.state === true) {
        checked = "checked";
    }

    template = template.replace(/{\$state}/g, checked);

    //insert arrows if not simple
    if(!simple) {
        template = template.replace(/{\$uparrowbutton}/g, upArrowButtonTemplate);
        template = template.replace(/{\$downarrowbutton}/g, downArrowButtonTemplate);
    } else {
        template = template.replace(/{\$uparrowbutton}/g, "");
        template = template.replace(/{\$downarrowbutton}/g, "");
    }

    $("#" + todoListId).append($(template));

    let htmlEntryCheckbox = $("#" + entry.id);
    let htmlListEntry = htmlEntryCheckbox.parents("li");
    htmlEntryCheckbox.parent().change(function () {
        let input = $(this).find("input");
        let id = input.attr("id");

        todoList.getEntryById(id).state = input.prop("checked");

        handleChangedTodoListData(todoListId);
    });

    htmlListEntry.find(".mdl-button:contains('keyboard_arrow_up')").click(function() {
        moveHtmlEntryUp(entry.id);
    });

    htmlListEntry.find(".mdl-button:contains('keyboard_arrow_down')").click(function() {
        moveHtmlEntryDown(entry.id);
    });

    htmlListEntry.find(".mdl-list__item-primary-content").click(function() {
        htmlEntryCheckbox.click();
    });

    componentHandler.upgradeDom();
}

function moveHtmlEntryUp(id) {
    if(myTodoList.moveEntryUpById(id)) {
        handleChangedTodoListData("myTodoList");
        loadMyTodoListEntriesFromStorage();
    }
}

function moveHtmlEntryDown(id) {
    if(myTodoList.moveEntryDownById(id)) {
        handleChangedTodoListData("myTodoList");
        loadMyTodoListEntriesFromStorage();
    }
}
