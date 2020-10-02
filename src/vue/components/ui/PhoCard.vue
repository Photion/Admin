<template>
  <div :class="clickableClass" class="rounded-lg p-5 shadow-lg transition-shadow duration-100">
    <div v-if="logo" class="w-2/12 rounded-lg mb-2">
      <img :src="logo" alt="logo" class="w-full">
    </div>
    <slot />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  props: {
    clickable: {
      type: Boolean,
      default: false,
    },
    logo: {
      type: String,
      required: false,
    },
  },
  setup(props ) {
    const clickableClass = computed(() => ({
      ['hover:shadow-xl']: props.clickable,
    }));
    return {  clickableClass };
  },
});
</script>
