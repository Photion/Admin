<template>
  <div>
    <ServiceForm :service="aws">
      <PhoInputText v-model="secrets.aws.region" label="AWS Region" cy="field:secrets.aws.region" />
      <PhoInputText v-model="secrets.aws.accessKeyId" label="AWS Access Key ID" cy="field:secrets.aws.accessKeyId" />
      <PhoInputText v-model="secrets.aws.secretAccessKey" label="AWS Secret Access Key" cy="field:secrets.aws.secretAccessKey" />
    </ServiceForm>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { secrets } from '~/src/state/secrets';
import { aws } from '~/src/state/service';
import ServiceForm from '~/src/vue/components/pages/services/ServiceForm.vue';
import PhoInputText from '~/src/vue/components/ui/forms/PhoInputText.vue';

export default defineComponent({

  components: {
    ServiceForm,
    PhoInputText,
  },

  setup() {
    return {
      aws,
      secrets,
    };
  },
});
</script>
