<template>
  <div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <PhoCard v-if="ready" clickable>
        <router-link class="no-decoration" to="/concepts">
          <div><strong>List Concepts</strong></div>
          <div><small>Navigate, search and manage your media archive</small></div>
        </router-link>
      </PhoCard>
      <PhoCard clickable>
        <router-link class="no-decoration" to="/services">
          <div><strong>Pick a Service</strong></div>
          <div><small>You will provide credentials so that you can upload and classify your files</small></div>
        </router-link>
      </PhoCard>
    </div>
    <!-- TODO: Reimplement with Tailwind-->
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api';

import { ready } from '~/src/state/service';

import PhoCard from '~/src/vue/components/ui/PhoCard.vue';

export default defineComponent({

  components: {
    PhoCard,
  },

  setup() {
    return {
      ready,
    };
  },
});
</script>

<style scoped>
.no-decoration {
  text-decoration: none;
}
</style>
