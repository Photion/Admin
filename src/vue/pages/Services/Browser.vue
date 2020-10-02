<template>
  <ServiceForm :service="browser" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
