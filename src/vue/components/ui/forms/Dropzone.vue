<template>
  <div v-on="events" class="dropzone" :class="{ dragging }">
    <slot>
      <div @click="click" class="dropzone-slot">{{ label }}</div>
    </slot>
    <input ref="fileInput" type="file" class="dropzone-file" @input="onInput" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({

  props: {
    label: {
      type: String,
      default: () => 'Click anywhere or drop files',
    },
  },

  setup(_props, { emit }) {
    const count = ref(0);
    const dragging = computed(() => Boolean(count.value));
    const fileInput = ref<HTMLElement | null>(null);

    const click = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    const dragenter = ($event: DragEvent) => {
      count.value++;
      $event.preventDefault();
      emit('dragenter', $event);
    };

    const dragleave = ($event: DragEvent) => {
      $event.preventDefault();
      count.value--;
      emit('dragleave', $event);
    };

    const dragend = ($event: DragEvent) => {
      $event.preventDefault();
      emit('dragend', $event);
    };

    const dragover = ($event: DragEvent) => {
      $event.preventDefault();
      emit('dragover', $event);
    };

    const drop = async ($event: DragEvent) => {
      $event.preventDefault();
      count.value = 0;

      if ($event.dataTransfer?.files) {
        const files = Array.from($event.dataTransfer.files);
        emit('files', files);
      } else {
        emit('files', []);
      }
    };

    const onInput = async ($event: InputEvent) => {
      $event.preventDefault();
      const files = ($event.target as HTMLInputElement).files ?? [];
      emit('files', Array.from(files));

    };

    return {
      dragging,
      fileInput,
      click,
      onInput,
      events: {
        dragenter,
        dragleave,
        dragend,
        dragover,
        drop,
      },
    };
  },
});
</script>
<style scoped>
.dropzone {
  border: 1px solid #c9c9c9;
  padding: 15px;
  transition: all 1s;
}

.dropzone-slot {
  width: 100%;
  height: 100%
}

.dropzone-file {
  display: none;
}

.dragging {
  background-color: #f1f1f1;
  border-color: black;
}

</style>
