<template>
  <div class="pho-field-wrapper relative">
    <label v-if="label" :for="id.unique" class="pho-label">{{ label }}</label>
    <div class="relative">
      <button
        :id="`${id.unique}:trigger`"
        :cy="`${id.family}:trigger`"
        @click="fn.toggleMenu(!showOptions)"
        @focusend="fn.toggleMenu(false)"
        type="button"
        class="pho-field focus:outline-none"
        aria-haspopup="true"
        aria-expanded="true">
        <div class="flex">
          <div class="flex-grow text-left">{{ displayValue }}</div>
          <div class="flex" style="margin-right: 5px">
            <FontAwesomeIcon v-if="showOptions" icon="times"  @click="fn.toggleMenu(false, $event)" :cy="`${id.family}:trigger:close`"  />
            <FontAwesomeIcon v-else icon="chevron-down" :cy="`${id.family}:trigger:open`" />
          </div>
        </div>
        <div v-if="showOptions" class="absolute left-0 w-full mt-2 w-56 rounded-md shadow-lg cursor-pointer" style="z-index: 10">
          <div class="rounded-md bg-white shadow-xs py" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <PhoSelectOption
              v-for="option in options"
              :key="option.value"
              :identifier="id.family"
              :option="option"
              :current="is.current(option)"
              :selected="is.selected(option)"
              @mouseenter="on.option.hover(option)"
              @option="on.option.click" />
          </div>
        </div>
      </button>
    </div>
    <input
      :id="id.unique"
      :value="modelValue"
      :name="name"
      :cy="id.family"
      class="hidden" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';

import { componentProps, useId } from '~/src/vue/components/shared';
import { getFormProps } from '~/src/vue/components/ui/forms/forms';
import PhoSelectOption from '~/src/vue/components/ui/forms/PhoSelectOption.vue';
import { SelectOption, SelectOptionValue } from '~/src/utils';
import FontAwesomeIcon from '~/src/vue/components/ui/forms/FontAwesomeIcon.vue';

export default defineComponent({

  components: {
    PhoSelectOption,
    FontAwesomeIcon,
  },

  props: {
    ...componentProps,
    ...getFormProps([Number, String, Object, Array] as PropType<SelectOptionValue | SelectOptionValue[]>),
    options: {
      type: Object as PropType<SelectOption[]>,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: () => false,
    },
  },

  setup(props, context) {
    const current = ref<SelectOption | null>(null);
    const showOptions = ref(false);

    const displayValue = computed(() => {
      let target: SelectOptionValue[];

      if (Array.isArray(props.modelValue)) {
        target = props.modelValue;
      } else {
        target = [props.modelValue];
      }

      return props.options
        .filter((option) => target.includes(option.value))
        .map((option) => option.text)
        .join(', ');
    });

    /**
     * Toggles the options menu
     *
     * @param state
     * @param $event
     */
    const toggleMenu = (state: boolean, $event?: MouseEvent) => {
      if ($event) {
        $event.stopPropagation();
      }
      showOptions.value = state;
    };


    /**
     * Toggles an option
     *
     * @param option
     */
    const toggleOption = (option: SelectOption) => {
      if (Array.isArray(props.modelValue)) {
        const values = props.modelValue.slice();
        const index = values.indexOf(option.value);

        if (index === -1) {
          values.push(option.value);
        } else {
          values.splice(index, 1);
        }
        return values;
      } else {
        return option.value;
      }
    };

    /**
     * Returns whether an option is selected
     *
     * @param option
     */
    const isSelected = (option: SelectOption) => {
      if (Array.isArray(props.modelValue)) {
        return props.modelValue.includes(option.value);
      } else {
        return option.value === props.modelValue;
      }
    };

    /**
     * Handles an option selection/deselection event
     *
     * @param option
     */
    const onOption = (option: SelectOption) => {
      const value = toggleOption(option);
      context.emit('update:modelValue', value);

      if (typeof props.modelValue === 'string') {
        toggleMenu(false);
      }

    };

    return {
      id: useId('field', props),
      showOptions,
      displayValue,
      fn: {
        toggleMenu,
      },
      is: {
        current: (option: SelectOption) => option.value === current.value?.value,
        selected: isSelected,
      },
      on: {
        option: {
          hover: (option: SelectOption) => (current.value = option),
          click: onOption,
        },
      },
    };
  },

});
</script>
