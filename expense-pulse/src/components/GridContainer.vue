<script setup>
import { computed } from 'vue';
import { GridLayout, GridItem } from "vue3-grid-layout-next";

// Definiamo le Props per la massima riutilizzabilità
const props = defineProps({
  layout: { type: Array, required: true },
  isEditable: { type: Boolean, default: false },
  colNum: { type: Number, default: 12 },
  rowHeight: { type: Number, default: 30 }
});

const emit = defineEmits(['update:layout']);

// Sincronizzazione bidirezionale del layout (Best Practice Vue 3)
const internalLayout = computed({
  get: () => props.layout,
  set: (val) => emit('update:layout', val)
});
</script>

<template>
  <grid-layout
    v-model:layout="internalLayout"
    :col-num="colNum"
    :row-height="rowHeight"
    :is-draggable="isEditable"
    :is-resizable="isEditable"
    :vertical-compact="true"
    :margin="[10, 10]"
    :use-css-transforms="true"
  >
    <grid-item
      v-for="item in internalLayout"
      :key="item.i"
      v-bind="item" 
      :static="item.static"
      :class="!isEditable ? 'rounded-2xl shadow-sm border dashed border-indigo-500/30 overflow-hidden' : ''"
    >
      <slot :item="item"></slot>
    </grid-item>
  </grid-layout>
</template>

