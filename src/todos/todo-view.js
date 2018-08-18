import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui/ui/widgets/dialog';
import 'jquery-ui-css/base.css';
import 'jquery-ui-css/theme.css';
import 'jquery-ui-css/datepicker.css';
import 'jquery-ui-css/dialog.css';

import pubSub from '../services/pub-sub';
import { todoComponentTpl, todoItemTpl } from './templates/todo-templates';
import { allTodosRemoved, todoAdded, todoCategoryChanged, todoItemDropped } from './todo-actions';


export default class TodoView {
  constructor() {
    pubSub.applyTo(this);

    this.todoContainerSelector = '#todo-container';
    this.formSelector = '.todos-form';
    this.addTodoSelector = `${this.formSelector} .add-todo-btn`;
    this.deleteTodoAreaSelector = '.delete-todo-area';
    this.deleteTodosSelector = `${this.formSelector} .delete-todos-btn`;
    this.categories = ['pending', 'in-progress', 'completed'];

    this.tplAll = todoComponentTpl;
    this.tplItem = todoItemTpl;
  }

  renderAll() {
    const tpl = this.tplAll({ title: 'To Do List' });

    $(this.todoContainerSelector).html(tpl);
  }

  removeItem(id) {
    $(`[data-todo=${id}]`).remove();
  }

  renderItem($appendTo, todoModel) {
    $appendTo.append($(this.tplItem(todoModel)));
  }

  deleteTodos() {
    $('.todo').remove();

    pubSub.publish(allTodosRemoved);
  }

  generateDialog(msg) {
    const responseId = 'response-dialog';
    const title = 'Message';
    let responseDialog = $(`#${responseId}`);

    if (!responseDialog.length) {
      responseDialog = $('<div />', {
        title: title,
        id: responseId
      }).appendTo($('body'));
    }

    responseDialog.html(msg);

    const buttonOptions = {
      Ok() {
        responseDialog.dialog('close');
      }
    };

    responseDialog.dialog({
      autoOpen: true,
      width: 400,
      modal: true,
      closeOnEscape: true,
      buttons: buttonOptions
    });
  }

  generateElement(todoModel) {
    const self = this;
    const parent = $(`[data-todos-category=${todoModel.category}]`);

    if (!parent) {
      return;
    }

    this.renderItem(parent, todoModel);

    $(`[data-todo=${todoModel.id}]`).draggable({
      start() {
        $(`${self.deleteTodoAreaSelector}`).show();
      },
      stop() {
        $(`${self.deleteTodoAreaSelector}`).hide();
      },
      revert: 'invalid',
      revertDuration: 200
    });
  }

  todoAdd() {
    const inputs = $(`${this.formSelector} :input`);
    const errorMessage = 'Title can not be empty';

    const title = inputs[0].value;
    const description = inputs[1].value;
    const date = inputs[2].value;

    if (!title) {
      this.generateDialog(errorMessage);

      return;
    }

    const tempData = {
      title: title,
      date: date,
      description: description
    };

    pubSub.publish(todoAdded, tempData);

    // Reset Form
    inputs[0].value = '';
    inputs[1].value = '';
    inputs[2].value = '';
  }

  renderTodos(todoCollection) {
    $.each(todoCollection, (index, todoItem) => this.generateElement(todoItem));
  }

  attachDropOnCategories() {
    const self = this;

    this.categories.forEach((category, i) => {
      $(`[data-todos-category=${category}]`).droppable({
        drop(event, ui) {
          const element = ui.helper;
          const id = element.data('todo');

          // Removing old element
          self.removeItem(id);

          pubSub.publish(todoCategoryChanged, id, self.categories[i]);

          // Hiding Delete Area
          $(`${self.deleteTodoAreaSelector}`).hide();
        }
      });
    });
  }

  attachDropOnItems() {
    const self = this;

    $(`${self.deleteTodoAreaSelector}`).droppable({
      drop(event, ui) {
        const element = ui.helper;
        const id = element.data('todo');

        // Removing old element
        self.removeItem(id);

        // Updating local storage
        pubSub.publish(todoItemDropped, id);

        // Hiding Delete Area
        $(`${self.deleteTodoAreaSelector}`).hide();
      }
    })
  }

  initDatePicker() {
    const $datePicker = $(`${this.formSelector} .datepicker`);

    $datePicker.datepicker();
    $datePicker.datepicker('option', 'dateFormat', 'dd/mm/yy');
  }

  initDragAndDrop() {
    $('.todos-list').droppable();
    $('.todo-task').draggable({ revert: 'valid', revertDuration: 200 });
  }

  init(todoCollection) {
    this.renderAll();
    this.initDatePicker();
    this.initDragAndDrop();
    this.renderTodos(todoCollection);
    this.attachDropOnCategories();
    this.attachDropOnItems();

    $(this.addTodoSelector).on('click', this.todoAdd.bind(this));
    $(this.deleteTodosSelector).on('click', this.deleteTodos.bind(this));
  }
}
