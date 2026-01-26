<script setup lang="ts">
import { ref, onMounted, type Component } from "vue";
import type { Category } from "@/models/entities/Category";
import type { LayoutItem } from "@/models/entities/LayoutItem";
import { useCategoryStore } from "@/stores/categoryStore";

// Import dei componenti atomici
import CategoryTable from "@/components/CategoryTable.vue";
import CategoryForm from "@/components/CategoryForm.vue";
import CategoryStats from "@/components/CategoryStats.vue";
import Header from "@/components/Header.vue";
import _GridContainer from "@/components/GridContainer.vue";

import { Lock, Edit3 } from "lucide-vue-next";

// VARIABILI
const categoryStore = useCategoryStore();
const selectedCategory = ref<Category | null>(null);
const isEditModalOpen = ref(false);
const editingCategory = ref<Category | null>(null);
const isSaving = ref(false);
const GridContainer = _GridContainer as any;


// Mappa dei componenti - chiave: ID componente
const componentMap: Record<string, Component> = {
  form: CategoryForm,
  table: CategoryTable,
  stats: CategoryStats
};

const layout = ref<LayoutItem[]>([
  { i: "form", x: 0, y: 0, w: 12, h: 6, minW: 8,maxW: 12,minH: 3,maxH: 3,static: false},
  { i: "table", x: 0, y: 6, w: 12, h: 10, minW: 4,maxW: 12,minH: 6,maxH: 12,static: false},
  { i: "stats", x: 0, y: 6, w: 12, h: 4,minW: 10,maxW: 12,minH: 9,maxH: 12,static: false},
]);

const draggable = ref(true);
const resizable = ref(true);
const editMode = ref(true); // Stato per la modalità di modifica del layout

// --- FUNZIONI
// Funzione per ottenere il componente dalla mappa
const getComponent = (itemId: string): Component | undefined => {
  return componentMap[itemId];
};

onMounted(() => {
  categoryStore.fetchCategories();
});

// Toggle modalità modifica
const toggleEditMode = () => {
  editMode.value = !editMode.value;
};
</script>

<template>
  <main class="max-w-5xl mx-auto p-6">
    <header><Header /></header>

    <div class="flex justify-end mr-3 mb-4">
      <button @click="editMode = !editMode" class="btn-style-config">
        <span>{{ editMode ? 'Blocca Layout' : 'Modifica Layout' }}</span>
      </button>
    </div>

    <!-- <div class="flex justify-end mr-3">
      <button @click="toggleEditMode" :class="[
        'flex items-center px-2 py-2 rounded-xl text-sm font-medium transition-all',
        !editMode
          ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
          : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-sm'
      ]">
        <Lock v-if="!editMode" :size="18" class="mr-2" />
        <Edit3 v-else :size="18" class="mr-2" />
        <span>{{ editMode ? 'Modifica Layout' : 'Blocca Layout' }}</span>
      </button>
    </div>
 -->
    <GridContainer 
  v-model:layout="layout" 
  :is-editable="editMode"
>
  <template #default="{ item }: any">
    <component
      v-if="item && item.i"
      :is="getComponent(item.i)"
      class="w-full h-full p-4"
    />
  </template>
</GridContainer>
  </main>
</template>