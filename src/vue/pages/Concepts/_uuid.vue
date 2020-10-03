<template>
  <div>
    <h2 class="mt-5 mb-10 text-3xl" contenteditable @input="updateName" cy="field:concept.name">{{ concept.name }}</h2>
    <Dropzone @files="onDrop" style="min-height: 500px">
      <div v-if="preview" class="grid grid-cols-1 sm:grid-cols-2 gap-2" cy="concept.preview">
        <div>
          <img v-if="preview" :src="preview" />
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
          <PhoInputText v-model="concept.description" name="concept.description" label="Description" />
          <PhoSelect v-model="concept.type" label="Type" name="concept.type" :options="types" />
          <PhoSelect
            v-if="projects.length"
            multiple
            v-model="concept.projects"
            name="concept.projects"
            label="Projects"
            :options="projects" />
          <PhoInputText type="date" v-model="concept.date" label="Date" name="concept.date" />
          <div class="grid grid-cols-2 gap-2">
            <PhoBoolean v-model="concept.public" name="concept.public" label="Public" />
            <PhoBoolean v-model="concept.featured" name="concept.featured"  label="Featured" />
          </div>
          <div v-if="concept.created" class="text-right space-x-1">
            <PhoButton cy="button:concept.save" color="success" @click="concept.save()">Save</PhoButton>
            <PhoButton cy="button:concept.remove" color="danger" @click="concept.remove()">Delete</PhoButton>
          </div>
          <div v-else>
            <PhoButton cy="button:concept.create" color="success" @click="concept.save()">Create</PhoButton>
          </div>
        </div>
      </div>
    </Dropzone>
  </div>
</template>


<script lang="ts">
import dayjs from 'dayjs';
import { defineComponent, onBeforeMount, ref, watch } from 'vue';

import { Concept } from '~/src/models/Concept';
import { Fragment } from '~/src/models/Fragment';
import { Project } from '~/src/models/Project';

import { router } from '~/src/vue/router';
import Dropzone from '~/src/vue/components/ui/forms/Dropzone.vue';
import FragmentCard from '~/src/vue/components/organisms/fragments/FragmentCard.vue';
import PhoBoolean from '~/src/vue/components/ui/forms/PhoBoolean.vue';
import PhoInputText from '~/src/vue/components/ui/forms/PhoInputText.vue';
import PhoSelect from '~/src/vue/components/ui/forms/PhoSelect.vue';
import PhoButton from '~/src/vue/components/ui/PhoButton.vue';
import { SelectOption, toOption } from '~/src/utils';


export default defineComponent({

  components: {
    Dropzone,
    FragmentCard,
    PhoBoolean,
    PhoInputText,
    PhoSelect,
    PhoButton,
  },

  setup() {
    const preview = ref('');

    const file = ref<File | null>(null);
    const concept = ref(new Concept({ type: Concept.Type.IMAGE, name: 'New Media' }));
    const fragments = ref<Fragment[]>([]);
    const projects = ref<SelectOption[]>([]);

    const removeFragment = (fragment: Fragment) => {
      const index = fragments.value.findIndex(el => el.uuid === fragment.uuid);

      if (index > -1) {
        fragments.value.splice(index, 1);
      }
    };

    const updatePreview = (fragment: Fragment) => {
      if (!preview.value) {
        if (fragment.url) {
          preview.value = fragment.url;
        }
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
          .forEach(fragment => {
            fragments.value.push(fragment);
            updatePreview(fragment);
          });
      }

      (await Project.list())
        .map((project): SelectOption => ({ value: project.uuid, text: project.name }))
        .forEach(option => projects.value.push(option));
    });

    const addFile = async (value: File) => {
      const fragment = new Fragment({ concept: concept.value.uuid });
      await fragment.setFile(value);


      fragments.value.unshift(fragment);
      updatePreview(fragment);
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

    return {
      preview,
      file,
      concept,
      fragments,
      projects,
      onDrop,
      updateName,
      types: Object.values(Concept.Type).map(toOption),
      removeFragment,
    };
  },
});
</script>
