<template>
  <div>
    <ServiceForm :service="aws">
      <PhoInputText v-model="secrets.aws.region" name="secrets.aws.region" label="AWS Region" />
      <PhoInputText v-model="secrets.aws.accessKeyId" name="secrets.aws.accessKeyId" label="AWS Access Key ID" />
      <PhoInputText v-model="secrets.aws.secretAccessKey" name="secrets.aws.secretAccessKey" label="AWS Secret Access Key" />
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
