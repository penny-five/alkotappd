<template>
  <div class="flex flex-col items-center my-12 animate-pulse">
    <i class="mi-search icon-4xl text-gray-400" />
    <span class="mt-4 text-sm font-medium text-gray-400">Ladataan tuloksia...</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadingIndicator'
});
</script>
