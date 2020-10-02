<template>
  <div>
    <input
      type="checkbox"
      :value="modelValue"
      @input="onInput"
      :name="name"
      :cy="reference" />
    <label v-if="label">{{ label }}</label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
    name: {
      type: String,
      default: () => '',
    },
    modelValue: {
      type: Boolean,
      required: true,
    },
  },

  setup(props, context) {
    const onInput = ($event: InputEvent) => {
      const target = $event.target as HTMLInputElement;

      return context.emit('update:modelValue', target.checked);
    };

    const reference = props.cy || (props.name ? `field:${props.name}` : '');

    return {
      reference,
      onInput,
    };
  },

});
</script>
