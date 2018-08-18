import pubSub from '../services/pub-sub';
import TodoModel from './todo-model';


export default class TodoCollection {
  constructor(todoData) {
    pubSub.applyTo(this);

    this.validateTodoData(todoData);

    this._todoCollection = {};

    this.addTodos(todoData);

    this.reset = this.reset.bind(this);
  }

  reset() {
    this._todoCollection = {};
  }

  getTodoCollection() {
    return this._todoCollection;
  }

  addTodos(todoItems) {
    for (let todoItem in todoItems) {
      if (todoItems.hasOwnProperty(todoItem)) {
        this.addTodo(new TodoModel(todoItems[todoItem]));
      }
    }
  }

  addTodo(todoData) {
    const todoModel = new TodoModel(todoData);

    this.getTodoCollection()[todoModel.id] = todoModel;

    return todoModel;
  }

  validateTodoId(id) {
    if (typeof id !== 'number') {
      throw Error('todoId must be a number');
    }

    return true;
  }

  validateTodoData(todoData) {
    if (todoData && typeof todoData !== 'object') {
      throw Error('todoData must be an object');
    }

    return true;
  }

  getTodoById(id) {
    this.validateTodoId(id);

    return this.getTodoCollection()[id];
  }

  updateTodoById(id, todoData) {
    this.validateTodoData(todoData);
    this.validateTodoId(id);

    const todoModel = new TodoModel(todoData);

    this.getTodoCollection()[id] = todoModel;
  }

  removeTodo(id) {
    this.validateTodoId(id);

    const todoCollection = this.getTodoCollection();

    delete todoCollection[id];

    return todoCollection;
  }
}
