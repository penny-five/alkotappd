<template>
  <div>
    <search-input
      v-model="storeSearchphrase"
      placeholder="Hae myymälää (esim. Tampere Stockmann)"
    />
    <loading-indicator v-if="isLoading" />
    <ul v-else class="my-8">
      <store-item
        v-for="store in storeSearchResults"
        :key="store.id"
        :store="store"
        :selectable="true"
        @select="onSelectStore(store)"
      />
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

import { Store } from '../clients/api';
import { useApi } from '../composables/use-api';
import LoadingIndicator from '../components/loading-indicator.vue';
import SearchInput from '../components/search-input.vue';
import StoreItem from '../components/store-item.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'App',
  components: {
    LoadingIndicator,
    SearchInput,
    StoreItem
  },
  setup() {
    const router = useRouter();

    const { api } = useApi();

    const storeSearchphrase = ref('');

    const storeSearchResults = ref<Store[] | null>(null);

    const isLoading = ref(false);

    watch(storeSearchphrase, async () => {
      if (storeSearchphrase.value.length > 0) {
        isLoading.value = true;
        storeSearchResults.value = await api.searchStores(storeSearchphrase.value);
        isLoading.value = false;
      }
    });

    const onSelectStore = async (store: Store) => {
      router.push({
        name: 'store',
        params: {
          id: store.id
        }
      });
    };

    return {
      isLoading,
      storeSearchphrase,
      storeSearchResults,
      onSelectStore
    };
  }
});
</script>
