var myTodoList;
var listEntryTemplate = '<li class="mdl-list__item mdl-list__item--two-line"> ' +
    '{$uparrowbutton}'+
    '{$downarrowbutton}'+
    '<span class="mdl-list__item-primary-content"> ' +
    '<span>{$title}</span> ' +
    '<span class="mdl-list__item-sub-title">{$text}</span> ' +
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
    myTodoList = new TodoList();

    createNewEntry("a", "lorem ipsum dolor sit amet");
    createNewEntry("b", "lorem ipsum dolor sit amet");
    createNewEntry("c", "lorem ipsum dolor sit amet");
    createNewEntry("d", "lorem ipsum dolor sit amet");
}

function initTodoListHandler() {
    loadMyTodoListEntriesFromStorage();

    initDeleteConfirmDialog();
    initAddEntryDialog();
    initProgressbar();
}

function initProgressbar() {
    updateProgressbar();
}

function updateProgressbar() {
    let entries = myTodoList.entries.length;
    let done = myTodoList.entries.filter(e => e.state).length;
    let val = (done / entries) * 100;

    $("#myTodoProgressbar>.progressbar").css("width", val + "%");
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
        let text = $("#newEntryText");

        createNewEntry(title.val(), text.val());

        title.val("");
        title.parent().removeClass("is-dirty");

        text.val("");
        text.parent().removeClass("is-dirty");

        dialog.close();
    });
}

function initDeleteConfirmDialog() {
    let dialogButton = document.querySelector('.dialog-button');
    let dialog = document.querySelector('#deleteDialog');

    if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    dialogButton.addEventListener('click', function() {
        dialog.showModal();
    });
    dialog.querySelector('button:not([disabled])')
        .addEventListener('click', function() {
            dialog.close();
        });
}

function loadMyTodoListEntriesFromStorage() {
    myTodoList = loadTodoListData("myTodo");
    cleanupEntryHtml("myTodoList");
    myTodoList.entries.forEach(entry => {
        appendEntryHtml(entry, "myTodoList");
    });
}

function handleChangedTodoListData() {
    storeTodoListData("myTodo");
    updateProgressbar();
}

function createNewEntry(title, text) {
    const entry = new TodoListEntry(title, text, false);

    myTodoList.add(entry);
    appendEntryHtml(entry, "myTodoList");

    handleChangedTodoListData()
}

function initStartupTodoListEntries() {

}

function deleteEntryById(id) {
    myTodoList.removeEntryById(id);
    removeEntryHtmlById(id);

    handleChangedTodoListData()
}

function cleanupEntryHtml(todoListId) {
    $("#" + todoListId).empty();
}

function removeEntryHtmlById(id) {
    const idString = "#" + id;

    $(idString).parents("li").remove();
}

function appendEntryHtml(entry, todoListId, simple = false) {
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

        myTodoList.getEntryById(id).state = input.prop("checked");

        handleChangedTodoListData();
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
        handleChangedTodoListData();
        loadMyTodoListEntriesFromStorage();
    }
}

function moveHtmlEntryDown(id) {
    if(myTodoList.moveEntryDownById(id)) {
        handleChangedTodoListData();
        loadMyTodoListEntriesFromStorage();
    }
}
