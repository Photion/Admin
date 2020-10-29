<template>
  <div cy="medium.card" class="py-3">
    <div class="flex gap-4">
      <PhoTextField
        v-model="medium.meta.filename"
        label="Filename"
        name="medium.meta.filename"
        class="w-full sm:w-6/12"
        disabled />
      <PhoSelect
        v-model="medium.meta.storage"
        :options="storages"
        label="Role"
        name="medium.meta.storage"
        @update:modelValue="fn.save"
        class="w-full sm:w-4/12" />
      <PhoBoolean
        v-model="medium.meta.public"
        label="Public"
        name="medium.meta.public"
        @input="fn.save"
        class="w-full sm:w-2/12" />
    </div>
    <div class="w-full text-right">
      <div class="space-x-1">
        <PhoButton v-if="medium.created" cy="button:medium.download" color="success" disabled>
          <FontAwesomeIcon icon="cloud-download-alt" />
        </PhoButton>
        <PhoButton v-else cy="button:medium.upload" @click="fn.upload">
          <FontAwesomeIcon icon="cloud-upload-alt" />
        </PhoButton>
        <PhoButton cy="button:medium.remove" color="danger" @click="fn.remove">
          <FontAwesomeIcon icon="trash" />
        </PhoButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import { client } from '~/src/state/service';
import { Folder } from '~/src/models/Folder';
import { Medium, MediumModel } from '~/src/models/Medium';
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
    folder: {
      type: Object as () => Required<Folder>,
      required: true,
    },
    medium: {
      type: Object as () => Required<Medium>,
      required: true,
    },
  },

  setup(props, { emit }) {
    const storages = Object.values(FileStorage).map(toOption);
    const preview = computed(() => Component[props.folder.type]);

    return {
      storages,
      preview,
      fn: {
        upload: async () => {
          await client.value.save(MediumModel, props.medium);

          if (props.medium.file.file) {
            return client.value.api.uploadFile(MediumModel.namespace, props.medium.uuid, props.medium.meta, props.medium.file.file);
          }
        },
        save: () => client.value.save(MediumModel, props.medium),
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
