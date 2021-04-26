<template>
  <li
    class="flex flex-col sm:flex-row py-3 px-4 transition-colors list-none"
    :class="{ 'hover:bg-gray-100 cursor-pointer': selectable }"
    @click="$emit('select')"
  >
    <div class="flex-grow mr-8 truncate">
      <p class="font-semibold">{{ store.name }}</p>
      <p class="text-sm text-gray-800 truncate">{{ store.address }}</p>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import { Store } from '../clients/api';

export default defineComponent({
  name: 'StoreItem',
  props: {
    store: {
      type: Object as PropType<Store>,
      required: true
    },
    selectable: {
      type: Boolean,
      default: true
    }
  },
  emits: ['select']
});
</script>
