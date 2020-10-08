<template>
  <button
    type="button"
    class="pho-btn"
    :class="color"
    :id="`${identifier}:${uuid}`"
    :disabled="disabled"
    :cy="identifier">
    <slot>
      <FontAwesomeIcon v-if="icon" :icon="icon" />
      <span v-if="label">{{ label }}</span>
    </slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { createIdentifier, componentProps } from '~/src/vue/components/shared';
import FontAwesomeIcon from '~/src/vue/components/ui/forms/FontAwesomeIcon.vue';

export default defineComponent({
  components: {
    FontAwesomeIcon,
  },
  props: {
    ...componentProps,
    color: {
      type: String,
      default: () => 'primary',
      validator: (color: string) => {
        return ['primary', 'secondary', 'success', 'danger', 'disabled'].indexOf(color) !== -1;
      },
    },
    icon: {
      type: String,
      default: () => '',
    },
    label: {
      type: String,
      default: () => '',
    },
  },
  setup(props) {
    const disabled = props.color === 'disabled';
    const identifier = createIdentifier('button', props.name);

    return {
      disabled,
      identifier,
    };
  },
});
</script>
