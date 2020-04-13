import Keyboard from './keyboard.js';

export default class App {
  constructor(appConfigObj, keysObj) {
    this.wrapperClass = appConfigObj.wrapperClass;
    this.keyboardConatainerClass = appConfigObj.keyboardConatainerClass;
    this.keyboardTextareaClass = appConfigObj.keyboardTextareaClass;
    this.keyboardKeysClass = appConfigObj.keyboardKeysClass;
    this.infoClass = appConfigObj.infoClass;
    this.keysObj = keysObj;
    this.language = this.getLanguage();
    this.caps = false;
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
    const textarea = document.querySelector(`.${this.keyboardTextareaClass} textarea`);

    container.addEventListener('mousedown', (event) => {
      // делегируем контейнеру клавиатуры клик по кнопке
      const button = event.target.closest('.button');
      if (!button) {
        return;
      }
      this.processEvent(button);
    });

    container.addEventListener('mouseup', (event) => {
      // делегируем контейнеру клавиатуры клик по кнопке
      const button = event.target.closest('.button');
      if (!button) {
        return;
      }
      button.classList.remove('pressed');
      textarea.focus(); // чтобы фокус оставался в поле после клика по кнопкам вне его
    });
  }

  attachPushEventListeners() { // назначить слушатели нажатий на клавиши
    const textarea = document.querySelector(`.${this.keyboardTextareaClass} textarea`);
    document.addEventListener('keydown', (event) => {
      if (event.altKey && event.shiftKey) { // переключение языка
        this.switchKeyboardLanguage();
      }
      const button = document.getElementById(event.code);
      if (!button) {
        return;
      }
      this.processEvent(button);
    });

    document.addEventListener('keyup', (event) => {
      const button = document.getElementById(event.code);
      if (!button) {
        return;
      }
      button.classList.remove('pressed');
      textarea.focus(); // вернуть фокус на textarea
    });
  }

  processEvent(element) { // обработка события нажатия/клика
    const cursorPos = this.getCursorPosition();
    const textarea = document.querySelector(`.${this.keyboardTextareaClass} textarea`);
    element.classList.add('pressed');
    if (!element.classList.contains('special')) { // напечатать обычный символ
      const text = textarea.value;
      textarea.value = text.substring(0, cursorPos)
      + ((this.caps) ? element.firstChild.nodeValue.toUpperCase() : element.firstChild.nodeValue)
      + text.substring(cursorPos);
      textarea.selectionStart = cursorPos + 1;
      textarea.selectionEnd = cursorPos + 1;
    } else {
      this.processSpecialClick(element.id);
    }
  }

  processSpecialClick(elementId) {
    const textarea = document.querySelector(`.${this.keyboardTextareaClass} textarea`);
    const text = textarea.value;
    const cursorPos = this.getCursorPosition();
    const textAreaConfig = this.getTextareaConfig();
    switch (elementId) {
      case 'Backspace':
        if (cursorPos) {
          textarea.value = text.substring(0, cursorPos - 1) + text.substring(cursorPos);
          textarea.selectionStart = cursorPos - 1;
          textarea.selectionEnd = cursorPos - 1;
        }
        break;
      case 'Tab':
        textarea.value = `${text.substring(0, cursorPos)}    ${text.substring(cursorPos)}`;
        textarea.selectionStart = cursorPos + 4;
        textarea.selectionEnd = cursorPos + 4;
        break;
      case 'Delete':
        textarea.value = text.substring(0, cursorPos) + text.substring(cursorPos + 1);
        textarea.selectionStart = cursorPos;
        textarea.selectionEnd = cursorPos;
        break;
      case 'CapsLock':
        this.caps = !this.caps;
        break;
      case 'Enter':
        textarea.value = `${text.substring(0, cursorPos)}\n${text.substring(cursorPos)}`;
        textarea.selectionStart = cursorPos + 1;
        textarea.selectionEnd = cursorPos + 1;
        break;
      case 'ArrowUp':
        if (textAreaConfig.resStr === 0) {
          textarea.selectionStart = 0;
          textarea.selectionEnd = 0;
        } else {
          let finalPos = 0;
          if (textAreaConfig.cursorPositionInCurrentString >= textAreaConfig.previousStringLength) {
            finalPos = textAreaConfig.nIndices[textAreaConfig.resStr - 1] - 1;
          } else {
            finalPos = cursorPos - textAreaConfig.previousStringLength;
          }
          textarea.selectionStart = finalPos;
          textarea.selectionEnd = finalPos;
        }
        break;
      case 'ArrowLeft':
        if (cursorPos !== 0) {
          textarea.selectionStart = cursorPos - 1;
          textarea.selectionEnd = cursorPos - 1;
        }
        break;
      case 'ArrowDown':
        if (textAreaConfig.resStr === (textAreaConfig.strsLength.length - 1)) {
          textarea.selectionStart = textarea.value.length;
          textarea.selectionEnd = textarea.value.length;
        } else {
          let finalPos = 0;
          if (textAreaConfig.cursorPositionInCurrentString > textAreaConfig.nextStringLength) {
            finalPos = textAreaConfig.nIndices[textAreaConfig.resStr]
              + textAreaConfig.nextStringLength - 1;
          } else {
            finalPos = cursorPos + textAreaConfig.thisStringLength;
          }
          textarea.selectionStart = finalPos;
          textarea.selectionEnd = finalPos;
        }
        break;
      case 'ArrowRight':
        textarea.selectionStart = cursorPos + 1;
        textarea.selectionEnd = cursorPos + 1;
        break;
      default:
        break;
    }
  }

  getTextareaConfig() {
    const textarea = document.querySelector(`.${this.keyboardTextareaClass} textarea`);
    const text = textarea.value;
    const cursorPos = this.getCursorPosition();
    const strsArrayInsideTextarea = text.split('\n');
    const strsLength = []; // массив с длиной каждой строки
    const nIndices = []; // массив с позициями переносов строк

    let counter = 0;
    let resStr = 0;

    strsArrayInsideTextarea.forEach((oneStr) => { // перебрать все строки
      strsLength.push(oneStr.length + 1);
    });

    for (let i = 0; i < text.length; i += 1) {
      if (text[i] === '\n') nIndices.push(i + 1);
    }

    while (cursorPos >= nIndices[counter]) {
      resStr += 1;
      counter += 1;
    }

    const cursorPositionInCurrentString = (resStr === 0)
      ? cursorPos
      : (cursorPos - nIndices[resStr - 1]);
    const thisStringLength = strsLength[resStr];
    const previousStringLength = (resStr === 0) ? null : strsLength[resStr - 1];
    const nextStringLength = (resStr === (strsArrayInsideTextarea.length - 1))
      ? null
      : strsLength[resStr + 1];

    return {
      cursorPos,
      strsLength,
      resStr,
      nIndices,
      thisStringLength,
      cursorPositionInCurrentString,
      previousStringLength,
      nextStringLength,
    };
  }

  getCursorPosition() { // получить позицию курсора в textarea
    const textarea = document.querySelector(`.${this.keyboardTextareaClass} textarea`);
    return textarea.selectionStart;
  }

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
    const newLang = (curLang === 'rus') ? 'eng' : 'rus';
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
    textarea.addEventListener('keydown', (event) => {
      event.preventDefault();
    });
    textarea.addEventListener('keyup', (event) => {
      event.preventDefault();
    });
  }
}
