<template>
  <component :is="attrs.is" v-bind="attrs">
    <slot>
      <FontAwesomeIcon v-if="icon" :icon="icon" />
      <span v-if="label">{{ label }}</span>
    </slot>
  </component>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

import { componentProps, useId } from '%/shared';
import FontAwesomeIcon from '%/ui/forms/FontAwesomeIcon.vue';

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
    href: {
      type: String,
      default: () => '',
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
    const id = useId('button', props);

    const attrs = computed(() => {
      const values: Record<string, unknown> = {
        is: computed(() => props.href ? 'a' : 'button'),
        id: id.unique,
        cy: id.family,
        class: `pho-btn ${props.color}`,
      };

      if (props.color === 'disabled') {
        values.disabled = 'disabled';
      }

      if (props.href) {
        const url = new URL(props.href, window.location.origin);

        if (url.origin === window.location.origin) {
          values.is = 'router-link';
          values.to = props.href;
        } else {
          values.is = 'a';
          values.href = props.href;
        }
      } else {
        values.is = 'button';
        values.type = 'button';
      }

      return values;
    });

    return {
      attrs,
    };
  },
});
</script>
