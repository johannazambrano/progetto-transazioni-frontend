<script setup lang="ts">
import { ref, onMounted, type Component } from "vue";
import type { LayoutItem } from "@/models/entities/LayoutItem";
import { useCategoryStore } from "@/stores/categoryStore";

// Import dei componenti atomici
import CategoryTable from "@/components/CategoryTable.vue";
import CategoryForm from "@/components/CategoryForm.vue";
import CategoryStats from "@/components/CategoryStats.vue";
import Header from "@/components/Header.vue";
import _GridContainer from "@/components/GridContainer.vue";

import { Lock, Edit3, RotateCcw } from "lucide-vue-next";
import { DEFAULT_LAYOUT_CATEGORIES, LAYOUT_STORAGE_KEY } from "@/constants/app.constants";

// VARIABILI
const categoryStore = useCategoryStore();
const GridContainer = _GridContainer as any;

// Mappa dei componenti - chiave: ID componente
const componentMap: Record<string, Component> = {
  form: CategoryForm,
  table: CategoryTable,
  stats: CategoryStats,
};

const layout = ref<LayoutItem[]>([]);


const editMode = ref(false); // Stato per la modalità di modifica del layout

// --- FUNZIONI
// Funzione per ottenere il componente dalla mappa
const getComponent = (itemId: string): Component | undefined => {
  return componentMap[itemId];
};

onMounted(() => {
  // Carica il layout salvato
  layout.value = loadLayout();

  // Carica i dati degli store
  categoryStore.fetchCategories();
});

/**
 * Carica il layout salvato da localStorage
 * Se non esiste, restituisce il layout di default
 */
const loadLayout = (): LayoutItem[] => {
  try {
    const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY);
    
    if (savedLayout) {
      const parsed = JSON.parse(savedLayout) as LayoutItem[];
      
      // Validazione: assicurati che tutti gli elementi richiesti esistano
      const requiredIds = DEFAULT_LAYOUT_CATEGORIES.map(item => item.i);
      const savedIds = parsed.map(item => item.i);
      const allIdsPresent = requiredIds.every(id => savedIds.includes(id));
      
      if (allIdsPresent && parsed.length === DEFAULT_LAYOUT_CATEGORIES.length) {
        console.log("✅ Layout caricato da localStorage");
        return parsed;
      } else {
        console.warn("⚠️ Layout salvato incompleto, uso quello di default");
        return [...DEFAULT_LAYOUT_CATEGORIES];
      }
    }
  } catch (error) {
    console.error("❌ Errore nel caricamento del layout:", error);
  }
  
  console.log("📋 Uso layout di default");
  return [...DEFAULT_LAYOUT_CATEGORIES];
};

/**
 * Salva il layout corrente in localStorage
 */
const saveLayout = (layoutToSave: LayoutItem[]) => {
  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layoutToSave));
    console.log("💾 Layout salvato");
  } catch (error) {
    console.error("❌ Errore nel salvataggio del layout:", error);
  }
};


const toggleEditMode = () => {
  // Se stiamo uscendo dalla modalità edit, salva il layout
  if (!editMode.value) {
    saveLayout(layout.value);
    console.log("🔒 Layout bloccato e salvato");
  }
  
  editMode.value = !editMode.value;
};

/**
 * Resetta il layout al default
 */
const resetLayout = () => {
  if (confirm("Vuoi ripristinare il layout predefinito? Le modifiche andranno perse.")) {
    layout.value = [...DEFAULT_LAYOUT_CATEGORIES];
    // saveLayout(layout.value);
    console.log("🔄 Layout resettato");
  }
};
</script>

<template>
  <main class="max-w-5xl mx-auto p-6">
    <header><Header /></header>

    <div class="flex justify-end mr-3 mb-4">
      <button v-if="editMode" @click="resetLayout"
        class="flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all bg-red-400 border border-gray-200 text-white hover:border-red-400 hover:bg-red-600 hover:shadow-sm"
        title="Ripristina layout predefinito">
        <RotateCcw :size="18" class="mr-2" />
        <span>Reset</span>
      </button>
      <button
        @click="toggleEditMode"
        :class="[
          'flex items-center px-2 py-2 rounded-xl text-sm font-medium transition-all',
          !editMode
            ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
            : 'bg-green-400 border border-gray-200 text-white hover:border-green-600 hover:bg-green-600 hover:text-white hover:shadow-sm',
        ]"
      >
        <Lock v-if="editMode" :size="18" class="mr-2" />
        <Edit3 v-else :size="18" class="mr-2" />
        <span>{{ editMode ? "Blocca Layout" : "Modifica Layout" }}</span>
      </button>
    </div>
    <GridContainer 
      v-model:layout="layout" 
      :is-editable="editMode"
      >
      <template #default="{ item }: any">
        <component
          v-if="item && item.i"
          :is="getComponent(item.i)"
          :class="!editMode ? '' : 'rounded-2xl shadow-sm border dashed border-indigo-500/30 overflow-hidden fit-content'"
        />
      </template>
    </GridContainer>
  </main>
</template>
<style scoped>
/* Placeholder durante il drag */
:deep(.vue-grid-item.vue-grid-placeholder) {
  background: #e0e7ff;
  opacity: 0.3;
  border-radius: 8px;
  border: 2px dashed #6366f1;
}

:deep(.vue-grid-item.resizing) {
  opacity: 0.9;
  z-index: 3;
}
</style>
