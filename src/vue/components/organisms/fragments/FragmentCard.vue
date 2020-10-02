<template>
  <div cy="fragment.card">
    <div>{{ fragment.uuid }}</div>
    <div v-if="fragment.created">
      <PhoButton cy="button:fragment.save" @click="fragment.save()">Save</PhoButton>
      <PhoButton cy="button:fragment.download" @click="fragment.save()">Download</PhoButton>
      <PhoButton cy="button:fragment.remove" @click="removeFragment">Delete</PhoButton>
    </div>
    <div v-else>
      <PhoButton cy="button:fragment.upload" @click="fragment.upload()">Upload</PhoButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

import { Concept } from '~/src/models/Concept';
import { Fragment } from '~/src/models/Fragment';
import { FileStorage } from '~/src/files/metadata';
import { toOption } from '~/src/utils';
import PhoButton from '~/src/vue/components/ui/PhoButton.vue';

enum Component {
  IMAGE = 'image-preview',
  SOUND = 'sound-preview',
  VIDEO = 'video-preview',
}

export default defineComponent({

  components: {
    PhoButton,
  },

  props: {
    concept: {
      type: Concept,
      required: true,
    },
    fragment: {
      type: Fragment,
      required: true,
    },
  },

  setup(props, { emit }) {
    const storages = Object.values(FileStorage).map(toOption);
    const preview = computed(() => Component[props.concept.type]);

    const removeFragment = async () => {
      await props.fragment.remove();
      emit('remove');
    };

    return {
      storages,
      preview,
      removeFragment,
    };
  },
});
</script>

<style scoped>
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
