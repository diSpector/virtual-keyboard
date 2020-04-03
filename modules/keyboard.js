import { Button } from './button.js';

export class Keyboard {
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
    for (const prop in this.keysObj) {
      const button = new Button(prop, this.keysObj[prop], this.language, container);
      button.render();
    }
  }
}
