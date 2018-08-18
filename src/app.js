import TodoDb from './todos/todo-db';
import TodoCollection from './todos/todo-collection';
import TodoView from './todos/todo-view';
import TodoController from './todos/todo-controller';

import './styles/todo.css';


const todoDb = new TodoDb();
const todoCollection = new TodoCollection(todoDb.getStructure());
const todoView = new TodoView();

new TodoController(todoView, todoCollection, todoDb);
