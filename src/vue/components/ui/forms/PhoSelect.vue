<template>
  <div class="pho-field-wrapper relative">
    <label v-if="label" :for="identifier" class="pho-label">{{ label }}</label>
    <div class="relative">
      <button
        :id="`${identifier}:trigger`"
        :cy="`${reference}:trigger`"
        @click="fn.toggleMenu(!showOptions)"
        @focusend="fn.toggleMenu(false)"
        type="button"
        class="pho-field focus:outline-none"
        aria-haspopup="true"
        aria-expanded="true">
        <div class="flex">
          <div class="flex-grow text-left">{{ displayValue }}</div>
          <div style="margin-right: 5px">
            <FontAwesomeIcon v-if="showOptions" icon="times"  @click="fn.toggleMenu(false, $event)" :cy="`${reference}:trigger:close`"  />
            <FontAwesomeIcon v-else icon="chevron-down" :cy="`${reference}:trigger:open`" />
          </div>
        </div>
        <div v-if="showOptions" class="absolute left-0 w-full mt-2 w-56 rounded-md shadow-lg cursor-pointer" style="z-index: 10">
          <div class="rounded-md bg-white shadow-xs py" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <PhoSelectOption
              v-for="option in options"
              :key="option.value"
              :identifier="identifier"
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
      :id="identifier"
      :value="modelValue"
      :name="name"
      :cy="reference"
      class="hidden" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, PropType } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { createIdentifier } from '~/src/vue/components/shared';
import PhoSelectOption from '~/src/vue/components/ui/forms/PhoSelectOption.vue';
import { SelectOption, SelectOptionValue } from '~/src/utils';

export default defineComponent({

  components: {
    PhoSelectOption,
    FontAwesomeIcon,
  },

  props: {
    cy: {
      type: String,
      default: () => '',
    },
    label: {
      type: String,
      default: () => '',
    },
    options: {
      type: Object as PropType<SelectOption[]>,
      default: () => [],
    },
    name: {
      type: String,
      default: () => '',
    },
    modelValue: {
      type: [Number, String, Object, Array] as PropType<SelectOptionValue | SelectOptionValue[]>,
      required: true,
    },
    multiple: {
      type: Boolean,
      default: () => false,
    },
  },

  setup(props, context) {
    const current = ref<SelectOption | null>(null);
    const showOptions = ref(false);

    const identifier = createIdentifier('field', props.name);
    const reference = props.cy || identifier;

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
      showOptions,
      displayValue,
      identifier,
      reference,
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
