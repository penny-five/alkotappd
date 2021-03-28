<template>
  <li
    class="flex flex-col sm:flex-row py-3 px-4 transition-colors list-none"
    :class="{ 'hover:bg-gray-100 cursor-pointer': !isSelected }"
    @click="$emit('select')"
  >
    <div class="flex-grow mr-8 truncate">
      <p class="font-semibold">{{ store.name }}</p>
      <p class="text-sm text-gray-800 truncate">{{ store.address }}</p>
    </div>
    <button
      v-if="isSelected"
      class="flex-shrink-0 bg-gray-200 my-4 sm:my-0 py-2 px-5 text-sm rounded-full hover:bg-gray-300 focus:outline-none transition-colors"
      @click="$emit('unselect')"
    >
      Tyhjennä
    </button>
  </li>
</template>

<script lang="ts">
import debounce from 'lodash.debounce';
import { defineComponent, PropType } from 'vue';

import { Store } from '../clients/api';

export default defineComponent({
  name: 'store-item',
  props: {
    store: {
      type: Object as PropType<Store>,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  },
  emits: ['select', 'unselect']
});
</script>
