<template>
  <div class="pho-field-wrapper">
    <label v-if="label" :for="id.unique" class="pho-label">
      {{ label }}
    </label>
    <input
      class="pho-field"
      :class="styles"
      :id="id.unique"
      :cy="id.family"
      :name="name"
      :type="type"
      :value="modelValue"
      :disabled="disabled"
      v-bind="$attrs"
      @input="onInput" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { useId, componentProps } from '~/src/vue/components/shared';
import { getFormProps } from '~/src/vue/components/ui/forms/forms';

export default defineComponent({

  props: {
    ...componentProps,
    ...getFormProps(String),
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

    const styles = {
      disabled: props.disabled,
    };

    return {
      id: useId('field', props),
      styles,
      onInput,
    };
  },

});
</script>

<style scoped>
.disabled {
  color: gray;
}
</style>
