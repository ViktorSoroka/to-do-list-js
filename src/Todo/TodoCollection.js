import pubSub from '../utils/pub-sub';
import TodoModel from './TodoModel';


export default class TodoCollection {
  constructor(todoItems) {
    pubSub.applyTo(this);

    if (todoItems && typeof todoItems !== 'object') {
      throw Error('data must be an object');
    }

    this._todoCollection = {};

    for (let todoItem in todoItems) {
      if (todoItems.hasOwnProperty(todoItem)) {
        this.addNewTodo(new TodoModel(todoItems[todoItem]));
      }
    }
  }

  reset() {
    this._todoCollection = {};
  }

  getTodoCollection() {
    return this._todoCollection;
  }

  addNewTodo(todoData) {
    let todoModel;

    if (typeof todoData !== 'object') {
      throw Error('todoData must br object');
    }

    todoModel = new TodoModel(todoData);
    this.getTodoCollection()[todoModel.id] = todoModel;

    return todoModel;
  }

  getTodoById(todoId) {

    if (typeof todoId !== 'string') {
      throw Error('todoId must be a string');
    }
    return this.getTodoCollection()[todoId];
  }

  updateTodoById(id, todoData) {
    let todoModel;

    if (typeof todoData !== 'object') {
      throw Error('todoData must br object');
    }

    if (typeof id !== 'string') {
      throw Error('todo id must be a string');
    }

    todoModel = new TodoModel(todoData);
    this.getTodoCollection()[id] = todoModel;
  }

  removeTodo(id) {
    const todoCollection = this.getTodoCollection();

    if (typeof id !== 'string') {
      throw Error('todo id must be a string');
    }

    delete todoCollection[id];

    return todoCollection;
  }
}
