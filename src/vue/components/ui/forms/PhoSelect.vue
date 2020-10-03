<template>
  <div class="pho-field-wrapper">
    <label v-if="label" :for="identifier" class="pho-label">{{ label }}</label>
    <select
      :id="identifier"
      @input="onInput"
      @change="onInput"
      :multiple="multiple"
      class="pho-field"
      :name="name"
      :cy="reference">
      <option
        v-for="option in options"
        :key="option.value"
        :selected="modelValue.includes(option.value)"
        :value="option.value">
        {{ option.text }}
      </option>
    </select>
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
    multiple: {
      type: Boolean,
      default: () => false,
    },
    options: {
      type: Array,
      default: () => [],
    },
    name: {
      type: String,
      default: () => '',
    },
    modelValue: {
      type: [String, Array],
      required: true,
    },
  },

  setup(props, context) {
    const onInput = ($event: InputEvent) => {
      const target = $event.target as HTMLInputElement;
      const selected = [...target.querySelectorAll('option')]
        .filter((option) => option.selected)
        .map((option) => option.value);
      return context.emit('update:modelValue', selected);
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
