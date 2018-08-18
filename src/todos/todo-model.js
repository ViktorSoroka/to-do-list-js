import pubSub from '../services/pub-sub';


export default class TodoModel {
  constructor(params) {
    pubSub.applyTo(this);

    if (!this.validateParams(params)) {
      throw Error('not valid params for new TodoModel');
    }

    this.id = params.id || (new Date().getTime()).toString();
    this.title = params.title;
    this.description = params.description;
    this.date = params.date;
    this.category = params.category || 'pending';
  }

  validateParams(params) {
    if (typeof params.title === 'string' || typeof params.description === 'string' || typeof params.date === 'string') {
      if (params.title === '') {
        throw Error('Title can`t be empty');
      }

      return true;
    }

    return false;
  }

  changeCategory(newCategoryName) {
    const categories = ['pending', 'in-progress', 'completed'];
    const categoryExists = categories.some(categoryName => categoryName === newCategoryName);

    if (categoryExists) {
      this.category = newCategoryName;

      return true;
    }

    throw Error('no category found');
  }
}
