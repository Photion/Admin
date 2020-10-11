<template>
  <img v-if="fragment" :src="fragment.url" alt="url" cy="fragment.preview">
  <div v-else cy="fragment.preview.missing">
    No preview available
  </div>
</template>

<script>
import { defineComponent } from 'vue';

import { Concept } from '~/src/models/Concept';
import { Fragment } from '~/src/models/Fragment';


export default defineComponent({

  props: {
    concept: {
      type: Concept,
      required: true,
    },
    fragment: {
      type: Fragment,
      required: false,
    },
  },
});
</script>
