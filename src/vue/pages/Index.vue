<template>
  <div>
    <!-- TODO: Reimplement with Tailwind-->
  </div>
<!--  <div>-->
<!--    <v-row>-->
<!--      <v-col v-if="ready" cols="12" sm="4">-->
<!--        <v-card>-->
<!--          <router-link to="/concepts" class="no-decoration">-->
<!--            <v-card-text>-->
<!--              <strong class="text-overline">-->
<!--                List Concepts-->
<!--              </strong>-->
<!--              <div class="text&#45;&#45;secondary">-->
<!--                Navigate, search and manage your media archive.-->
<!--              </div>-->
<!--            </v-card-text>-->
<!--          </router-link>-->
<!--        </v-card>-->
<!--      </v-col>-->
<!--      <v-col cols="12" sm="4">-->
<!--        <v-card>-->
<!--          <router-link to="/services" class="no-decoration">-->
<!--            <v-card-text>-->
<!--              <strong class="text-overline">-->
<!--                Pick a Service-->
<!--              </strong>-->
<!--              <div class="text&#45;&#45;secondary">-->
<!--                You will provide credentials so that you can upload and classify your files.-->
<!--              </div>-->
<!--            </v-card-text>-->
<!--          </router-link>-->
<!--        </v-card>-->
<!--      </v-col>-->
<!--    </v-row>-->
<!--  </div>-->
</template>

<script>
import { defineComponent } from '@vue/composition-api';

import { ready } from '~/src/state/service';

export default defineComponent({

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
