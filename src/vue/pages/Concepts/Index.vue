<template>
  <div>
    <!-- TODO: Reimplement with Tailwind-->
  </div>
<!--  <div>-->
<!--    <v-row>-->
<!--      <v-col-->
<!--        cols="12"-->
<!--        sm="2"-->
<!--        order="1"-->
<!--        orderSm="2"-->
<!--        class="text-right">-->
<!--        <v-btn text color="primary" @click="methods.open()" outlined>Create New</v-btn>-->
<!--      </v-col>-->
<!--      <v-col cols="12" sm="10" order="2" orderSm="1">-->
<!--        <div v-if="concepts.length">-->
<!--          <v-simple-table>-->
<!--            <template v-slot:default>-->
<!--              <thead>-->
<!--                <tr class="text-left">-->
<!--                  <th>Concept</th>-->
<!--                  <th class="text-right">Actions</th>-->
<!--                </tr>-->
<!--              </thead>-->
<!--              <tbody>-->
<!--                <tr v-for="concept in concepts" :key="concept.uuid"  :data-cy="`concepts__table__${concept.uuid}`">-->
<!--                  <td>{{ concept.name }}</td>-->
<!--                  <td class="text-right">-->
<!--                    <v-btn text color="primary" @click="methods.open(concept)">Open</v-btn>-->
<!--                    <v-btn text color="error">Delete</v-btn>-->
<!--                  </td>-->
<!--                </tr>-->
<!--              </tbody>-->
<!--            </template>-->
<!--          </v-simple-table>-->
<!--        </div>-->
<!--        <div v-else>-->
<!--          <span>No concepts defined yet</span>-->
<!--        </div>-->
<!--      </v-col>-->
<!--    </v-row>-->
<!--  </div>-->
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from '@vue/composition-api';

import { router } from '~/src/vue/router';
import Target from '~/src/vue/components/atoms/Target.vue';
import { Concept } from '~/src/models/Concept';

export default defineComponent({
  components: {
    Target,
  },

  setup() {
    const concepts = ref<Concept[]>([]);

    onBeforeMount(async () => {
      const response = await Concept.list();
      response.forEach(concept => concepts.value.push(concept));
    });

    const methods = {
      open: (concept: Concept | undefined) => {
        const target = concept?.uuid ?? 'new';
        router.push(`/concepts/${target}`);
      },
    };

    return {
      concepts,
      methods,
    };
  },
});
</script>
