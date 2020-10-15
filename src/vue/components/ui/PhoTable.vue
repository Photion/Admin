<template>
  <table class="table-auto min-w-full" :id="id.unique" :cy="id.family">
    <thead>
      <slot name="thead" />
    </thead>
    <tbody>
      <slot name="tbody" />
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { componentProps, useId } from '%/shared';


export default defineComponent({

  props: {
    ...componentProps,
  },

  setup(props) {
    return {
      id: useId('table', props),
    };
  },
});
</script>
