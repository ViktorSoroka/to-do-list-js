(function (app) {

    "use strict";

    /**
     * @description - a constructor for creating databases
     * @param db {Object} - some database which then will store in the instance of a constructor
     * @constructor
     */
    var pubSub = app.utils.pubSub,
        TodoDB = function (db) {
            pubSub.applyTo(this);

            if (typeof db !== "undefined") {
                this.updateDB(db);
            } else {
                this._structure = this._getFromLs();
            }

        };

    /**
     * @description - a method which returns a database
     * @returns {Object} - a database
     */
    TodoDB.prototype = {
        constructor: TodoDB,
        getStructure: function () {
            return $.extend(true, {}, this._structure);
        },
        updateDB: function (db) {
            if (typeof db !== "object") {
                throw Error("db must be an object");
            }
            this._structure = db;
            this._saveToLSL(db);
        },
        //save to local storage
        _saveToLSL: function (todoCollection) {
            localStorage.setItem("todoData", JSON.stringify(todoCollection));
            return "todoData";
        },
        _getFromLs: function () {
            return JSON.parse(localStorage.getItem("todoData"));
        }
    };

    extend(app, 'myApp.modules.Todo')['TodoDB'] = TodoDB;

}(window.myApp));