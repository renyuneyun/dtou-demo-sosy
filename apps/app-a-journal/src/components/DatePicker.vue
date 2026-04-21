<script setup lang="ts">
const props = defineProps<{ dates: string[]; modelValue: string }>();
const emit = defineEmits<{ 'update:modelValue': [date: string] }>();
</script>

<template>
  <div class="flex gap-2">
    <button
      v-for="date in props.dates"
      :key="date"
      @click="emit('update:modelValue', date)"
      :class="[
        'px-4 py-2 rounded text-sm font-medium transition-colors',
        props.modelValue === date
          ? 'bg-amber-600 text-white shadow'
          : 'bg-white border border-amber-300 text-amber-700 hover:bg-amber-50',
      ]"
    >
      {{ date }}
    </button>
  </div>
</template>
