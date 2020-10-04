import { JSDOM } from 'jsdom';

// Load FontAwesome as it wants to be a global...
import '~/src/plugins/font-awesome';

const jsdom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost:3000' });

global.document = jsdom.window.document;
(global.window as unknown as typeof jsdom.window) = jsdom.window;
