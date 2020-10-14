<template>
  <div>
    <h2 class="mt-5 mb-10 text-3xl" contenteditable @input="updateName" cy="field:concept.name">{{ concept.name }}</h2>
    <Dropzone @files="onDrop" style="min-height: 500px">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6" cy="concept.preview">
        <div>
          <component :is="previewer" :concept="concept" :fragment="preview" />
          <div>
            <FragmentCard
              v-for="fragment in fragments"
              :key="fragment.uuid"
              :concept="concept"
              :fragment="fragment"
              @remove="removeFragment(fragment)" />
          </div>
        </div>
        <div>
          <PhoTextField v-model="concept.description" name="concept.description" label="Description" />
          <PhoSelect v-model="concept.type" label="Type" name="concept.type" :options="types" />
          <PhoSelect
            v-if="projects.length"
            multiple
            v-model="concept.projects"
            name="concept.projects"
            label="Projects"
            :options="projects" />
          <PhoTextField type="date" v-model="concept.date" label="Date" name="concept.date" />
          <div class="grid grid-cols-2 gap-2">
            <PhoBoolean v-model="concept.public" name="concept.public" inline label="Public" />
            <PhoBoolean v-model="concept.featured" name="concept.featured"  inline label="Featured" />
          </div>
          <div v-if="concept.created" class="text-right space-x-1">
            <PhoButton name="concept.save" color="success" @click="saveConcept(concept)">Save</PhoButton>
            <PhoButton name="concept.remove" color="danger" @click="concept.remove()">Delete</PhoButton>
          </div>
          <div v-else class="text-right space-x-1">
            <PhoButton name="concept.create" color="success" @click="saveConcept(concept)">Create</PhoButton>
          </div>
        </div>
      </div>
    </Dropzone>
  </div>
</template>


<script lang="ts">
import dayjs from 'dayjs';
import { defineComponent, onBeforeMount, ref, watch, computed } from 'vue';

import { Concept } from '~/src/models/Concept';
import { Fragment } from '~/src/models/Fragment';
import { Project } from '~/src/models/Project';

import { FileStorage } from '~/src/files/metadata';
import { router } from '~/src/vue/router';
import Dropzone from '~/src/vue/components/ui/forms/Dropzone.vue';
import ImagePreview from '~/src/vue/components/organisms/fragments/ImagePreview.vue';
import SoundPreview from '~/src/vue/components/organisms/fragments/SoundPreview.vue';
import VideoPreview from '~/src/vue/components/organisms/fragments/VideoPreview.vue';
import FragmentCard from '~/src/vue/components/organisms/fragments/FragmentCard.vue';
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
    FragmentCard,
    PhoBoolean,
    PhoTextField,
    PhoSelect,
    PhoButton,
  },

  setup() {

    const file = ref<File | null>(null);
    const concept = ref(new Concept({ type: Concept.Type.IMAGE, name: 'New Media' }));
    const fragments = ref<Fragment[]>([]);
    const projects = ref<SelectOption[]>([]);

    const previewer = computed(() => {
      switch (concept.value.type) {
      case Concept.Type.IMAGE:
        return 'ImagePreview';
      case Concept.Type.SOUND:
        return 'SoundPreview';
      case Concept.Type.VIDEO:
        return 'VideoPreview';
      default:
        throw new Error(`Invalid Concept.Type: '${concept.value.type}`);
      }
    });

    const preview = computed(() => {
      return fragments.value.find((fragment) => fragment.hasPreview && fragment.meta.storage === FileStorage.PREVIEW);
    });

    const removeFragment = (fragment: Fragment) => {
      const index = fragments.value.findIndex(el => el.uuid === fragment.uuid);

      if (index > -1) {
        fragments.value.splice(index, 1);
      }
    };

    const readMetadata = (fragment: Fragment) => {
      concept.value.name = fragment.name;

      if (fragment.meta.date) {
        concept.value.date = dayjs(fragment.meta.date).format('YYYY-MM-DD');
      }
    };

    onBeforeMount(async () => {
      if (router.currentRoute.value.params.uuid !== 'new') {
        concept.value = await Concept.retrieve(router.currentRoute.value.params.uuid as string);

        (await Fragment.list())
          .filter((fragment) => fragment.concept === concept.value.uuid)
          .forEach((fragment) => {
            fragments.value.push(fragment);
          });
      }

      (await Project.list())
        .map((project): SelectOption => ({ value: project.uuid, text: project.name }))
        .forEach(option => projects.value.push(option));
    });

    const addFile = async (value: File) => {
      const fragment = new Fragment({ concept: concept.value.uuid });
      fragment.meta.public = concept.value.public;
      await fragment.setFile(value);


      fragments.value.push(fragment);
      readMetadata(fragment);
    };


    const onDrop = async (files: File[]) => {
      await files.forEach(async (file) => {
        await addFile(file);
      });
    };

    const updateName = ($event: InputEvent) => {
      concept.value.name = ($event.target as HTMLElement).innerText;
    };


    watch(file, async () => {
      if (file.value) {
        addFile(file.value);
        file.value = null;
      }
    });

    const saveConcept=async (concept:Concept)=>{
      await concept.save();
      const target = concept?.uuid ?? 'new';
      router.push(`/concepts/${target}`);
    }

    return {
      preview,
      previewer,
      file,
      concept,
      fragments,
      projects,
      onDrop,
      updateName,
      types: Object.values(Concept.Type).map(toOption),
      removeFragment,
      saveConcept
    };
  },
});
</script>
