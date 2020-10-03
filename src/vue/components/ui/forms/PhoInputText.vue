<template>
  <div class="pho-field-wrapper">
    <label v-if="label" :for="identifier" class="pho-label">
      {{ label }}
      <input
        class="pho-field"
        :id="identifier"
        :cy="reference"
        :name="name"
        :type="type"
        :value="modelValue"
        @input="onInput" />
    </label>
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
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
  },

  setup(props, context) {
    const onInput = ($event: InputEvent) => {
      const target = $event.target as HTMLInputElement;

      return context.emit('update:modelValue', target.value);
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
