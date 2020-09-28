<template>
  <div>
    <!-- TODO: Reimplement with Tailwind-->
  </div>
<!--  <v-container>-->
<!--    <h2 class="mb5">-->
<!--      Projects-->
<!--    </h2>-->
<!--    <v-list>-->
<!--      <project-row v-for="project in projects" :key="project.uuid" :project="project" />-->
<!--    </v-list>-->
<!--    <v-btn id="projects__add_project" color="primary" @click="addProject">-->
<!--      Create new project-->
<!--    </v-btn>-->
<!--  </v-container>-->
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from '@vue/composition-api';

import { Project } from '~/src/models/Project';
import ProjectRow from '~/src/vue/components/pages/projects/ProjectRow.vue';

export default defineComponent({

  components: {
    ProjectRow,
  },

  setup() {
    const projects = ref<Project[]>([]);

    onBeforeMount(async () => {
      const response = await Project.list();
      response.forEach(project => projects.value.push(project));
    });

    const addProject = () => {
      const project = new Project({});
      projects.value.push(project);
    };

    return {
      projects,
      addProject,
    };
  },
});
</script>
