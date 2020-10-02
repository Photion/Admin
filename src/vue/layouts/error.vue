<template>
  <div>
    <!-- TODO: Reimplement with Tailwind-->
  </div>
<!--  <v-app dark>-->
<!--    <h1 v-if="error && error.statusCode === 404">-->
<!--      {{ title }}-->
<!--    </h1>-->
<!--    <NuxtLink to="/">-->
<!--      Home page-->
<!--    </NuxtLink>-->
<!--  </v-app>-->
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export const PAGE_NOT_FOUND = {
  title: '404 Not Found',
};

export const DEFAULT_ERROR = {
  title: 'An error occurred',
};

export default defineComponent({

  props: {
    error: {
      type: Object,
      default: null,
    },
  },

  setup(props) {
    let title: string;

    if (props.error && props.error.statusCode === 404) {
      title = PAGE_NOT_FOUND.title;
    } else {
      title = DEFAULT_ERROR.title;
    }

    const head = () => ({ title });

    return {
      title,
      head,
    };
  },

});
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
