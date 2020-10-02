<template>
  <div>
    <!-- TODO: Reimplement with Tailwind-->
  </div>
<!--  <v-menu-->
<!--    v-model="showMenu"-->
<!--    :close-on-content-click="false"-->
<!--    :nudge-right="40"-->
<!--    transition="scale-transition"-->
<!--    offset-y-->
<!--    min-width="290px"-->
<!--  >-->
<!--    <template v-slot:activator="{ on, attrs }">-->
<!--      <v-text-field-->
<!--        :label="label"-->
<!--        :value="value"-->
<!--        v-bind="attrs"-->
<!--        :name="name"-->
<!--        :data-cy="`input__${name}`"-->
<!--        @input="$emit('input', $event)"-->
<!--        v-on="on"-->
<!--      />-->
<!--    </template>-->
<!--    <v-date-picker :value="value" :data-cy="`picker__${name}`" @input="onInput" />-->
<!--  </v-menu>-->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({

  props: {
    name: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      default: '',
    },
  },

  setup(_props, { emit }) {
    const showMenu = ref(false);

    const onInput = (newValue: string) => {
      showMenu.value = false;
      emit('input', newValue);
    };

    return {
      showMenu,
      onInput,
    };
  },
});
</script>
