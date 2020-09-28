<template>
  <div>
    <!-- TODO: Reimplement with Tailwind-->
  </div>
<!--  <v-card outlined :data-cy="`integration-${service.slug}`">-->
<!--    <router-link :to="data.target" class="text&#45;&#45;secondary">-->
<!--      <v-row dense>-->
<!--        <v-col cols="3" style="text-align: center">-->
<!--          <v-img :src="service.logo" class="ma-3" />-->
<!--        </v-col>-->
<!--        <v-col cols="9" class="pr-3">-->
<!--          <div>-->
<!--            <span class="text-overline">{{ service.name }}</span>-->
<!--          </div>-->
<!--          <div>-->
<!--            <span class="text-caption">-->
<!--              {{ service.description }}-->
<!--            </span>-->
<!--          </div>-->
<!--          <div class="text-right">-->
<!--            <div v-if="selected">-->
<!--              <v-btn small text color="error">-->
<!--                Back to all services-->
<!--              </v-btn>-->
<!--            </div>-->
<!--            <div v-else>-->
<!--              <v-btn small text color="primary">-->
<!--                Select-->
<!--              </v-btn>-->
<!--            </div>-->
<!--          </div>-->
<!--        </v-col>-->
<!--      </v-row>-->
<!--    </router-link>-->
<!--  </v-card>-->
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

import { Service } from '~/src/models/services';

export default defineComponent({

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
