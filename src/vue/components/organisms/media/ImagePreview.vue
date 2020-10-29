<template>
  <img v-if="medium" :src="medium.file.url" alt="url" cy="medium.preview">
  <div v-else cy="medium.preview.missing">
    No preview available
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { Folder } from '~/src/models/Folder';
import { Medium } from '~/src/models/Medium';


export default defineComponent({

  props: {
    folder: {
      type: Object as () => Folder,
      required: true,
    },
    medium: {
      type: Object as () => Medium,
      required: false,
    },
  },
});
</script>
