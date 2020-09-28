<template>
  <div>
    <!-- TODO: Reimplement with Tailwind-->
  </div>
<!--  <target :id="project.uuid" name="project_row">-->
<!--    <v-text-field-->
<!--      v-model="project.name"-->
<!--      class="project__name"-->
<!--      type="text"-->
<!--      label="Name"-->
<!--    />-->
<!--    <v-text-field-->
<!--      v-model="project.description"-->
<!--      class="project__description"-->
<!--      type="text"-->
<!--      label="Description"-->
<!--    />-->
<!--  </target>-->
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { Project } from '~/src/models/Project';
import Target from '~/src/vue/components/atoms/Target.vue';

export default defineComponent({
  props: {
    project: {
      type: Project,
      required: true,
    },
  },

  components: {
    Target,
  },
});
</script>
