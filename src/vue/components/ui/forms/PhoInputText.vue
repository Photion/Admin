<template>
  <div>
    <label v-if="label">
      {{ label }}
      <input
        :cy="reference"
        :name="name"
        :type="type"
        :value="value"
        class="block border-2 border-gray-500 w-full rounded-lg px-3 py-1 outline-none focus:border-gray-800"
        @input="onInput" />
    </label>
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
    name: {
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

  setup(props, context) {
    const onInput = ($event: InputEvent) => {
      const target = $event.target as HTMLInputElement;

      return context.emit('input', target.value);
    };

    const reference = props.cy || (props.name ? `field:${props.name}` : '');

    return {
      reference,
      onInput,
    };
  },

});
</script>
