<template>
  <ServiceForm :service="gcp" preview>
    <DecryptionForm />
    <div>
      <PhoTextField v-model="secrets.gcp.apiKey" label="Google Cloud Platform API Key" />
      <PhoTextField v-model="secrets.gcp.apiSecret" label="Google Cloud Platform API Secret" />
    </div>
    <div class="text-right">
      <PhoButton label="Coming Soon" name="service.soon" color="disabled" />
    </div>

  </ServiceForm>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { secrets } from '~/src/state/secrets';
import { gcp } from '~/src/state/service';

import DecryptionForm from '%/pages/services/DecryptionForm.vue';
import ServiceForm from '%/pages/services/ServiceForm.vue';
import PhoTextField from '%/ui/forms/PhoTextField.vue';
import PhoButton from '%/ui/PhoButton.vue';

export default defineComponent({

  components: {
    DecryptionForm,
    PhoTextField,
    ServiceForm,
    PhoButton,
  },

  setup() {
    return {
      gcp,
      secrets,
    };
  },
});
</script>
