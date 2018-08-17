import $ from 'jquery';
import 'jquery-ui/ui/widgets/draggable';
import 'jquery-ui/ui/widgets/droppable';
import 'jquery-ui/ui/widgets/datepicker';
import 'jquery-ui-css/all.css';

import pubSub from '../utils/pub-sub';
import { todoComponentTpl, todoItemTpl } from './templates/todo-templates';

export default class TodoView {
  constructor() {
    pubSub.applyTo(this);

    this.formId = 'todo-form';
    this.deleteDiv = 'delete-div';
    this.clearData = 'clear-data';
    this.codes = {
      '1': '#pending',
      '2': '#inProgress',
      '3': '#completed'
    };

    this.tplAll = todoComponentTpl;
    this.tplItem = todoItemTpl;
  }

  renderAll() {
    $('#todo-container').html(this.tplAll({
      title: 'To Do List'
    }));
  }

  removeItem(id) {
    $('#' + id).remove();
  }

  renderItem($appendTo, todoModel) {
    $appendTo.append($(this.tplItem(todoModel)));
  }

  clear() {
    $('.todo-task').remove();
  }

  generateDialog(message) {
    const responseId = 'response-dialog';
    const title = 'Message';
    let responseDialog = $('#' + responseId);

    if (!responseDialog.length) {
      responseDialog = $('<div />', {
        title: title,
        id: responseId
      }).appendTo($('body'));
    }

    responseDialog.html(message);

    const buttonOptions = {
      'Ok'() {
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
    const parent = $('#' + todoModel.category);

    if (!parent) {
      return;
    }

    this.renderItem(parent, todoModel);

    $('#' + todoModel.id).draggable({
      start() {
        $('#' + self.deleteDiv).show();
      },
      stop() {
        $('#' + self.deleteDiv).hide();
      },
      revert: 'invalid',
      revertDuration: 200
    });
  }

  todoAdd() {
    const inputs = $('#' + this.formId + ' :input');
    const errorMessage = 'Title can not be empty';

    if (inputs.length !== 4) {
      return;
    }

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

    pubSub.publish('todoAdded', tempData);

    // Reset Form
    inputs[0].value = '';
    inputs[1].value = '';
    inputs[2].value = '';
  }

  generateEl(todoCollection) {
    $.each(todoCollection, (index, todoItem) => {
      this.generateElement(todoItem);
    });
  }

  attachDropOnCategories() {
    const self = this;

    $.each(this.codes, (newCategory, value) => {
      $(value).droppable({
        drop(event, ui) {
          const element = ui.helper;
          const id = element.attr('id');

          // Removing old element
          self.removeItem(id);

          pubSub.publish('categoryChanged', id, self.codes[newCategory].slice(1));

          // Hiding Delete Area
          $('#' + this.deleteDiv).hide();
        }
      });
    });
  }

  attachDropOnItems() {
    const self = this;

    $('#' + this.deleteDiv).droppable({
      drop(event, ui) {
        const element = ui.helper;
        const id = element.attr('id');

        // Removing old element
        self.removeItem(id);

        // Updating local storage
        pubSub.publish('todoItemDropped', id);

        // Hiding Delete Area
        $('#' + self.deleteDiv).hide();
      }
    })
  }

  initDatePicker() {
    const $datePicker = $('#datepicker');

    $datePicker.datepicker();
    $datePicker.datepicker('option', 'dateFormat', 'dd/mm/yy');
  }

  initDraggenDrop() {
    $('.task-container').droppable();
    $('.todo-task').draggable({ revert: 'valid', revertDuration: 200 });
  }

  init(todoCollection) {
    this.renderAll();
    this.initDatePicker();
    this.initDraggenDrop();
    this.generateEl(todoCollection);
    this.attachDropOnCategories();
    this.attachDropOnItems();
    $('.btn-add').on('click', this.todoAdd.bind(this));
    $('#' + this.clearData).on('click', this.clear.bind(this));
  }
}
