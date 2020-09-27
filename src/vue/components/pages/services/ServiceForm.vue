<template>
  <div>
    <div>
      <p>Wonderful! You selected {{ service.name }}.</p>
      <p>Photion needs your credentials.</p>
    </div>
    <div>
      <v-row>
        <v-col cols="12" sm="6">
          <integration :service="service" selected />
        </v-col>
        <v-col cols="12" sm="6">
          <div>
            <v-text-field v-model="user.name" label="Photion Username" data-cy="field:user.name" />
            <v-text-field v-model="user.password" type="password" label="Encryption Password" data-cy="field:user.password" />
          </div>
          <div>
            <slot />
          </div>
          <div v-if="preview">
            <v-btn text color="error" disabled data-cy="button:service.soon">
              Coming Soon
            </v-btn>
          </div>
          <div v-else class="text-right">
            <v-btn text color="primary" @click="onContinue" data-cy="button:service.continue">
              Continue
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, watch, toRef } from '@vue/composition-api';

import { router } from '~/src/vue/router';
import { user } from '~/src/state/user';
import { save, load } from '~/src/state/secrets';
import { Service, clientName } from '~/src/state/service';
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
        console.log(error);
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
