<template>
  <ServiceForm :service="googleDrive" preview />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { secrets } from '~/src/state/secrets';
import { googleDrive } from '~/src/state/service';
import ServiceForm from '~/src/vue/components/pages/services/ServiceForm.vue';

export default defineComponent({

  components: {
    ServiceForm,
  },

  setup() {
    return {
      googleDrive,
      secrets,
    };
  },
});
</script>
