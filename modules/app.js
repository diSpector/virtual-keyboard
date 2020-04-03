import { Keyboard } from './keyboard.js';

export class App {
  constructor(appConfigObj, keysObj) {
    this.wrapperClass = appConfigObj.wrapperClass;
    this.keyboardConatainerClass = appConfigObj.keyboardConatainerClass;
    this.keyboardTextareaClass = appConfigObj.keyboardTextareaClass;
    this.keyboardKeysClass = appConfigObj.keyboardKeysClass;
    this.infoClass = appConfigObj.infoClass;
    this.keysObj = keysObj;
    this.language = this.getLanguage();
  }

  init() { // создать разметку (textarea, клавиатура с клавишами)
    this.renderKeyboardContainer();
    this.renderKeyboard(this.keysObj, this.language, this.keyboardKeysClass);
    this.renderInfo();
    this.preventDefaultOnTextarea();
    this.attachEventListeners();
  }

  attachEventListeners() { // назначить слушатели кликов и нажатий на клавиши
    this.attachClickEventListeners();
    this.attachPushEventListeners();
  }

  attachClickEventListeners() { // назначить слушатели кликов
    const container = document.querySelector(`.${this.keyboardKeysClass}`);
    container.addEventListener('mousedown', (event) => {
      // делегируем контейнеру клавиатуры клик по кнопке
      const button = event.target.closest('.button');
      if (!button) {
        return;
      }
      // this.processClick(button);
      this.processEvent(button);
    });

    container.addEventListener('mouseup', (event) => {
      // делегируем контейнеру клавиатуры клик по кнопке
      const button = event.target.closest('.button');
      if (!button) {
        return;
      }
      button.classList.remove('pressed');
    });
  }

  attachPushEventListeners() { // назначить слушатели нажатий на клавиши
    document.addEventListener('keydown', (event) => {
      if (event.altKey && event.shiftKey) { // переключение языка
        this.switchKeyboardLanguage();
      }
      const button = document.getElementById(event.code);
      if (!button) {
        return;
      }

      this.processEvent(button);
      // this.processPush(button);
    });

    document.addEventListener('keyup', (event) => {
      const button = document.getElementById(event.code);
      if (!button) {
        return;
      }
      button.classList.remove('pressed');
    });
  }

  processEvent (element) { // обработка события нажатия/клика
    element.classList.add('pressed');
    // const textarea = document.querySelector(`.${this.keyboardTextareaClass}`);
    const textarea = document.querySelector('textarea');
    if (!element.classList.contains('special')) {
      // textarea.value += element.innerText;
      textarea.value += element.firstChild.nodeValue; // т.к. у цифр есть вложенные div
    }
    // добавить обработку нажатия спецсимвола
  }

  // processPush(element) {
  //     element.classList.add('pressed');
  //     const textarea = document.querySelector('textarea');
  //     if (!element.classList.contains('special')) {
  //         textarea.value += element.innerText;
  //     }
  // }


  // processClick(element) {
  //     // element.classList.toggle('pressed');
  //     // const textarea = document.querySelector('textarea');
  //     // if (!element.classList.contains('special') && !element.classList.contains('pressed')) {
  //     //     textarea.value += element.innerText.toLowerCase();
  //     // }
  //     element.classList.add('pressed');
  //     const textarea = document.querySelector('textarea');
  //     if (!element.classList.contains('special')) {
  //         textarea.value += element.innerText;
  //     }
  // }

  renderKeyboard(keysObj, language, container) { // нарисовать клавиатуру
    const keyboard = new Keyboard(keysObj, language, container);
    keyboard.render();
  }

  switchKeyboardLanguage() { // удалить клавиутуру, поменять язык, отрисовать заново
    this.switchLanguage();
    this.deleteKeyboard();
    this.renderKeyboard(this.keysObj, this.language, this.keyboardKeysClass);
  }

  deleteKeyboard() { // удалить все клавиши из контейнера
    const keyboard = document.querySelector(`.${this.keyboardKeysClass}`);
    keyboard.innerHTML = '';
  }

  switchLanguage() { // поменять язык приложения
    const curLang = this.language;
    const newLang = (curLang == 'rus') ? 'eng' : 'rus';
    this.setLanguage(newLang);
  }

