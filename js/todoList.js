class TodoListEntry {
    constructor(title, state) {
        this.id = guid();
        this.title = title;
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

        if(result.length > 1) {
            console.log("res >1");
        }

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

function storeTodoListData(key, list) {
    console.log("Storing TodoListData for key " + key);

    let json = JSON.stringify(list);
    localStorage.setItem(key, json);
}

function loadTodoListData(key) {
    let json = localStorage.getItem(key);
    let jsonObject = JSON.parse(json);
    let todoList = Object.assign(new TodoList, jsonObject);

    if(todoList === null) {
        todoList = new TodoList();
    }

    return todoList;
}