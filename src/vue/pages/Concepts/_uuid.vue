<template>
  <div>
    <!-- TODO: Reimplement with Tailwind-->
  </div>
<!--  <div class="text-left">-->
<!--    <div class="text-h5 pa-1" contenteditable @input="updateName" data-cy="concept__name">{{ concept.name }}</div>-->
<!--    <target-->
<!--      :id="concept.uuid"-->
<!--      name="fragment__detail">-->
<!--      <Dropzone @drop="onDrop" style="min-height: 500px">-->
<!--        <v-row v-if="preview">-->
<!--          <v-col cols="12" sm="6">-->
<!--            <v-img :src="preview" />-->
<!--            <fragment-card-->
<!--              v-for="fragment in fragments"-->
<!--              :key="fragment.uuid"-->
<!--              :concept="concept"-->
<!--              :fragment="fragment"-->
<!--              @remove="removeFragment(fragment)" />-->
<!--          </v-col>-->
<!--          <v-col cols="12" sm="6">-->

<!--            <v-text-field v-model="concept.description" type="text" name="concept__description" label="Description" />-->
<!--            <v-select v-model="concept.type" label="Type" :items="types" name="concept__type" />-->
<!--            <v-select-->
<!--              v-model="concept.projects"-->
<!--              label="Projects"-->
<!--              :items="projects"-->
<!--              name="concept__projects"-->
<!--              data-cy="concept__projects"-->
<!--              :menu-props="{ closeOnContentClick: true }"-->
<!--              multiple-->
<!--              small-chips-->
<!--            />-->
<!--            <v-combobox-->
<!--              id="concept__tags"-->
<!--              v-model="concept.tags"-->
<!--              label="Tags"-->
<!--              name="concept__tags"-->
<!--              multiple-->
<!--              small-chips-->
<!--            />-->
<!--            <date-picker v-model="concept.date" label="Date" name="concept__date" />-->
<!--            <v-row>-->
<!--              <v-col cols="6">-->
<!--                <v-switch v-model="concept.public" class="mx-2" label="Public" name="concept__public" />-->
<!--              </v-col>-->
<!--              <v-col cols="6">-->
<!--                <v-switch v-model="concept.featured" class="mx-2" label="Featured" name="concept__featured" />-->
<!--              </v-col>-->
<!--            </v-row>-->
<!--            <div v-if="concept.created">-->
<!--              <v-btn-->
<!--                small-->
<!--                text-->
<!--                color="primary"-->
<!--                data-cy="concept__save"-->
<!--                @click="concept.save()">-->
<!--                Save Concept-->
<!--              </v-btn>-->
<!--              <v-btn-->
<!--                small-->
<!--                text-->
<!--                color="error"-->
<!--                data-cy="concept__remove"-->
<!--                @click="concept.remove()">-->
<!--                Delete Concept-->
<!--              </v-btn>-->
<!--            </div>-->
<!--            <div v-else>-->
<!--              <v-btn-->
<!--                small-->
<!--                text-->
<!--                color="primary"-->
<!--                data-cy="concept__create"-->
<!--                @click="concept.save()">-->
<!--                Create Concept-->
<!--              </v-btn>-->
<!--            </div>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--      </Dropzone>-->
<!--    </target>-->
<!--  </div>-->
</template>


<script lang="ts">
import dayjs from 'dayjs';
import { defineComponent, onBeforeMount, ref, watch } from '@vue/composition-api';

import { Concept } from '~/src/models/Concept';
import { Fragment } from '~/src/models/Fragment';
import { Project } from '~/src/models/Project';

import { router } from '~/src/vue/router';
import Target from '~/src/vue/components/atoms/Target.vue';
import DatePicker from '~/src/vue/components/atoms/DatePicker.vue';
import Dropzone from '~/src/vue/components/atoms/Dropzone.vue';
import FragmentCard from '~/src/vue/components/organisms/fragments/FragmentCard.vue';
import { SelectOption, toOption } from '~/src/utils';


export default defineComponent({

  components: {
    DatePicker,
    Dropzone,
    FragmentCard,
    Target,
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
      if (router.currentRoute.params.uuid !== 'new') {
        concept.value = await Concept.retrieve(router.currentRoute.params.uuid as string);

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
      for await (const file of files) {
        await addFile(file);
      }
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
