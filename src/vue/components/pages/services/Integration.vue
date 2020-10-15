<template>
  <div>
    <PhoXCard :cy="`integration:${service.slug}`" clickable :logo="service.logo">
      <router-link :to="data.target">
        <div><strong>{{ service.name }}</strong></div>
        <div><small>{{ service.description }}</small></div>
        <div class="text-right mt-3">
          <PhoButton v-if="selected" color="danger" label="Back to all services" />
          <PhoButton v-else label="Select" />
        </div>
      </router-link>
    </PhoXCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { Service } from '~/src/state/service';
import PhoButton from '~/src/vue/components/ui/PhoButton.vue';
import PhoXCard from '~/src/vue/components/ui/PhoXCard.vue';

export default defineComponent({

  components: {
    PhoButton,
    PhoXCard,
  },

  props: {
    service: {
      type: Object as <T>() => Service<T>,
      required: true,
    },
    selected: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const target = props.selected ? '/services' : `/services/${props.service.slug}`;

    return {
      data: {
        target,
      },
    };
  },
});
</script>

<style scoped>
a {
  text-decoration: none;
}
.text-right {
  text-align: right;
}

img {
  max-width: 100%;
}
</style>
