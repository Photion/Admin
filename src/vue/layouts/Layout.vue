<template>
  <div class="root">
    <header>
      <h1 class="mt-5 mb-10 text-5xl">
        <router-link to="/">Photion</router-link>
      </h1>
    </header>
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from '@vue/composition-api';
import { init } from '~/src/state/secrets';
import { service } from '~/src/state/service';


export default defineComponent({

  setup() {
    const title = ref('Photion Admin');

    onBeforeMount(init);

    return {
      title,
      service,
    };
  },
});
</script>

<style scoped>
.title {
  text-decoration: none;
  color: black;
}

a {
  text-decoration: none;
  color: black !important;
}

.root {
  max-width: 1000px;
  width: 100%;
  padding: 0px 25px;
  margin: auto;
}
</style>
