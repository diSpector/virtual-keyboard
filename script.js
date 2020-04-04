import App from './modules/app.js';
import keysConfig from './settings/keysConfig.js';
import appConfig from './settings/appConfig.js';

const app = new App(appConfig.obj, keysConfig.obj);
app.init();
