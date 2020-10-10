<template>
  <ServiceForm :service="gcp" preview>
    <div>
      <PhoTextField v-model="secrets.gcp.apiKey" label="Google Cloud Platform API Key" />
      <PhoTextField v-model="secrets.gcp.apiSecret" label="Google Cloud Platform API Secret" />
    </div>
  </ServiceForm>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { secrets } from '~/src/state/secrets';
import { gcp } from '~/src/state/service';
import ServiceForm from '~/src/vue/components/pages/services/ServiceForm.vue';
import PhoTextField from '~/src/vue/components/ui/forms/PhoTextField.vue';

export default defineComponent({

  components: {
    PhoTextField,
    ServiceForm,
  },

  setup() {
    return {
      gcp,
      secrets,
    };
  },
});
</script>
