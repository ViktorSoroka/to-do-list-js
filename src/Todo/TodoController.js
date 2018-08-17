import pubSub from '../utils/pub-sub';

export default class TodoController {
  constructor(todoView, todoCollection, todoDb) {
    pubSub.applyTo(this);

    this.todoCollection = todoCollection;
    this.todoView = todoView;

    todoView.subscribe('removeAll', this.removeAll);
    todoDb.subscribe('todoCollectionUpdated', todoDb.updateDB);

    todoCollection.subscribe('todoAdded', function (todoData) {
      const newTodo = todoCollection.addNewTodo(todoData);

      todoView.generateElement(newTodo);
      todoDb.updateDB(todoCollection.getTodoCollection());
    });

    todoCollection.subscribe('categoryChanged', function (id, newCategory) {
      const todoModel = todoCollection.getTodoById(id);

      todoModel.changeCategory(newCategory);
      todoView.generateElement(todoModel);
      todoCollection.updateTodoById(id, todoModel);
      todoDb.updateDB(todoCollection.getTodoCollection());
    });

    todoCollection.subscribe('todoItemDropped', function (id) {
      todoCollection.removeTodo(id);
      todoDb.updateDB(todoCollection.getTodoCollection());
    });

    this.init();
  }

  removeAll() {
    this.todoCollection.reset();
    this.todoView.clear();

    return this;
  }

  init() {
    this.todoView.init(this.todoCollection.getTodoCollection());

    return this;
  }
}