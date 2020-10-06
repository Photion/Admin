<template>
  <svg xmlns="http://www.w3.org/2000/svg" :class="$props.class" :style="`width: ${width}`" :viewBox="`0 0 ${vwidth} ${vheight}`">
    <path fill="currentColor" :d="svgPath"/>
  </svg>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { findIconDefinition } from '@fortawesome/fontawesome-svg-core';

export default defineComponent({
  name: 'FontAwesomeIcon',

  props: {
    icon: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: () => '12px',
    },
    class: String,
  },

  setup (props) {
    const definition = computed(() => findIconDefinition({
      prefix: 'fas',
      iconName: props.icon,
    }));

    const vwidth = computed(() => definition.value.icon[0]);
    const vheight = computed(() => definition.value.icon[1]);
    const svgPath = computed(() => definition.value.icon[4]);

    return { vwidth, vheight, svgPath };
  },
});
</script>
