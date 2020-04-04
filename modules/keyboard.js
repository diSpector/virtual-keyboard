import Button from './button.js';

export default class Keyboard {
  constructor(keysobj, language, container) {
    this.keysObj = keysobj;
    this.language = language;
    this.container = container;
  }

  render() { // нарисовать кнопки
    this.renderButtons();
  }

  renderButtons() { // нарисовать кнопки
    const container = document.querySelector(`.${this.container}`);
    Object.keys(this.keysObj).forEach((prop) => {
      const button = new Button(prop, this.keysObj[prop], this.language, container);
      button.render();
    });
  }
}