  setLanguage(language) { // записать новый язык в localStorage
    localStorage.setItem('language', language);
    this.language = language;
  }

  getLanguage() { // получить язык из localStorage или присвоить язык по умолчанию
    let curLang = localStorage.getItem('language');

    if (!curLang) { // если язык не установлен
      curLang = 'rus'; // по умолчанию
      localStorage.setItem('language', curLang);
    }

    return curLang;
  }

  renderKeyboardContainer() { // нарисовать разметку для клавиатуры
    this.createDivWithClassInside(this.wrapperClass, 'body');
    this.createDivWithClassInside(this.keyboardConatainerClass, `.${this.wrapperClass}`);
    this.createDivWithClassInside(this.keyboardTextareaClass, `.${this.keyboardConatainerClass}`);
    this.createElementInside('textarea', `.${this.keyboardTextareaClass}`);
    this.createDivWithClassInside(this.keyboardKeysClass, `.${this.keyboardConatainerClass}`);
  }

  renderInfo() { // нарисовать разметку для информации
    this.createDivWithClassInside(this.infoClass, 'body');
    this.createElementInside('div', `.${this.infoClass}`, 'OS: Windows');
    this.createElementInside('div', `.${this.infoClass}`, 'Переключение языка: LeftShift + LeftAlt');
  }

  createDivWithClassInside(cssClass, outerElementSelector) {
    const outerElement = document.querySelector(outerElementSelector);
    const innerElement = document.createElement('div');
    innerElement.className = cssClass;
    outerElement.append(innerElement);
  }

  createElementInside(elementName, outerElementSelector, text = '') {
    const outerElement = document.querySelector(outerElementSelector);
    const innerElement = document.createElement(elementName);
    if (text) {
      innerElement.innerHTML = text;
    }
    outerElement.append(innerElement);
  }

  preventDefaultOnTextarea() {
    const textarea = document.querySelector(`.${this.keyboardTextareaClass}`);
    textarea.addEventListener('keypress', (event) => {
      event.preventDefault();
    });
  }
}


// import { Button } from './button.js';

// export class App {
//     constructor() {
//         this.wrapperClass = 'wrapper';
//         this.keyboardConatainerClass = 'keyboard__container';
//         this.keyboardInputClass = 'keyboard__container__input';
//         this.keyboardKeysClass = 'keyboard__container__keys';
//         // this.language = language;
//     }

//     init() {
//         this.createKeyboardContainer();
//         this.createButtons(buttonsObj);
//     }

//     rerenderKeyboard(buttonsObj, language){
//         console.log(language)
//         let keysContainer = document.querySelector('.keyboard__container__keys');
//         keysContainer.innerHTML = '';
//         for (let prop in buttonsObj) {
//             let button = new Button(prop, buttonsObj[prop], language);
//             keysContainer.append(button.render());
//           }
//     }

//     createButtons(buttonsObj){
//         // for (let prop in buttonsObj) {
//         //     console.log(prop + " = " + buttonsObj[prop].rus);
//         //     console.log(prop + " = " + buttonsObj[prop].eng);
//         //   }
//         let keysContainer = document.querySelector('.keyboard__container__keys');
//         for (let prop in buttonsObj) {
//             let button = new Button(prop, buttonsObj[prop], this.language);
//             keysContainer.append(button.render());
//           }

//     }

//     createKeyboardContainer() {
//         this.createDivWithClassInside(this.wrapperClass, 'body');
//         this.createDivWithClassInside(this.keyboardConatainerClass, '.' + this.wrapperClass);
//         this.createDivWithClassInside(this.keyboardInputClass, '.' + this.keyboardConatainerClass);
//         this.createElementInside('textarea',  '.' + this.keyboardInputClass);
//         this.createDivWithClassInside(this.keyboardKeysClass, '.' + this.keyboardConatainerClass);
//     }

//     createDivWithClassInside(cssClass, outerElementSelector) {
//         const outerElement = document.querySelector(outerElementSelector);
//         const innerElement = document.createElement('div');
//         innerElement.className = cssClass;
//         outerElement.append(innerElement);
//     }

//     createElementInside(elementName, outerElementSelector){
//         const outerElement = document.querySelector(outerElementSelector);
//         const innerElement = document.createElement(elementName);
//         outerElement.append(innerElement);
//     }
// }
