<template>
  <div>
    <PhoButton @click="methods.open()">Create New</PhoButton>
    <PhoTable v-if="concepts.length">
      <template v-slot:thead>
        <tr>
          <th>Concept</th>
          <th>Actions</th>
        </tr>
      </template>
      <template v-slot:tbody>
        <tr v-for="concept in concepts" :key="concept.uuid" :cy="`row:${concept.uuid}`">
          <td>{{ concept.name }}</td>
          <td>
            <PhoButton @click="methods.open(concept)">Open</PhoButton>
            <PhoButton>Delete</PhoButton>
          </td>
        </tr>
      </template>
    </PhoTable>
    <div v-else>
      <span>No concepts defined yet</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';

import { router } from '~/src/vue/router';
import { Concept } from '~/src/models/Concept';

import PhoButton from '~/src/vue/components/ui/PhoButton.vue';
import PhoTable from '~/src/vue/components/ui/PhoTable.vue';

export default defineComponent({
  components: {
    PhoButton,
    PhoTable,
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
