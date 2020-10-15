<template>
  <ServiceForm :service="aws">
    <div>
      <DecryptionForm />
      <PhoTextField v-model="secrets.aws.region" name="secrets.aws.region" label="AWS Region" />
      <PhoTextField v-model="secrets.aws.accessKeyId" name="secrets.aws.accessKeyId" label="AWS Access Key ID" />
      <PhoTextField v-model="secrets.aws.secretAccessKey" name="secrets.aws.secretAccessKey" label="AWS Secret Access Key" />
    </div>
    <div class="text-right">
      <PhoButton label="Continue" @click="on.continue(aws.slug)" name="service.continue" />
    </div>
  </ServiceForm>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { secrets } from '~/src/state/secrets';
import { aws, saveClient } from '~/src/state/service';

import DecryptionForm from '%/pages/services/DecryptionForm.vue';
import ServiceForm from '%/pages/services/ServiceForm.vue';
import PhoButton from '%/ui/PhoButton.vue';
import PhoTextField from '%/ui/forms/PhoTextField.vue';

export default defineComponent({

  components: {
    DecryptionForm,
    ServiceForm,
    PhoButton,
    PhoTextField,
  },

  setup() {
    return {
      aws,
      secrets,
      on: {
        continue: saveClient,
      },
    };
  },
});
</script>
