<template>
  <div cy="fragment.card" class="py-3">
    <div class="flex gap-4">
      <PhoTextField
        v-model="fragment.meta.filename"
        label="Filename"
        name="fragment.meta.filename"
        class="w-full sm:w-6/12"
        disabled />
      <PhoSelect
        v-model="fragment.meta.storage"
        :options="storages"
        label="Role"
        name="fragment.meta.storage"
        @update:modelValue="fn.save"
        class="w-full sm:w-4/12" />
      <PhoBoolean
        v-model="fragment.meta.public"
        label="Public"
        name="fragment.meta.public"
        @input="fn.save"
        class="w-full sm:w-2/12" />
    </div>
    <div class="w-full text-right">
      <div class="space-x-1">
        <PhoButton v-if="fragment.created" cy="button:fragment.download" color="success" disabled>
          <FontAwesomeIcon icon="cloud-download-alt" />
        </PhoButton>
        <PhoButton v-else cy="button:fragment.upload" @click="fn.upload">
          <FontAwesomeIcon icon="cloud-upload-alt" />
        </PhoButton>
        <PhoButton cy="button:fragment.remove" color="danger" @click="fn.remove">
          <FontAwesomeIcon icon="trash" />
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
import PhoBoolean from '~/src/vue/components/ui/forms/PhoBoolean.vue';
import PhoTextField from '~/src/vue/components/ui/forms/PhoTextField.vue';
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
    PhoBoolean,
    PhoTextField,
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

    return {
      storages,
      preview,
      fn: {
        upload: () => props.fragment.upload(),
        save: () => props.fragment.save(),
        remove: () => emit('remove'),
      },
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
