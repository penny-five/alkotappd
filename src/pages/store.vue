<template>
  <div>
    <loading-indicator v-if="isLoading">Ladataan myymälän tietoja...</loading-indicator>
    <template v-else>
      <div class="my-4">
        <back-button @click="onClickBack">Takaisin hakuun</back-button>
      </div>
      <store-item :store="store" :selectable="false" />
      <div class="my-4 sm:my-8 border-b-2 border-gray-200" />
      <sort-selector v-model="selectedSort" :options="sortOptions" />
      <product-item v-for="product of sortedProducts" :key="product.id" :product="product" />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { Product, Store } from '../clients/api';
import { useApi } from '../composables/use-api';
import BackButton from '../components/back-button.vue';
import LoadingIndicator from '../components/loading-indicator.vue';
import ProductItem from '../components/product-item.vue';
import SortSelector, { SortOption } from '../components/sort-selector.vue';
import StoreItem from '../components/store-item.vue';

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
    SortSelector,
    StoreItem
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const { api } = useApi();

    const storeId = route.params.id as string;

    const store = ref<Store | null>(null);

    const storeProducts = ref<Product[]>([]);

    const isLoading = ref(true);

    onMounted(async () => {
      store.value = await api.getStore(storeId);
      storeProducts.value = await api.getStoreProducts(storeId);
      isLoading.value = false;
    });

    const sortOptions: SortOption[] = [
      SORT_BY_NAME,
      SORT_BY_ABV,
      SORT_BY_RATING,
      SORT_BY_TYPE,
      SORT_BY_COUNTRY
    ];

    const selectedSort = ref<SortOption>(SORT_BY_NAME);

    const sortedProducts = computed<Product[]>(() => {
      switch (selectedSort.value.value) {
        case SORT_BY_ABV.value:
          return Array.from<Product>(storeProducts.value).sort((first, second) => {
            return parseInt(second.abv, 10) - parseInt(first.abv, 10);
          });
        case SORT_BY_RATING.value:
          return Array.from<Product>(storeProducts.value).sort((first, second) => {
            return (second.untappdRatingScore || 0) - (first.untappdRatingScore || 0);
          });
        case SORT_BY_TYPE.value:
          return Array.from<Product>(storeProducts.value).sort((first, second) => {
            return first.type.localeCompare(second.type);
          });
        case SORT_BY_COUNTRY.value:
          return Array.from<Product>(storeProducts.value).sort((first, second) => {
            return first.country.localeCompare(second.country);
          });
        default:
          return storeProducts.value;
      }
    });

    const onClickBack = () => {
      router.push({
        name: 'store-search'
      });
    };

    return {
      isLoading,
      store,
      sortedProducts,
      sortOptions,
      selectedSort,
      onClickBack
    };
  }
});
</script>
