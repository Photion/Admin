<template>
  <div class="flex flex-wrap sm:flex-no-wrap gap-4">
    <div class="w-full sm:w-2/12 order-first sm:order-last sm:text-right">
      <PhoButton @click="methods.open()">Create New</PhoButton>
    </div>
    <div class="w-full sm:w-10/12 order-last sm:order-first">
      <PhoTable v-if="concepts.length">
        <template v-slot:thead>
          <tr class="border-b border-gray-600 text-xs text-left uppercase">
            <th class="pb-2">Name</th>
            <th class="pb-2">Tags</th>
            <th class="pb-2">Date</th>
            <th class="text-right pb-2">Actions</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr v-for="concept in concepts" :key="concept.uuid" :cy="`row:${concept.uuid}`" class="text-xs">
            <td class="py-3">
              <router-link :to="`/concepts/${concept.uuid}`" class="font-bold">{{ concept.name }}</router-link>
            </td>
            <td>{{ concept.tags.length ? concept.tags.join(', ') : 'No Tags' }}</td>
            <td>{{ concept.date }}</td>
            <td class="text-right py-3 text-right">
              <PhoButton @click="methods.open(concept)" name="concept.open" class="mr-1" icon="link" />
              <PhoButton icon="trash" name="concept.delete" color="danger" />
            </td>
          </tr>
        </template>
      </PhoTable>
      <div v-else>
        <span>No concepts defined yet</span>
      </div>
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
