<template>
  <div>
    <h2 class="mt-5 mb-10 text-3xl" contenteditable @input="updateName" cy="field:folder.name">{{ folder.name }}</h2>
    <Dropzone @files="onDrop" style="min-height: 500px">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6" cy="folder.preview">
        <div>
          <component :is="previewer" :folder="folder" :medium="preview" />
          <div>
            <MediumCard
              v-for="medium in media"
              :key="medium.uuid"
              :folder="folder"
              :medium="medium"
              @remove="removeMedium(medium)" />
          </div>
        </div>
        <div>
          <PhoTextField v-model="folder.description" name="folder.description" label="Description" />
          <PhoSelect v-model="folder.type" label="Type" name="folder.type" :options="types" />
          <PhoSelect
            v-if="projects.length"
            multiple
            v-model="folder.projects"
            name="folder.projects"
            label="Projects"
            :options="projects" />
          <PhoTextField
            type="date"
            v-model="folder.date"
            label="Date"
            name="folder.date"
            min="1900-01-01"
            :max="dateMax" />
          <div class="grid grid-cols-2 gap-2">
            <PhoBoolean v-model="folder.public" name="folder.public" inline label="Public" />
            <PhoBoolean v-model="folder.featured" name="folder.featured"  inline label="Featured" />
          </div>
          <div class="text-right space-x-1">
            <PhoButton name="folder.save" color="success" @click="saveFolder(folder)">Save</PhoButton>
            <PhoButton v-if="folder.created" name="folder.remove" color="danger" @click="deleteFolder(folder)">Delete</PhoButton>
          </div>
        </div>
      </div>
    </Dropzone>
  </div>
</template>


<script lang="ts">
import dayjs from 'dayjs';
import { defineComponent, onBeforeMount, ref, watch, computed, reactive } from 'vue';

import { client } from '~/src/state/service';
import { setFile } from '~/src/models/Model';
import { Folder, FolderModel } from '~/src/models/Folder';
import { Medium, MediumModel } from '~/src/models/Medium';
import { ProjectModel } from '~/src/models/Project';

import { FileCategory, hasPreview, getFriendlyFilename } from '~/src/files/metadata';
import { router } from '~/src/vue/router';
import Dropzone from '~/src/vue/components/ui/forms/Dropzone.vue';
import ImagePreview from '~/src/vue/components/organisms/media/ImagePreview.vue';
import SoundPreview from '~/src/vue/components/organisms/media/SoundPreview.vue';
import VideoPreview from '~/src/vue/components/organisms/media/VideoPreview.vue';
import MediumCard from '~/src/vue/components/organisms/media/MediumCard.vue';
import PhoBoolean from '~/src/vue/components/ui/forms/PhoBoolean.vue';
import PhoTextField from '~/src/vue/components/ui/forms/PhoTextField.vue';
import PhoSelect from '~/src/vue/components/ui/forms/PhoSelect.vue';
import PhoButton from '~/src/vue/components/ui/PhoButton.vue';
import { SelectOption, toOption } from '~/src/utils';


export default defineComponent({

  components: {
    Dropzone,
    ImagePreview,
    SoundPreview,
    VideoPreview,
    MediumCard,
    PhoBoolean,
    PhoTextField,
    PhoSelect,
    PhoButton,
  },

  setup() {

    const folder = reactive(FolderModel.schema.validateSync({}));
    const file = ref<File | null>(null);
    const media = reactive<Medium[]>([]);
    const projects = ref<SelectOption[]>([]);

    const previewer = computed(() => {
      switch (folder.type) {
      case FileCategory.IMAGE:
        return 'ImagePreview';
      case FileCategory.SOUND:
        return 'SoundPreview';
      case FileCategory.VIDEO:
        return 'VideoPreview';
      default:
        throw new Error(`Invalid Folder.Type: '${folder.type}`);
      }
    });

    const preview = computed(() => {
      return media.find(hasPreview);
    });

    const removeMedium = async (medium: Required<Medium>) => {
      client.value.remove(MediumModel, medium.uuid);

      const index = media.findIndex(el => el.uuid === medium.uuid);

      if (index > -1) {
        media.splice(index, 1);
      }
    };

    const readMetadata = (medium: Medium) => {
      if (medium.meta.filename) {
        folder.name = getFriendlyFilename(medium.meta.filename);
      }

      if (medium.meta.date) {
        folder.date = dayjs(medium.meta.date).format('YYYY-MM-DD');
      }
    };

    onBeforeMount(async () => {
      const uuid = router.currentRoute.value.params.uuid;
      if (uuid !== 'new' && typeof uuid === 'string') {
        const folderResponse = await client.value.retrieve(FolderModel, uuid);
        Object.assign(folder, folderResponse);

        const mediaResponse = await client.value.list(MediumModel);

        mediaResponse
          .filter((medium) => medium.folder === folder.uuid)
          .forEach((medium) => { media.push(medium); });
      }

      (await client.value.list(ProjectModel))
        .map((project): SelectOption => ({ value: project.uuid, text: project.name }))
        .forEach(option => projects.value.push(option));
    });

    const addFile = async (value: File) => {
      const medium = await MediumModel.schema.validate({ folder: folder.uuid });
      medium.meta.public = folder.public;
      await setFile(medium, value);


      media.push(medium);
      await readMetadata(medium);
    };

    const onDrop = async (files: File[]) => {
      await files.forEach(async (file) => {
        await addFile(file);
      });
    };

    const updateName = ($event: InputEvent) => {
      folder.name = ($event.target as HTMLElement).innerText;
    };

    const deleteFolder = async (folder: Required<Folder>) => {
      await client.value.remove(FolderModel, folder.uuid);
      router.push('/folders');
    };

    watch(file, async () => {
      if (file.value) {
        addFile(file.value);
        file.value = null;
      }
    });

    const saveFolder = async (folder: Required<Folder>)=>{
      await client.value.save(FolderModel, folder);
      router.push(`/folders/${folder.uuid}`);
    };

    const dateMax =`${(new Date().getFullYear())}-12-31`;

    return {
      preview,
      previewer,
      file,
      folder,
      media,
      projects,
      onDrop,
      updateName,
      saveFolder,
      deleteFolder,
      types: Object.values(FileCategory).map(toOption),
      removeMedium,
      dateMax,
    };
  },
});
</script>
