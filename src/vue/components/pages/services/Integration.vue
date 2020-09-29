<template>
  <div>
    <PhoCard :cy="`integration:${service.slug}`" clickable logo="service.logo">
      <router-link :to="data.target">
        <div><strong>{{ service.name }}</strong></div>
        <div><small>{{ service.description }}</small></div>
        <div v-if="selected">Back to all services</div>
        <div v-else>Select</div>
      </router-link>
    </PhoCard>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import { Service } from '~/src/models/services';
import PhoCard from '~/src/vue/components/ui/PhoCard.vue';

export default defineComponent({

  components: {
    PhoCard,
  },

  props: {
    service: {
      type: Object as () => Service,
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
