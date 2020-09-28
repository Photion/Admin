<template>
  <ServiceForm :service="gcp" preview>
    <div>
      <PhoInputText v-model="secrets.gcp.apiKey" label="Google Cloud Platform API Key" />
      <PhoInputText v-model="secrets.gcp.apiSecret" label="Google Cloud Platform API Secret" />
    </div>
  </ServiceForm>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import { secrets } from '~/src/state/secrets';
import { gcp } from '~/src/state/service';
import ServiceForm from '~/src/vue/components/pages/services/ServiceForm.vue';
import PhoInputText from '~/src/vue/components/ui/forms/PhoInputText.vue';

export default defineComponent({

  components: {
    PhoInputText,
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
