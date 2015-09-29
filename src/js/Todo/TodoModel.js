(function (app) {

    "use strict";

    var pubSub = app.utils.pubSub,
        TodoModel = function (params) {

            pubSub.applyTo(this);

            if (!this.validateParams(params)) {
                throw Error("not valid params for new TodoModel");
            }

            this.id = params.id || (new Date().getTime()).toString();
            this.title = params.title;
            this.description = params.description;
            this.date = params.date;
            this.category = params.category || "pending";
        };

    TodoModel.prototype = {

        constructor: TodoModel,

        validateParams: function (params) {
            if (typeof params.title === "string" || typeof params.description === "string" || typeof params.date === "string") {
                if (params.title === "") {
                    throw Error("Title can`t be empty");
                }
                return true;
            }
            return false;
        },
        changeCategory: function (newCategoryName) {
            var categories = ["pending", "inProgress", "completed"];

            if (categories.some(function (categoryName) {
                    return categoryName === newCategoryName;
                })) {
                this.category = newCategoryName;
                return true;
            }

            throw Error("no category found");
        }
    };

    extend(app, 'myApp.modules.Todo')['TodoModel'] = TodoModel;

}(window.myApp));
