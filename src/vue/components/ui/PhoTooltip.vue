<template>
  <div class="wrapper relative" @mouseenter="on.enter" @mouseleave="on.leave">
    <div class="inline-block">
      <slot ></slot>
    </div>
    <transition name="slide">
      <div
        v-if="show"
        :id="id.unique"
        :cy="id.family"
        :style="styles.tooltip.value"
        class="tooltip absolute bg-gray-800 text-white rounded-sm text-center px-2 py-1"
        :class="position">
        <slot name="content">
          <span v-if="text" class="text-xs tracking-wide">{{ text }}</span>
        </slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

import { useId, componentProps } from '~/src/vue/components/shared';

export enum TooltipPositions {
  TOP = 'top',
  RIGHT = 'right',
  BOTTOM = 'bottom',
  LEFT = 'left,'
}

export const getTooltipStyles = (delayIn: number, delayOut: number) => {
  return {
    '--transition-delay-in': `${delayIn}ms`,
    '--transition-delay-out': `${delayOut}ms`,
  };
};

export default defineComponent({
  name: 'PhoTooltip',
  props: {
    ...componentProps,
    text: {
      type: String,
      default: () => '',
    },
    delayIn: {
      type: Number,
      default: 700,
    },
    delayOut: {
      type: Number,
      default: 300,
    },
    position: {
      type: String as () => TooltipPositions,
      default: () => TooltipPositions.BOTTOM,
    },
  },
  setup(props) {
    const show = ref(false);

    const styles = {
      tooltip: computed(() => getTooltipStyles(props.delayIn, props.delayOut)),
    };

    return {
      id: useId('tooltip', props),
      styles,
      show,
      on: {
        enter: () => (show.value = true),
        leave: () => (show.value = false),
      },
    };
  },
});
</script>

<style lang="scss" scoped>
$position: bottom;
$padding: 10px;
$offset-base: 50%;
$offset-active: 20%;

@mixin base-translate($position) {
  @if $position == top or $position == bottom{
    transform: translate(-#{$offset-base}, 0);
  } @else if $position == left or $position == right {
    transform: translate(0, -#{$offset-base});
  } @else {
    @error "Unknown postion #{$position}"
  }
}

@mixin active-translate($position) {
  @if $position == top or $position == bottom{
    transform: translate(-#{$offset-base}, -#{$offset-active});
  } @else if $position == left or $position == right {
    transform: translate(-#{$offset-active},-#{$offset-base});
  } @else {
    @error "Unknown postion #{$position}"
  }
}

.wrapper {
  width: fit-content;
}

.tooltip {
  max-width: 12rem;

  &::after {
    content: "";
    position: absolute;
    border-style: solid;
    pointer-events: none;
  }

  &.top {
    left: 50%;
    bottom: calc(100% + #{$padding});

    $position: top !global;
    @include base-translate($position);

    &::after {
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-color: theme('colors.gray.800') transparent  transparent transparent;
    }
  }

  &.right {
    top: 50%;
    left: calc(100% + #{$padding});

    $position: right !global;
    @include base-translate($position);

    &::after {
      bottom: calc(50% - 5px);
      left: 0;
      margin-left: -10px;
      border-width: 5px;
      border-color: transparent theme('colors.gray.800') transparent transparent;
    }
  }

  &.bottom {
    left: 50%;
    top: calc(100% + #{$padding});

    $position: bottom !global;
    @include base-translate($position);

    &::after {
      bottom: 100%;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-color: transparent transparent theme('colors.gray.800') transparent;
    }
  }

  &.left {
    top: 50%;
    right: calc(100% + #{$padding});

    $position: left !global;
    @include base-translate($position);

    &::after {
      bottom: calc(50% - 5px);
      right: 0;
      margin-right: -10px;
      border-width: 5px;
      border-color: transparent transparent transparent theme('colors.gray.800');
    }
  }
}

.slide-enter-active {
  transition-duration: 150ms;
  transition-delay: var(--transition-delay-in);
}

.slide-leave-active {
  transition-duration: 150ms;
  transition-delay: var(--transition--delay-out);
}

.slide-enter-from {
  opacity: 0;
  @include active-translate($position);
}

.slide-enter-to , .slide-leave-from {
  opacity: 1;
  @include base-translate($position);
}

.slide-leave-to {
  opacity: 0;
  @include active-translate($position);
}
</style>
