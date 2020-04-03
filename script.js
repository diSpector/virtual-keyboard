import { App } from './modules/app.js';
import { keysObj } from './settings/keysConfig.js';
import { appConfigObj } from './settings/appConfig.js';


const app = new App(appConfigObj, keysObj);
app.init();

// app.createKeyboardContainer();
// app.createButtons(keysObj);

// document.addEventListener('keydown', (event) => {
//   // console.log(event.key);
//   // console.log(event.code);
//   // if (!event.code == 'ShiftLeft' && event.code == 'AltLeft'){

//   if (event.altKey && event.shiftKey) {
//     // console.log('Switch!');
//     app.switchKeyboardLanguage();

//     // let curLang = localStorage.getItem('language');
//     // let newLang = (curLang == 'rus') ? 'eng' : 'rus';
//     // localStorage.setItem('language', newLang);
//     // app.rerenderKeyboard(keysObj, newLang);
//   }

//   // if (event.ctrlKey && event.key === 'z') {
//   //     alert('Undo!');
//   // }

//   const button = document.getElementById(event.code);
//   if (!button) {
//     return;
//   }

//   button.classList.add('pressed');

//   // добавить кнопке метод pressed(), который возвращает то, что она печатает
//   const textarea = document.querySelector('textarea');
//   if (!button.classList.contains('special')) {
//     textarea.value += event.key;
//   }
// });

// document.addEventListener('keyup', (event) => {
//   const button = document.getElementById(event.code);
//   if (!button) {
//     return;
//   }
//   button.classList.remove('pressed');
// //   console.log(button);
// });

// const textarea = document.querySelector('textarea');
// textarea.addEventListener('keypress', (event) => {
//   event.preventDefault();
// });
