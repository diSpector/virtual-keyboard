export class Button {
  constructor(id, buttonObj, language, container) {
    this.id = id;
    this.button = buttonObj;
    this.language = language;
    this.container = container;
  }

  render() {
    const buttonDiv = this.createButtonDiv();
    this.container.append(buttonDiv);
  }

  createButtonDiv() {
    const el = document.createElement('div');
    el.id = this.id;
    el.classList.add('button');
    if (this.button.hasOwnProperty('style')) {
      this.button.style.forEach((st) => {
        el.classList.add(st);
      });
    }
    el.innerText = this.button[this.language];
    // печать альтернативного текста (для цифр)
    if (this.button.hasOwnProperty('alternative')) {
      const alterEl = document.createElement('div');
      alterEl.classList.add('alternative');
      alterEl.innerText = this.button.alternative;
      el.append(alterEl);
    }
    return el;
  }
}
