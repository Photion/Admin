<template>
  <ServiceForm :service="browser">
    <div class="text-right">
      <PhoButton label="Continue" @click="on.continue(browser.slug)" name="service.continue" />
    </div>
  </ServiceForm>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { browser, saveClient } from '~/src/state/service';

import PhoButton from '%/ui/PhoButton.vue';
import ServiceForm from '%/pages/services/ServiceForm.vue';

export default defineComponent({

  components: {
    PhoButton,
    ServiceForm,
  },

  setup() {
    return {
      browser,
      on: {
        continue: saveClient,
      },
    };
  },
});
</script>
