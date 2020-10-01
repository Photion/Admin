<template>
  <div>
    <div>
      <p>Wonderful! You selected: {{ service.name }}.</p>
      <p>Photion needs your credentials.</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Integration :service="service" selected />
      <div class="space-y-4">
        <div class="space-y-4">
          <PhoInputText v-model="user.name" cy="field:user.name" label="Photion Username" />
          <PhoInputText v-model="user.password" cy="field:user.password" label="Encryption Password" type="password" />
        </div>
        <div>
          <slot />
        </div>
        <div v-if="preview">
          <PhoButton color="disabled" cy="button:service.soon">Coming Soon</PhoButton>
        </div>
        <div v-else>
          <PhoButton cy="button:service.continue" @click="onContinue">Continue</PhoButton>
        </div>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, toRef, watch } from '@vue/composition-api';

import { router } from '~/src/vue/router';
import { user } from '~/src/state/user';
import { load, save } from '~/src/state/secrets';
import { clientName, Service } from '~/src/state/service';
import Integration from '~/src/vue/components/pages/services/Integration.vue';
import PhoButton from '~/src/vue/components/ui/PhoButton.vue';
import PhoInputText from '~/src/vue/components/ui/forms/PhoInputText.vue';

export default defineComponent({

  components: {
    Integration,
    PhoButton,
    PhoInputText,
  },

  props: {
    preview: {
      type: Boolean,
      default: false,
    },
    service: {
      type: Object as <T>() => Service<T>,
      required: true,
    },
  },

  setup(props) {
    const onContinue = async () => {
      window.localStorage.setItem('PHOTION_INTEGRATION', props.service.slug);
      clientName.value = props.service.slug;
      await save();
      router.push('/');
    };

    const name = toRef(user, 'name');
    const password = toRef(user, 'password');

    watch([name, password], async () => {
      sessionStorage.setItem('PHOTION_USERNAME', user.name);

      try {
        return await load();
      } catch (error) {
        return error;
      }
    });

    return {
      user,
      onContinue,
    };
  },
});
</script>
M
