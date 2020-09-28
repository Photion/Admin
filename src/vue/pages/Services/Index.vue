<template>
  <div>
    <div>
      <p>Select a service integration to use with Photion.</p>
      <p>While Photion lets you create, update and delete your media, it needs a "backend" where the data is stored and retrieved.</p>
      <p>With Photion, <strong>you own your own data</strong>. This means that Photion will interface with your own account in the selected service.</p>
    </div>
    <div>
      <div>
        <h2 class="text-h4 my-5">
          Easy
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Integration :service="googleDrive" class="ml-0" />
          <Integration :service="browser" class="ml-0" />
        </div>
      </div>
      <div>
        <h2 class="text-h4 my-5">
          Nerdy
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Integration :service="aws" class="ml-0" />
          <Integration :service="gcp" class="ml-0" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import { aws, gcp, googleDrive, browser, isDev } from '~/src/state/service';
import Integration from '~/src/vue/components/pages/services/Integration.vue';


export default defineComponent({

  components: {
    Integration,
  },

  setup() {
    return {
      aws,
      browser,
      gcp,
      googleDrive,
      isDev,
    };
  },
});
</script>
