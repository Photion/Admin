<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <Integration :service="service" selected />
      </div>
      <div class="space-y-4 p-5">
        <div class="text-2xl">Integration Details</div>
        <slot />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, toRef, watch } from 'vue';

import { router } from '~/src/vue/router';
import { user } from '~/src/state/user';
import { load, save } from '~/src/state/secrets';
import { clientName, Service } from '~/src/state/service';
import Integration from '~/src/vue/components/pages/services/Integration.vue';

export default defineComponent({

  components: {
    Integration,
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
