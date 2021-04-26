<template>
  <button
    class="flex items-center bg-gray-200 py-2 px-5 text-sm rounded-full hover:bg-gray-300 focus:outline-none transition-colors"
    @click="$emit('click')"
  >
    <i class="mi-arrow-left icon-sm mr-2" />
    Takaisin
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'StoreItem',
  emits: ['click']
});
</script>
