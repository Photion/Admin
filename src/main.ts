import { createApp } from 'vue';

import '~/src/plugins/sentry';
import '~/src/assets/scss/main.scss';
import { appLoaded } from '~/src/state/service';
import { router } from '~/src/vue/router';
import App from '~/src/App.vue';

export const main = async () => {
  await createApp(App)
    .use(router)
    .mount('#app');

  appLoaded.value = true;
};

main();
