export const todoItemTpl = (props) => `
  <div class="todo-task" id="${props.id}" style="position: relative;">
    <div class="task-header">${props.title}</div>
    <div class="task-date">${props.date}</div>
    <div class="task-description">${props.description}</div>
  </div>
`;

export const todoComponentTpl = (props) => `
  <div class="wrapper">
    <div id="header">${props.title}</div>
  
    <div class="task-list task-container" id="pending">
      <h3>Pending</h3>
    </div>
  
    <div class="task-list task-container" id="inProgress">
      <h3>In Progress</h3>
    </div>
  
    <div class="task-list task-container" id="completed">
      <h3>Completed</h3>
    </div>
  
    <div class="task-list">
      <h3>Add a task</h3>
  
      <form id="todo-form">
        <input type="text" placeholder="Title"/>
        <textarea placeholder="Description"></textarea>
        <input type="text" id="datepicker" placeholder="Due Date (dd/mm/yyyy)"/>
        <input type="button" class="btn btn-add btn-primary" value="Add Task"/>
      </form>
  
      <input id="clear-data" type="button" class="btn btn-primary" value="Clear Data"/>
  
      <div id="delete-div">Drag Here to Delete</div>
    </div>
  `;
