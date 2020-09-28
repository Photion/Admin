import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import { JSDOM } from 'jsdom';

Vue.config.productionTip = false;
Vue.config.devtools = false;

Vue.use(VueCompositionApi);

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost:3000' });

global.document = jsdom.window.document;
(global.window as unknown as typeof jsdom.window) = jsdom.window;
