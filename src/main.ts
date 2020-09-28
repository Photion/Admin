import Vue from 'vue';

import '~/src/plugins/composition-api';
import '~/src/plugins/sentry';
import '@/assets/scss/main.scss';
import { init } from '~/src/state/secrets';
import { appLoaded } from '~/src/state/service';
import { router } from '~/src/vue/router';
import App from '~/src/App.vue';

export const main = async () => {
  await init();

  Vue.config.productionTip = false;

  new (Vue)({
    router,
    render: (h) => h(App),
  }).$mount('#app');

  appLoaded.value = true;
};

main();
