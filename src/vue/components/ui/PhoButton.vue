<template>
  <button type="button" @click="onClick"><slot /></button>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({

  setup(_props, context) {
    const onClick = ($event: MouseEvent) => {
      return context.emit('click', $event);
    };

    return {
      onClick,
    };
  },
});
</script>
