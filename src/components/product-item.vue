<template>
  <li
    class="group py-3 px-2 hover:bg-gray-100 transition-colors cursor-pointer list-none"
    @click="$emit('select')"
  >
    <div class="flex flex-row items-center">
      <img class="flex-shrink-0 object-contain w-12 h-12 mr-4" :src="product.imageUrl" />
      <div class="flex flex-col justify-center truncate flex-grow mr-4">
        <a class="hover:underline" :href="product.productUrl" target="_blank">
          <p class="font-semibold truncate" :title="product.name">{{ product.name }}</p></a
        >
        <div class="text-sm text-gray-800 truncate" :title="product.producer">
          {{ product.producer }}
        </div>
        <div class="flex items-center text-xs text-gray-500 font-medium truncate">
          <span class="text-base mr-1">%</span>
          <span>{{ product.abv }}</span>
          <span class="material-icons text-base ml-2 mr-1">label</span>
          <span>{{ product.type }}</span>
          <span class="invisible md:visible material-icons text-base ml-2 mr-1">room</span>
          <span class="invisible md:visible">{{ product.country }}</span>
          <span class="invisible md:visible material-icons text-base ml-2 mr-1">shopping_cart</span>
          <span class="invisible md:visible">{{ product.size }} L</span>
        </div>
      </div>
      <div
        class="flex flex-shrink-0 items-stretch justify-items-stretch w-14 h-14 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors"
      >
        <a
          v-if="product.untappdRatingScore != null"
          :href="untappdUrl"
          target="_blank"
          class="flex items-center justify-center rounded-full flex-grow text-lg font-semibold text-opacity-90 text-gray-800 border-2 border-transparent hover:border-gray-500 transition-colors"
          >{{ ratingScoreString }}</a
        >
        <span
          v-else
          class="flex items-center justify-center flex-grow text-2xl text-center align-middle text-gray-300"
          >{{ '-' }}</span
        >
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';

import { Product } from '../clients/api';

export default defineComponent({
  name: 'ProductItem',
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    }
  },
  emits: ['select'],
  setup(props) {
    const ratingScoreString = computed(() => {
      return props.product.untappdRatingScore?.toLocaleString('FI-fi', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    });

    const untappdUrl = computed(() => {
      return `https://untappd.com/b/${props.product.untappdBeerSlug}/${props.product.untappdBeerId}`;
    });

    return { ratingScoreString, untappdUrl };
  }
});
</script>
