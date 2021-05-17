<template>
  <div class="container m-auto flex flex-col items-center px-2 sm:px-8 pb-8">
    <h1 class="my-12 text-4xl sm:text-5xl font-sans font-bold text-gray-900-700">Alkotappd</h1>
    <div class="w-full sm:w-120">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
});
</script>
