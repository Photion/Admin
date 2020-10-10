<template>
  <div class="pho-field-wrapper">
    <label v-if="label" :for="id.unique" class="pho-label">
      {{ label }}
      <input
        class="pho-field"
        :id="id.unique"
        :cy="id.family"
        :name="name"
        :type="type"
        :value="modelValue"
        :disabled="disabled"
        @input="onInput" />
    </label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useId, componentProps } from '~/src/vue/components/shared';

export default defineComponent({

  props: {
    ...componentProps,
    label: {
      type: String,
      default: () => '',
    },
    modelValue: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: () => false,
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

    return {
      id: useId('field', props),
      onInput,
    };
  },

});
</script>
