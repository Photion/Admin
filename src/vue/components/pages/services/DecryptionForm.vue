<template>
  <div>
    <PhoTextField
      v-model="user.name"
      name="user.name"
      label="Photion Username"
      help="Used by your integration" />
    <PhoTextField
      v-model="user.password"
      name="user.password"
      label="Encryption Password"
      type="password"
      help="Used to decrypt your local secrets from the browser" />
  </div>
</template>

<script lang="ts">
import { defineComponent, toRef, watch } from 'vue';

import { load } from '~/src/state/secrets';
import { user } from '~/src/state/user';

import PhoTextField from '%/ui/forms/PhoTextField.vue';

export default defineComponent({

  components: {
    PhoTextField,
  },

  setup() {
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
    };
  },
});
</script>
