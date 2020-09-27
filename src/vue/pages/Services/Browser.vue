<template>
  <service-form :service="browser">
  </service-form>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import { browser } from '~/src/state/service';
import ServiceForm from '~/src/vue/components/pages/services/ServiceForm.vue';

export default defineComponent({

  components: {
    ServiceForm,
  },

  setup() {
    return {
      browser,
    };
  },
});
</script>
