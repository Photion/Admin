<template>
  <div>
    <div class="mt-5 text-sm">
      <div>
        For Photion to access your Google Drive, you will need to grant us permissions.
        Luckily, this is an easy and speedy process that can be completed in a few clicks.
      </div>
      <p class="mt-5">
        Click on the button below to proceed to Google and select the account you want to use with Photion.
      </p>
    </div>
    <div class="text-right mt-5">
      <PhoButton label="Authorize Google Drive" name="googleDrive.authorize" :href="urls.oauth" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { getOAuthUrl } from '~/src/api/googleDrive';

import PhoButton from '%/ui/PhoButton.vue';

export default defineComponent({
  components: {
    PhoButton,
  },

  setup() {
    return {
      urls: {
        oauth: getOAuthUrl(),
      },
    };
  },
});
</script>
