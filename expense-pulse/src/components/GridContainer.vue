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

const emit = defineEmits(['update:layout', 'layout-changed']);

// Sincronizzazione bidirezionale del layout (Best Practice Vue 3)
const internalLayout = computed({
  get: () => props.layout,
  set: (val) => emit('update:layout', val)
});

const onLayoutUpdated = (newLayout) => {
  // Emettiamo un evento specifico per il monitoraggio
  emit('layout-changed', newLayout);
};
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
    @layout-updated="onLayoutUpdated"
  >
    <grid-item
      v-for="item in internalLayout"
      :key="item.i"
      v-bind="item" 
      :static="item.static"
      :class="isEditable ? 'rounded-2xl shadow-sm border dashed border-indigo-500/30 overflow-hidden' : ''"
    >
      <slot :item="item"></slot>
    </grid-item>
  </grid-layout>
</template>

<style scoped>
/* 
FUNZIONAMENTO:
Su dispositivi touch, il browser di default "consuma" certi gesti (scroll, zoom) prima che arrivino a JavaScript. Con touch-action: none dici al browser "lascia passare tutti i touch event a JS senza interpretarli", permettendo a interact.js di gestirli correttamente per il drag/resize.
*/
:deep(.vue-grid-item) {
  touch-action: none;
}
</style>