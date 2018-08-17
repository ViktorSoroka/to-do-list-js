import TodoDB from './Todo/TodoDB';
import TodoCollection from './Todo/TodoCollection';
import TodoView from './Todo/TodoView';
import TodoController from './Todo/TodoController';

import './css/todo.css';

const todoDb = new TodoDB();
const todoCollection = new TodoCollection(todoDb.getStructure());
const todoView = new TodoView();

new TodoController(todoView, todoCollection, todoDb);
