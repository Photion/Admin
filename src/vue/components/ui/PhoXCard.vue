<template>
  <div :class="clickableClass" class="rounded-lg p-5 shadow-xl transition-shadow duration-100 flex flex-wrap">
    <div v-if="logo" class="w-full sm:w-3/12 rounded-lg pr-5 mt-1 mb-4">
      <img :src="logo" alt="logo" class="mt-1">
    </div>
    <div class="w-full sm:w-9/12">
      <slot />
    </div>
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
