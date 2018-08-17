import $ from 'jquery';

import pubSub from '../utils/pub-sub';


export default class TodoDB {
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
    this._saveToLSL(db);
  }

  //save to local storage
  _saveToLSL(todoCollection) {
    localStorage.setItem('todoData', JSON.stringify(todoCollection));
    return 'todoData';
  }

  _getFromLs() {
    return JSON.parse(localStorage.getItem('todoData'));
  }
}
