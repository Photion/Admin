<template>
  <div cy="fragment.card" class="py-3">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <PhoInputText v-model="fragment.meta.filename" label="Filename" name="fragment.meta.filename" disabled />
      <PhoSelect v-model="fragment.meta.storage" :options="storages" label="Role" name="fragment.meta.storage" />
    </div>
    <div class="w-full text-right">
      <div v-if="fragment.created" class="space-x-1">
        <PhoButton cy="button:fragment.download" color="success" @click="fragment.save()">
          <FontAwesomeIcon icon="cloud-download-alt" />
        </PhoButton>
        <PhoButton cy="button:fragment.remove" color="danger" @click="removeFragment">
          <FontAwesomeIcon icon="trash" />
        </PhoButton>
      </div>
      <div v-else class="space-x-1">
        <PhoButton cy="button:fragment.upload" @click="fragment.upload()">
          <FontAwesomeIcon icon="cloud-upload-alt" />
        </PhoButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


import { Concept } from '~/src/models/Concept';
import { Fragment } from '~/src/models/Fragment';
import { FileStorage } from '~/src/files/metadata';
import { toOption } from '~/src/utils';
import PhoButton from '~/src/vue/components/ui/PhoButton.vue';
import PhoInputText from '~/src/vue/components/ui/forms/PhoInputText.vue';
import PhoSelect from '~/src/vue/components/ui/forms/PhoSelect.vue';

enum Component {
  IMAGE = 'image-preview',
  SOUND = 'sound-preview',
  VIDEO = 'video-preview',
}

export default defineComponent({

  components: {
    FontAwesomeIcon,
    PhoButton,
    PhoInputText,
    PhoSelect,
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
