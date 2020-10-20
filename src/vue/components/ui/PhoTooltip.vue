<template>
  <div class="wrapper relative">
    <div class="inline-block" @mouseout="show = false" @mouseover="show = true">
      <slot ></slot>
    </div>
    <transition name="slide" @enter="setEnterDelay" @leave="setLeaveDelay" >
      <div v-if="show" class="tooltip bg-gray-800 text-white rounded-sm text-center px-2 py-1">
        <span v-if="text" class="text-xs tracking-wide">{{text}}</span>
        <div v-else>
          <slot name="content"></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'PhoTooltip',
  props: {
    text: {
      type: String,
      required: false,
    },
    delayIn: {
      type: Number,
      default: 1000,
    },
    delayOut: {
      type: Number,
      default: 100,
    },
  },
  setup(props) {
    const transitionDelayIn = computed<string>(() => `${props.delayIn}ms`);
    const transitionDelayOut = computed<string>(() => `${props.delayOut}ms`);

    return {
      transitionDelayIn,
      transitionDelayOut,
    };
  },
  data() {
    return {
      show: false,
    };
  },
  methods: {
    setEnterDelay(el: HTMLElement, _done: boolean) {
      el.style.transitionDelay = this.transitionDelayIn ;
    },
    setLeaveDelay(el: HTMLElement, _done: boolean) {
      el.style.transitionDelay = this.transitionDelayOut ;
    },
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  width: fit-content;
}

.tooltip {
  position: absolute;
  max-width: 12rem;
  top: 130%;

  &::after {
    content: "";
    position: absolute;
    bottom: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    //noinspection CssInvalidFunction
    border-color: transparent transparent theme('colors.gray.800') transparent;
  }
}

.slide-enter-active {
  transition-duration: 150ms;
}

.slide-leave-active {
  transition-duration: 150ms;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(-20%);
}

.slide-enter-to , .slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-20%);
}
</style>