import $ from 'jquery';

import pubSub from '../services/pub-sub';


const TODO_DATA_LS_KEY = 'TODO_DATA';

export default class TodoDb {
  constructor(db) {
    pubSub.applyTo(this);

    if (typeof db !== 'undefined') {
      this.updateDB(db);
    } else {
      this._structure = this._getFromLs();
    }
  }

  getStructure() {
    return $.extend(true, {}, this._structure);
  }

  updateDB(db) {
    if (typeof db !== 'object') {
      throw Error('db must be an object');
    }

    this._structure = db;
    this._saveToLS(db);
  }

  reset() {
    localStorage.removeItem(TODO_DATA_LS_KEY);
  }

  _saveToLS(todoCollection) {
    localStorage.setItem(TODO_DATA_LS_KEY, JSON.stringify(todoCollection));
  }

  _getFromLs() {
    return JSON.parse(localStorage.getItem(TODO_DATA_LS_KEY));
  }
}
