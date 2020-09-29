<template>
  <button
    :class="{'bg-gray-300 text-gray-900': disabled,
             'bg-gray-800 text-white hover:shadow-lg hover hover:bg-gray-700': !disabled}"
    :disabled="disabled"
    class="rounded-lg font-bold px-6 py-2"
    type="button"
    @click="onClick">
    <slot/>
  </button>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
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
