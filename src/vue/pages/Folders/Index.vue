<template>
  <div class="flex flex-wrap sm:flex-no-wrap gap-4">
    <div class="w-full sm:w-2/12 order-first sm:order-last sm:text-right">
      <PhoButton @click="methods.open()">Create New</PhoButton>
    </div>
    <div class="w-full sm:w-10/12 order-last sm:order-first">
      <PhoTable v-if="folders.length">
        <template v-slot:thead>
          <tr class="border-b border-gray-600 text-xs text-left uppercase">
            <th class="pb-2">Name</th>
            <th class="pb-2">Tags</th>
            <th class="pb-2">Date</th>
            <th class="text-right pb-2">Actions</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr v-for="folder in folders" :key="folder.uuid" :cy="`row:${folder.uuid}`" class="text-xs">
            <td class="py-3">
              <router-link :to="`/folders/${folder.uuid}`" class="font-bold">{{ folder.name }}</router-link>
            </td>
            <td>{{ folder.tags.length ? folder.tags.join(', ') : 'No Tags' }}</td>
            <td>{{ folder.date }}</td>
            <td class="text-right py-3 text-right">
              <PhoButton @click="methods.open(folder)" name="folder.open" class="mr-1" icon="link" />
              <PhoButton icon="trash" name="folder.delete" color="danger" />
            </td>
          </tr>
        </template>
      </PhoTable>
      <div v-else>
        <span>No folders defined yet</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';

import { client } from '~/src/state/service';
import { router } from '~/src/vue/router';
import { FolderModel, Folder } from '~/src/models/Folder';

import PhoButton from '~/src/vue/components/ui/PhoButton.vue';
import PhoTable from '~/src/vue/components/ui/PhoTable.vue';

export default defineComponent({
  components: {
    PhoButton,
    PhoTable,
  },

  setup() {
    const folders = ref<Folder[]>([]);

    onBeforeMount(async () => {
      const response = await client.value.list(FolderModel);
      response.forEach(folder => folders.value.push(folder));
    });

    const methods = {
      open: (folder: Folder | undefined) => {
        const target = folder?.uuid ?? 'new';
        router.push(`/folders/${target}`);
      },
    };

    return {
      folders,
      methods,
    };
  },
});
</script>
