<template>
  <div class="flex items-start my-4 px-2 sm:px-4 select-none">
    <i class="mi-sort mt-1 mr-3 icon-base text-gray-700" />
    <ul class="flex flex-grow flex-row flex-wrap">
      <template v-for="option of options" :key="option">
        <li
          v-if="modelValue.id === option.id"
          class="flex mb-2 mr-2 bg-gray-700 text-white rounded-full py-1 px-3 text-sm font-medium"
        >
          <span>{{ option.label }}</span>
        </li>
        <li
          v-else
          class="
            flex
            mb-2
            mr-2
            bg-gray-200
            text-gray-700
            rounded-full
            py-1
            px-3
            text-sm
            font-medium
            cursor-pointer
            hover:bg-gray-300
            transition-colors
          "
          @click="onSelect(option)"
        >
          <span>{{ option.label }}</span>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export interface SortOption {
  id: string;
  label: string;
}

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<SortOption>,
      required: true
    },
    options: {
      type: Array as PropType<SortOption[]>,
      required: true
    }
  },
  emits: ['update:modelValue'],
  setup(_props, { emit }) {
    const onSelect = (value: SortOption) => {
      emit('update:modelValue', value);
    };

    return { onSelect };
  }
});
</script>
