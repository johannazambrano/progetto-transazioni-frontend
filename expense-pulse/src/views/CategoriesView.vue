<script setup lang="ts">
import { ref, onMounted, type Component, computed } from "vue";
import type { LayoutItemVO } from "@/models/vo/LayoutItemVO";
import { useCategoryStore } from "@/stores/categoryStore";
import CategoryTable from "@/components/CategoryTable.vue";
import CategoryForm from "@/components/CategoryForm.vue";
import CategoryStats from "@/components/CategoryStats.vue";
import _GridContainer from "@/components/GridContainer.vue";
import { Lock, Edit3, RotateCcw } from "lucide-vue-next";
import { DEFAULT_LAYOUT_CATEGORIES } from "@/constants/app.constants";
import { useLayoutStore } from "@/stores/layoutStore";

const componentName = "CategoriesView"; // nome del componente usato per associazione al suo layout specifico

// --- STORE ---
const categoryStore = useCategoryStore();
const layoutStore = useLayoutStore();

// --- VARIABILI ---
const GridContainer = _GridContainer as any;
const editMode = ref(false);

// Mappa dei componenti - chiave: ID componente
const componentMap: Record<string, Component> = {
  form: CategoryForm,
  table: CategoryTable,
  stats: CategoryStats,
};

// --- COMPUTED ---
const layout = computed({
  get: () => layoutStore.layoutItems,
  set: (newLayout) => layoutStore.updateLayoutItems(newLayout)
});


// --- FUNZIONI ---
// Funzione per ottenere il componente dalla mappa
const getComponent = (itemId: string): Component | undefined => {
  return componentMap[itemId];
};

onMounted(async () => {
  try {
    await layoutStore.fetchLayout(componentName, false);
    console.log("[CategoriesView.onMounted] ✅ Layout caricato");
  } catch (error) {
    console.warn("[CategoriesView.onMounted] ⚠️ Errore nel caricamento del layout, uso quello di default: ", DEFAULT_LAYOUT_CATEGORIES);
    await layoutStore.fetchLayout(DEFAULT_LAYOUT_CATEGORIES, true);
  }

  categoryStore.fetchCategories();
});

/**
 * Carica il layout salvato da localStorage
 * Se non esiste, restituisce il layout di default
 */
// const loadLayout = (): LayoutItemVO[] => {
//   try {
//     const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY);

//     if (savedLayout) {
//       const parsed = JSON.parse(savedLayout) as LayoutItemVO[];

//       // Validazione: assicurati che tutti gli elementi richiesti esistano
//       const requiredIds = DEFAULT_LAYOUT_CATEGORIES.map(item => item.i);
//       const savedIds = parsed.map(item => item.i);
//       const allIdsPresent = requiredIds.every(id => savedIds.includes(id));

//       if (allIdsPresent && parsed.length === DEFAULT_LAYOUT_CATEGORIES.length) {
//         console.log("[CategoriesView.loadLayout] ✅ Layout caricato da localStorage");
//         return parsed;
//       } else {
//         console.warn("[CategoriesView.loadLayout] ⚠️ Layout salvato incompleto, uso quello di default");
//         return [...DEFAULT_LAYOUT_CATEGORIES];
//       }
//     }
//   } catch (error) {
//     console.error("[CategoriesView.loadLayout] ❌ Errore nel caricamento del layout:", error);
//   }

//   console.log("[CategoriesView.loadLayout] 📋 Uso layout di default");
//   return [...DEFAULT_LAYOUT_CATEGORIES];
// };

/**
 * Salva il layout corrente in localStorage
 */
// const saveLayout = (layoutToSave: LayoutItemVO[]) => {
//   try {
//     localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layoutToSave));
//     console.log("[CategoriesView.saveLayout] 💾 Layout salvato");
//   } catch (error) {
//     console.error("[CategoriesView.saveLayout] ❌ Errore nel salvataggio del layout:", error);
//   }
// };


