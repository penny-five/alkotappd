<template>
  <router-link :to="linkTarget">
    <li
      class="flex flex-col sm:flex-row py-3 px-4 transition-colors list-none"
      :class="{ 'hover:bg-gray-100 cursor-pointer': selectable }"
    >
      <div class="flex-grow mr-8 truncate">
        <p class="font-semibold">{{ store.name }}</p>
        <p class="text-sm text-gray-800 truncate">{{ store.address }}</p>
      </div>
    </li>
  </router-link>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { RouteLocationRaw } from 'vue-router';

import { Store } from '../clients/api';

const createStoreSlug = (store: Store) => {
  return store.name.toLowerCase().replaceAll(' ', '-');
};

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
  setup(props) {
    const slug = createStoreSlug(props.store);

    const linkTarget: RouteLocationRaw = {
      name: 'store',
      params: {
        id: props.store.id,
        slug
      }
    };

    return { linkTarget };
  }
});
</script>
