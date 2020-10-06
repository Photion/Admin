<template>
  <div
    :id="`${identifier}:option:${option.value}`"
    :cy="`${identifier}:option:${option.value}`"
    :value="option.value"
    :class="current ? 'current': ''"
    @click="on.click($event)"
    role="menuitem">
    <span>{{ option.text }}</span>
    <FontAwesomeIcon v-if="selected" icon="check-square" class="text-primary-600" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { SelectOption } from '~/src/utils';
import FontAwesomeIcon from '~/src/vue/components/ui/forms/FontAwesomeIcon.vue';

export default defineComponent({

  components: {
    FontAwesomeIcon,
  },

  props: {
    current: {
      type: Boolean,
      default: () => false,
    },
    identifier: {
      type: String,
      required: true,
    },
    option: {
      type: Object as PropType<SelectOption>,
      required: true,
    },
    selected: {
      type: Boolean,
      default: () => false,
    },
  },

  setup(props, context) {

    /**
     * Handles an option click
     *
     * @param $event
     */
    const click = ($event: MouseEvent) => {
      $event.stopPropagation();

      context.emit('option', props.option);
    };

    return {
      on: {
        click,
      },
    };
  },
});
</script>

<style scoped lang="scss">
div {
  @apply block;
  @apply flex;
  @apply px-4;
  @apply py-2;
  @apply text-sm;
  @apply text-left;
  @apply leading-5;
  @apply text-gray-700;
  @apply cursor-pointer;
  transition: all 0.6s;
  z-index: 20;
}
div:hover {
  @apply outline-none;
}

div.current {
  @apply bg-gray-400;
}

span {
  @apply flex-grow;
  @apply text-left;
}
</style>
