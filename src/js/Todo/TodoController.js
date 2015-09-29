(function (app) {

    "use strict";

    var pubSub = app.utils.pubSub,
        TodoController = function (todoView, todoCollection, todoDb) {

            this.todoCollection = todoCollection;
            this.todoView = todoView;

            pubSub.applyTo(this);
            todoView.subscribe("removeAll", this.removeAll);
            todoDb.subscribe("todoCollectionUpdated", todoDb.updateDB);

            todoCollection.subscribe("todoAdded", function (todoData) {
                var newTodo = todoCollection.addNewTodo(todoData);

                todoView.generateElement(newTodo);
                todoDb.updateDB(todoCollection.getTodoCollection());
            });

            todoCollection.subscribe("categoryChanged", function (id, newCategory) {
                var todoModel = todoCollection.getTodoById(id);
                todoModel.changeCategory(newCategory);
                todoView.generateElement(todoModel);
                todoCollection.updateTodoById(id, todoModel);
                todoDb.updateDB(todoCollection.getTodoCollection());
            });

            todoCollection.subscribe("todoItemDropped", function (id) {
                todoCollection.removeTodo(id);
                todoDb.updateDB(todoCollection.getTodoCollection());
            });

            this.init();
        };

    TodoController.prototype = {

        constructor: TodoController,

        removeAll: function () {
            this.todoCollection.reset();
            this.todoView.clear();
        },
        init: function () {
            this.todoView.init(this.todoCollection.getTodoCollection());
        }
    };

    extend(app, 'myApp.modules.Todo')['TodoController'] = TodoController;

}(window.myApp));