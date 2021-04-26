<template>
  <div class="container m-auto flex flex-col items-center px-2 sm:px-8 pb-8">
    <h1 class="my-12 text-4xl sm:text-5xl font-sans font-bold text-gray-900-700">Alkotappd</h1>
    <div class="w-full sm:w-120">
      <template v-if="selectedStore == null">
        <search-input
          v-model="storeSearchphrase"
          placeholder="Hae myymälää (esim. Tampere Stockmann)"
        />
        <ul class="my-8">
          <store-item
            v-for="store in storeSearchResults"
            :key="store.id"
            :store="store"
            :selectable="true"
            @select="onSelectStore(store)"
          />
        </ul>
      </template>
      <template v-else>
        <div class="my-4">
          <back-button @click="onClearStoreSelection" />
        </div>
        <store-item :store="selectedStore" :selectable="false" />
        <div class="my-4 sm:my-8 border-b-2 border-gray-200" />
        <loading-indicator v-if="isLoadingProducts" />
        <template v-else>
          <sort-selector v-model="selectedSort" :options="sortOptions" />
          <product-item v-for="product of sortedProducts" :key="product.id" :product="product" />
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';

import { Product, Store } from './clients/api';
import { useApi } from './composables/use-api';
import BackButton from './components/back-button.vue';
import LoadingIndicator from './components/loading-indicator.vue';
import ProductItem from './components/product-item.vue';
import SearchInput from './components/search-input.vue';
import SortSelector, { SortOption } from './components/sort-selector.vue';
import StoreItem from './components/store-item.vue';

const SORT_BY_ABV: SortOption = { value: 'abv', label: 'ABV' };
const SORT_BY_NAME: SortOption = { value: 'name', label: 'Nimi (A-Z)' };
const SORT_BY_RATING: SortOption = { value: 'rating', label: 'Rating' };
const SORT_BY_TYPE: SortOption = { value: 'type', label: 'Oluttyyppi' };
const SORT_BY_COUNTRY: SortOption = { value: 'country', label: 'Valmistusmaa' };

export default defineComponent({
  name: 'App',
  components: {
    BackButton,
    LoadingIndicator,
    ProductItem,
    SearchInput,
    SortSelector,
    StoreItem
  },
  setup() {
    const { api } = useApi();

    const storeSearchphrase = ref('');

    const storeSearchResults = ref<Store[] | null>(null);

    const selectedStore = ref<Store | null>(null);

    const storeProducts = ref<Product[] | null>(null);

    const sortOptions: SortOption[] = [
      SORT_BY_NAME,
      SORT_BY_ABV,
      SORT_BY_RATING,
      SORT_BY_TYPE,
      SORT_BY_COUNTRY
    ];

    const selectedSort = ref<SortOption>(SORT_BY_NAME);

    const isLoadingProducts = ref(false);

    const sortedProducts = computed<Product[] | null>(() => {
      switch (selectedSort.value.value) {
        case SORT_BY_ABV.value:
          return Array.from<Product>(storeProducts.value!).sort((first, second) => {
            return parseInt(second.abv, 10) - parseInt(first.abv, 10);
          });
        case SORT_BY_RATING.value:
          return Array.from<Product>(storeProducts.value!).sort((first, second) => {
            return (second.untappdRatingScore || 0) - (first.untappdRatingScore || 0);
          });
        case SORT_BY_TYPE.value:
          return Array.from<Product>(storeProducts.value!).sort((first, second) => {
            return first.type.localeCompare(second.type);
          });
        case SORT_BY_COUNTRY.value:
          return Array.from<Product>(storeProducts.value!).sort((first, second) => {
            return first.country.localeCompare(second.country);
          });
        default:
          return storeProducts.value;
      }
    });

    watch(storeSearchphrase, async () => {
      if (storeSearchphrase.value.length > 0) {
        storeSearchResults.value = null;
        storeSearchResults.value = await api.searchStores(storeSearchphrase.value);
      }
    });

    const onSelectStore = async (store: Store) => {
      selectedStore.value = store;
      isLoadingProducts.value = true;
      const products = await api.getStoreProducts(selectedStore.value.id);
      isLoadingProducts.value = false;
      storeProducts.value = products;
    };

    const onClearStoreSelection = () => {
      storeSearchphrase.value = '';
      storeSearchResults.value = null;
      selectedStore.value = null;
      storeProducts.value = null;
    };

    return {
      storeSearchphrase,
      storeSearchResults,
      selectedStore,
      sortedProducts,
      sortOptions,
      selectedSort,
      isLoadingProducts,
      onSelectStore,
      onClearStoreSelection
    };
  }
});
</script>
