(function (app) {

    "use strict";

    var pubSub = app.utils.pubSub,
        TodoCollection = function (todoItems) {

            pubSub.applyTo(this);

            if (todoItems && typeof todoItems !== "object") {
                throw Error("data must be an object");
            }

            this._todoCollection = {};

            for (var todoItem in todoItems) {
                if (todoItems.hasOwnProperty(todoItem)) {
                    this.addNewTodo(new TodoModel(todoItems[todoItem]));
                }
            }

        },
        TodoModel = extend(app, 'myApp.modules.Todo')['TodoModel'];

    TodoCollection.prototype = {

        constructor: TodoCollection,

        reset: function () {
            this._todoCollection = {};
        },

        getTodoCollection: function () {
            return this._todoCollection;
        },

        addNewTodo: function (todoData) {

            var todoModel;
            if (typeof todoData !== "object") {
                throw Error("todoData must br object");
            }

            todoModel = new TodoModel(todoData);
            this.getTodoCollection()[todoModel.id] = todoModel;

            return todoModel;

        },

        getTodoById: function (todoId) {

            if (typeof todoId !== "string") {
                throw Error("todoId must be a string");
            }
            return this.getTodoCollection()[todoId];
        },

        updateTodoById: function (id, todoData) {

            var todoModel;

            if (typeof todoData !== "object") {
                throw Error("todoData must br object");
            }

            if (typeof id !== "string") {
                throw Error("todo id must be a string");
            }

            todoModel = new TodoModel(todoData);
            this.getTodoCollection()[id] = todoModel;
        },

        removeTodo: function (id) {

            var todoCollection = this.getTodoCollection();

            if (typeof id !== "string") {
                throw Error("todo id must be a string");
            }

            delete todoCollection[id];

            return todoCollection;
        }
    };

    extend(app, 'myApp.modules.Todo')['TodoCollection'] = TodoCollection;

}(window.myApp));