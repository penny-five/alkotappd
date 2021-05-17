<template>
  <input
    v-bind="$attrs"
    class="
      w-full
      py-2
      px-4
      border-2
      rounded-md
      border-gray-300
      focus:border-gray-800
      transition-colors
    "
    type="text"
    :value="modelValue"
    @input="onChange($event)"
  />
</template>

<script lang="ts">
import debounce from 'lodash.debounce';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SearchInput',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue'],
  setup(_props, { emit }) {
    const onChange = debounce((event: Event) => {
      emit('update:modelValue', (event.target as HTMLInputElement).value);
    }, 1000);

    return { onChange };
  }
});
</script>
