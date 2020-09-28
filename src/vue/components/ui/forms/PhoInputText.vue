<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <input :type="type" :value="value" @input="onInput" :cy="cy" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({

  props: {
    cy: {
      type: String,
      default: () => '',
    },
    label: {
      type: String,
      default: () => '',
    },
    value: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
  },

  setup(_props, context) {
    const onInput = ($event: InputEvent) => {
      const target = $event.target as HTMLInputElement;

      return context.emit('input', target.value);
    };

    return {
      onInput,
    };
  },

});
</script>
