<template>
  <div>
    <loading-indicator v-if="isLoading">Ladataan myymälän tietoja...</loading-indicator>
    <template v-else-if="store != null">
      <div class="my-4">
        <back-button @click="onClickBack">Takaisin hakuun</back-button>
      </div>
      <store-item :store="store" :is-link="false" />
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

interface ProductSortOption extends SortOption {
  sort(products: Product[]): Product[];
}

const SORT_BY_ABV: ProductSortOption = {
  id: 'abv',
  label: 'ABV',
  sort: products =>
    [...products].sort((first, second) => {
      return parseInt(second.abv, 10) - parseInt(first.abv, 10);
    })
};

const SORT_BY_NAME: ProductSortOption = {
  id: 'name',
  label: 'Nimi (A-Z)',
  sort: products => products
};

const SORT_BY_RATING: ProductSortOption = {
  id: 'rating',
  label: 'Rating',
  sort: products =>
    [...products].sort((first, second) => {
      return (second.untappdRatingScore || 0) - (first.untappdRatingScore || 0);
    })
};

const SORT_BY_TYPE: ProductSortOption = {
  id: 'type',
  label: 'Oluttyyppi',
  sort: products =>
    [...products].sort((first, second) => {
      return first.type.localeCompare(second.type);
    })
};

const SORT_BY_COUNTRY: ProductSortOption = {
  id: 'country',
  label: 'Valmistusmaa',
  sort: products =>
    [...products].sort((first, second) => {
      return first.country.localeCompare(second.country);
    })
};

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

    const sortOptions: ProductSortOption[] = [
      SORT_BY_NAME,
      SORT_BY_ABV,
      SORT_BY_RATING,
      SORT_BY_TYPE,
      SORT_BY_COUNTRY
    ];

    const selectedSort = ref<ProductSortOption>(SORT_BY_NAME);

    const sortedProducts = computed<Product[]>(() => {
      return sortOptions
        .find(option => option.id === selectedSort.value.id)!
        .sort(storeProducts.value);
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
