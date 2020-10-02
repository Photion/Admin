<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <select
      @input="onInput"
      @change="onInput"
      :multiple="multiple"
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

    const reference = props.cy || (props.name ? `field:${props.name}` : '');

    return {
      reference,
      onInput,
    };
  },

});
</script>
