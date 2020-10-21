<template>
  <div class="pho-field-wrapper w-full relative">
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
    <div v-if="help" class="help absolute">
      <PhoTooltip :text="help" :name="name" :uuid="uuid" position="top"><FontAwesomeIcon icon="info-circle" /></PhoTooltip>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { useId, componentProps } from '~/src/vue/components/shared';
import { getFormProps } from '~/src/vue/components/ui/forms/forms';

import PhoTooltip from '~/src/vue/components/ui/PhoTooltip.vue';

export default defineComponent({

  components: {
    FontAwesomeIcon,
    PhoTooltip,
  },

  props: {
    ...componentProps,
    ...getFormProps(String),
    help: {
      type: String,
      default: () => '',
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