const toggleEditMode = async () => {
  // Se stiamo uscendo dalla modalità edit, salva il layout
  // if (
  //   editMode.value && 
  //   !layoutStore.currentLayout?.isDefault && 
  //   layoutStore.currentLayout !== null
  // ) {
  //   await layoutStore.saveLayout(layoutStore.currentLayout);
  //   console.log("[CategoriesView.toggleEditMode] 🔒 Layout bloccato e salvato");
  // }
  if (editMode.value && layoutStore.currentLayout !== null) {
    if (layoutStore.currentLayout.isDefault) {
      layoutStore.currentLayout = {
        ...layoutStore.currentLayout,
        id: undefined,
        layoutName: componentName,
        isDefault: false,
      };
      console.log("[CategoriesView.toggleEditMode] 🔀 Clonato layout default → personalizzato");
      await layoutStore.saveLayout(layoutStore.currentLayout);
      console.log("[CategoriesView.toggleEditMode] 🔒 Layout bloccato e salvato");
    }
  }

  editMode.value = !editMode.value;
};

/**
 * Resetta il layout al default
 */
const resetLayout = async () => {
  if (confirm("Vuoi ripristinare il layout predefinito? Le modifiche andranno perse.")) {
    await layoutStore.fetchLayout(DEFAULT_LAYOUT_CATEGORIES, true);
    console.log("[CategoriesView.resetLayout] 🔄 Layout resettato");
  }
};

// HomeView.vue o CategoriesView.vue
const handleLayoutChange = async (newItems: LayoutItemVO[]) => {
  if (!layoutStore.currentLayout) return;

  // Se è il layout di default, dobbiamo creare un "clone" personalizzato
  if (layoutStore.currentLayout.isDefault) {

    console.debug(`[CategoriesView.handleLayoutChange] layoutStore.currentLayout: ${JSON.stringify(newItems)}`)
    layoutStore.updateLayoutItems(newItems);
    // layoutStore.currentLayout = {
    //   ...layoutStore.currentLayout,
    //   id: undefined, // Il backend genererà il nuovo ID
    //   layoutName: componentName,
    //   isDefault: false,
    //   layoutItems: [...newItems] // Nuove posizioni
    // };

    // console.debug(`[CategoriesView.handleLayoutChange] layoutStore.currentLayout: ${JSON.stringify(layoutStore.currentLayout)}`)

    // const newLayoutRequest = {
    //   name: componentName, // "HomeView" o "CategoriesView"
    //   isDefault: false,
    //   layoutItems: newItems,
    //   // ... altri campi necessari al tuo DTO
    // };

    console.log(`[CategoriesView.handleLayoutChange] Rilevata modifica al default in ${componentName}. Generazione nuovo layout...`);

    // Chiamata allo store per il POST
    // await layoutStore.saveNewLayout(newLayoutRequest);
  } else {
    // Se non è default, aggiorni semplicemente quello esistente
    // layoutStore.updateLayoutItems(newItems);
    // Opzionale: chiamata PUT automatica o salvataggio al "Lock"
  }
};
</script>

<template>
  <main class="mx-auto p-6">
    <header>
      <!-- <Header /> -->
    </header>

    <div class="flex justify-end mr-3 mb-4">
      <button v-if="editMode" @click="resetLayout"
        class="flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all bg-red-400 border border-gray-200 text-white hover:border-red-400 hover:bg-red-600 hover:shadow-sm"
        title="Ripristina layout predefinito">
        <RotateCcw :size="18" class="mr-2" />
        <span>Reset</span>
      </button>
      <button @click="toggleEditMode" :class="[
        'flex items-center px-2 py-2 rounded-xl text-sm font-medium transition-all',
        !editMode
          ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
          : 'bg-green-400 border border-gray-200 text-white hover:border-green-600 hover:bg-green-600 hover:text-white hover:shadow-sm',
      ]">
        <Lock v-if="editMode" :size="18" class="mr-2" />
        <Edit3 v-else :size="18" class="mr-2" />
        <span>{{ editMode ? "Blocca Layout" : "Modifica Layout" }}</span>
      </button>
    </div>
    <GridContainer 
      v-model:layout="layout" 
      :is-editable="editMode" 
      @layout-changed="handleLayoutChange">
      <template #default="{ item }: any">
        <component v-if="item && item.i" :is="getComponent(item.i)"
          :class="!editMode ? '' : 'rounded-2xl shadow-sm border border-dashed border-indigo-500/30 overflow-hidden fit-content'" />
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
