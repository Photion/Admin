<template>
  <div>
    <div>
      <div class="text-sm">Google Drive is correctly integrated with Photion.</div>
      <div class="flex gap-2 mt-3 justify-end">
        <PhoButton label="Disconnect Google Drive" color="danger" @click="on.disconnectGoogleDrive" name="googleDrive.disconnect" />
      </div>
    </div>
    <div class="mt-10">
      <div class="text-2xl">Integration Metadata</div>
      <div><small>Changing these values may break your integration</small></div>
      <div class="mt-5">
        <PhoTextField label="Access Token" v-model="secrets.googleDrive.accessToken" name="secrets.googleDrive.accessToken" />
        <PhoTextField label="Root Folder ID" v-model="secrets.googleDrive.rootFolderId" name="secrets.googleDrive.rootFolderId" />
        <PhoTextField label="Database ID" v-model="secrets.googleDrive.databaseId" name="secrets.googleDrive.databaseId" />
      </div>
      <div class="mt-5 text-right">
        <PhoButton label="Update" color="danger" @click="on.updateSecrets" />
      </div>
    </div>
    <div class="mt-10">
      <PhoTable name="googleDrive.files">
        <template v-slot:thead>
          <tr class="border-b border-gray-600 text-xs text-left uppercase">
            <th class="pb-2">Name</th>
            <th class="pb-2">Mime</th>
            <th class="pb-2 text-right">Actions</th>
          </tr>
        </template>
        <template v-slot:tbody>
          <tr
            v-for="googleDriveFile in files"
            :key="googleDriveFile.id"
            :cy="`row:googleDrive.files:${googleDriveFile.id}`"
            class="text-xs"
            :file-id="googleDriveFile.id">
            <td class="py-3">{{ googleDriveFile.name }}</td>
            <td>{{ googleDriveFile.mimeType }}</td>
            <td class="text-right">
              <PhoButton icon="trash" name="googleDriveFile.delete" color="danger" @click="on.delete(googleDriveFile)" />
            </td>
          </tr>
        </template>
      </PhoTable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';

import { deleteFile, searchFiles, DriveFile, clearGoogleDrive } from '~/src/api/googleDrive';
import { secrets, save } from '~/src/state/secrets';
import { googleDrive } from '~/src/state/service';

import PhoButton from '%/ui/PhoButton.vue';
import PhoTable from '%/ui/PhoTable.vue';
import PhoTextField from '%/ui/forms/PhoTextField.vue';

export default defineComponent({

  components: {
    PhoButton,
    PhoTable,
    PhoTextField,
  },

  setup() {
    const files = ref<DriveFile[]>([]);
    const loading = ref(true);

    onBeforeMount(async () => {
      files.value = await searchFiles();
      loading.value = true;
    });

    const onDelete = async (file: DriveFile) => {
      await deleteFile(file.id);
      files.value = await searchFiles();

      setTimeout(async () => (files.value = await searchFiles()), 3 * 1000);
    };

    const onDisconnectGoogleDrive = async () => {
      await clearGoogleDrive();

      secrets.googleDrive.accessToken = '';
      secrets.googleDrive.rootFolderId = '';
      secrets.googleDrive.databaseId = '';
      await save();
    };

    return {
      googleDrive,
      secrets,
      files,
      on: {
        delete: onDelete,
        updateSecrets: save,
        disconnectGoogleDrive: onDisconnectGoogleDrive,
      },
    };
  },
});
</script>
