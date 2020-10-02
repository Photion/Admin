<template>
  <button
    :class="cssButton"
    :disabled="color === 'disabled'"
    class="rounded-lg px-5 py-2 tracking-wider transition-all duration-100"
    type="button"
    @click="onClick">
    <slot/>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  props: {
    color: {
      type: String,
      default: 'primary',
      validator: (color: string) => {
        return ['primary', 'secondary', 'warning', 'danger', 'disabled'].indexOf(color) !== -1;
      },
    },
  },
  setup(props, context) {
    const onClick = ($event: MouseEvent) => {
      return context.emit('click', $event);
    };

    const cssButton = computed(() => ({
      'bg-gray-800 text-white hover:shadow-lg hover:bg-gray-700': props.color === 'primary',
      'bg-teal-500 text-white hover:shadow-lg hover:bg-teal-400': props.color === 'secondary',
      'bg-yellow-400 text-gray-900 hover:shadow-lg hover:bg-yellow-300': props.color === 'warning',
      'bg-red-600 text-white hover:shadow-lg hover:bg-red-500': props.color === 'danger',
      'bg-gray-300 text-gray-900': props.color === 'disabled',
    }));

    return {
      onClick,
      cssButton,
    };
  },
});
</script>
