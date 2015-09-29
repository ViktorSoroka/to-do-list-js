(function (app) {

    "use strict";

    var pubSub = app.utils.pubSub,
        xhr,
        TodoView = function () {

            var self = this;

            pubSub.applyTo(this);

            xhr = $.get('./js/Todo/templates/todo-templates.htm', function (templates) {
                // Fetch the <script /> block from the loaded external
                // template file which contains our greetings template.
                self.tplAll = $(templates).filter('#todo-component-tpl').html();
                self.tplItem = $(templates).filter('#todo-item-tpl').html();
            });

        },
        formId = "todo-form",
        deleteDiv = "delete-div",
        codes = {
            "1": "#pending",
            "2": "#inProgress",
            "3": "#completed"
        };

    TodoView.prototype = {

        constructor: TodoView,

        renderAll: function () {

            $('#todo-container').html(Mustache.render(this.tplAll, {
                title: "To Do List"
            }));
        },
        removeItem: function (id) {
            $("#" + id).remove();
        },
        renderItem: function ($appendTo, todoModel) {
            $appendTo.append(Mustache.render(this.tplItem, todoModel));
        },
        clear: function () {
            $(".todo-task").remove();
        },
        generateDialog: function (message) {
            var responseId = "response-dialog",
                title = "Message",
                responseDialog = $("#" + responseId),
                buttonOptions;

            if (!responseDialog.length) {
                responseDialog = $("<div />", {
                    title: title,
                    id: responseId
                }).appendTo($("body"));
            }

            responseDialog.html(message);

            buttonOptions = {
                "Ok": function () {
                    responseDialog.dialog("close");
                }
            };

            responseDialog.dialog({
                autoOpen: true,
                width: 400,
                modal: true,
                closeOnEscape: true,
                buttons: buttonOptions
            });
        },
        generateElement: function (todoModel) {
            var parent = $("#" + todoModel.category),
                template = $('#template').html();

            if (!parent) {
                return;
            }
            this.renderItem(parent, todoModel);

            $("#" + todoModel.id).draggable({
                start: function () {
                    $("#" + deleteDiv).show();
                },
                stop: function () {
                    $("#" + deleteDiv).hide();
                },
                revert: "invalid",
                revertDuration: 200
            });

        },
        todoAdd: function () {
            var inputs = $("#" + formId + " :input"),
                errorMessage = "Title can not be empty",
                title, description, date, tempData;

            if (inputs.length !== 4) {
                return;
            }

            title = inputs[0].value;
            description = inputs[1].value;
            date = inputs[2].value;

            if (!title) {
                this.generateDialog(errorMessage);
                return;
            }

            tempData = {
                title: title,
                date: date,
                description: description
            };

            pubSub.publish("todoAdded", tempData);

            // Reset Form
            inputs[0].value = "";
            inputs[1].value = "";
            inputs[2].value = "";
        },
        generateEl: function (todoCollection) {

            var self = this;

            $.each(todoCollection, function (index, todoItem) {
                self.generateElement(todoItem);
            });

        },
        attachDropOnCategories: function () {
            var self = this;

            $.each(codes, function (newCategory, value) {
                $(value).droppable({
                    drop: function (event, ui) {
                        var element = ui.helper,
                            id = element.attr("id");
                        // Removing old element
                        self.removeItem(id);

                        pubSub.publish("categoryChanged", id, codes[newCategory].slice(1));

                        // Hiding Delete Area
                        $("#" + deleteDiv).hide();
                    }
                });
            });

        },
        attachDropOnItems: function () {
            var self = this;

            $("#" + deleteDiv).droppable({
                drop: function (event, ui) {
                    var element = ui.helper,
                        id = element.attr("id");

                    // Removing old element
                    self.removeItem(id);

                    // Updating local storage
                    pubSub.publish("todoItemDropped", id);

                    // Hiding Delete Area
                    $("#" + deleteDiv).hide();
                }
            })
        },
        initDatePicker: function () {

            var $datePicker = $("#datepicker");

            $datePicker.datepicker();
            $datePicker.datepicker("option", "dateFormat", "dd/mm/yy");

        },
        initDraggenDrop: function () {

            $(".task-container").droppable();
            $(".todo-task").draggable({revert: "valid", revertDuration: 200});

        },
        init: function (todoCollection) {
            var self = this;
            xhr.done(function () {
                self.renderAll();
                self.initDatePicker();
                self.initDraggenDrop();
                self.generateEl(todoCollection);
                self.attachDropOnCategories();
                self.attachDropOnItems();
                $(".btn-add").on("click", self.todoAdd.bind(self));
            });
        }
    };

    extend(app, 'myApp.modules.Todo')['TodoView'] = TodoView;

}(window.myApp));