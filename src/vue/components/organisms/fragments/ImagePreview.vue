<template>
  <div class="img-container">
    <img :src="fragment.url" alt="url">
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api';

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
      required: true,
    },
  },
});
</script>

<style scoped>
.img-container {
  height: 150px;
  text-align: center;
}

img {
  max-width: 100%;
  max-height: 100%;
  padding: 0 10px;
}
</style>
