export const todoItemTpl = (props) => `
  <div class="todo" data-todo="${props.id}" style="position: relative;">
    <div class="todo__header">${props.title}</div>
    <div class="todo__date">${props.date}</div>
    <div class="todo__description">${props.description}</div>
  </div>
`;

export const todoComponentTpl = (props) => `
  <div class="todos">
    <div class="todos-header">${props.title}</div>
  
    <div class="todos-list" data-todos-category="pending">
      <h3>Pending</h3>
    </div>
  
    <div class="todos-list" data-todos-category="in-progress">
      <h3>In Progress</h3>
    </div>
  
    <div class="todos-list" data-todos-category="completed">
      <h3>Completed</h3>
    </div>
  
    <div class="todos-list">
      <h3>Add a Todo</h3>
  
      <form class="todos-form">
        <input placeholder="Title"/>
        <textarea placeholder="Description"></textarea>
        <input class="datepicker" placeholder="Due Date (dd/mm/yyyy)"/>

        <button class="add-todo-btn" type="button">Add Todo</button>
        <button class="delete-todos-btn" type="button">Delete Todos</button>
      </form>

      <div class="delete-todo-area">Drag Here to Delete Todo</div>
    </div>
  `;
