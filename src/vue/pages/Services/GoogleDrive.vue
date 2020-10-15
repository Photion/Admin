<template>
  <div>
    <ServiceForm :service="googleDrive">
      <div v-if="loading">
        <div class="text-sm">Setting up Google Drive...</div>
        <div class="mt-5"><Loader /></div>
      </div>
      <State v-else-if="secrets.googleDrive.accessToken" />
      <Authorize v-else />
    </ServiceForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';

import { readHashSearchString, getDb } from '~/src/api/googleDrive';
import { secrets } from '~/src/state/secrets';
import { googleDrive, saveClient } from '~/src/state/service';
import { router } from '~/src/vue/router';

import Loader from '%/atoms/Loader.vue';
import ServiceForm from '%/pages/services/ServiceForm.vue';
import Authorize from '%/pages/services/GoogleDrive/Authorize.vue';
import State from '%/pages/services/GoogleDrive/State.vue';

export const tryAuthentication = async () => {
  const hashQuery = readHashSearchString(window.location.origin + router.currentRoute.value.fullPath);
  window.location.hash = '';

  if ('access_token' in hashQuery) {
    secrets.googleDrive.accessToken = hashQuery.access_token;

    await saveClient(googleDrive.slug, false);
    await getDb();

    if ('state' in hashQuery) {
      if (hashQuery.state.includes('noredirect')) {
        return;
      }
    }

    await router.push('/');
  }
};

export default defineComponent({
  components: {
    ServiceForm,
    Authorize,
    State,
    Loader,
  },

  setup() {
    const loading = ref(true);

    onBeforeMount(async () => {
      await tryAuthentication();
      loading.value = false;
    });

    return {
      loading,
      secrets,
      googleDrive,
    };
  },
});
</script>
