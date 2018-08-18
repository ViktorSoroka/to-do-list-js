import pubSub from '../services/pub-sub';
import { allTodosRemoved, todoAdded, todoCategoryChanged, todoCollectionUpdated, todoItemDropped } from './todo-actions';


export default class TodoController {
  constructor(todoView, todoCollection, todoDb) {
    pubSub.applyTo(this);

    this.todoCollection = todoCollection;
    this.todoView = todoView;
    this.todoDb = todoDb;

    pubSub.subscribe(allTodosRemoved, this.removeAll.bind(this));
    pubSub.subscribe(todoCollectionUpdated, todoDb.updateDB);

    pubSub.subscribe(todoAdded, todoData => {
      const newTodo = todoCollection.addTodo(todoData);

      todoView.generateElement(newTodo);
      todoDb.updateDB(todoCollection.getTodoCollection());
    });

    pubSub.subscribe(todoCategoryChanged, (id, newCategory) => {
      const todoModel = todoCollection.getTodoById(id);

      todoModel.changeCategory(newCategory);
      todoView.generateElement(todoModel);
      todoCollection.updateTodoById(id, todoModel);
      todoDb.updateDB(todoCollection.getTodoCollection());
    });

    pubSub.subscribe(todoItemDropped, id => {
      todoCollection.removeTodo(id);
      todoDb.updateDB(todoCollection.getTodoCollection());
    });

    this.init();
  }

  removeAll() {
    this.todoCollection.reset();
    this.todoDb.reset();

    return this;
  }

  init() {
    this.todoView.init(this.todoCollection.getTodoCollection());

    return this;
  }
}
