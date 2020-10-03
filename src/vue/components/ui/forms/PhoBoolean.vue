<template>
  <div class="pho-switch-wrapper">
    <div class="pho-switch-container">
      <div class="pho-switch">
        <input
          type="checkbox"
          :id="identifier"
          :value="modelValue"
          @input="onInput"
          :name="name"
          :cy="reference" />
        <label :for="identifier" class="pho-switch-circle"></label>
      </div>
      <label :for="identifier" class="pho-switch-text">{{ label }}</label>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { createIdentifier } from '~/src/vue/components/shared';

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

    const identifier = createIdentifier('field', props.name);
    const reference = props.cy || identifier;

    return {
      identifier,
      reference,
      onInput,
    };
  },

});
</script>
