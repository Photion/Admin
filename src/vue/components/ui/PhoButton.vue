<template>
  <button
    type="button"
    class="pho-btn"
    :class="color"
    :disabled="disabled"
    @click="onClick">
    <slot>
      <span v-if="label">{{ label }}</span>
    </slot>
  </button>
</template>

<script lang="ts">
import {  defineComponent } from 'vue';

export default defineComponent({
  props: {
    color: {
      type: String,
      default: () => 'primary',
      validator: (color: string) => {
        return ['primary', 'secondary', 'success', 'danger', 'disabled'].indexOf(color) !== -1;
      },
    },
    label: {
      type: String,
      default: () => '',
    },
  },
  setup(props, context) {
    const onClick = ($event: MouseEvent) => {
      return context.emit('click', $event);
    };

    const disabled = props.color === 'disabled';

    return {
      onClick,
      disabled,
    };
  },
});
</script>
