<script setup lang="ts">
import { ref, onMounted, type Component, computed, type DefineComponent } from "vue";
import type { LayoutItemVO } from "@/models/vo/LayoutItemVO";
import type { CategoryVO } from "@/models/vo/CategoryVO";
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

// --- EDIT STATE ---
const categoryToEdit = ref<CategoryVO | null>(null);
const showForm = ref(false);

const handleEditCategory = (category: CategoryVO) => {
  categoryToEdit.value = category;
  showForm.value = true;
};

const handleFormCancel = () => {
  categoryToEdit.value = null;
  showForm.value = false;
};

const handleFormSuccess = () => {
  categoryToEdit.value = null;
  showForm.value = false;
};

// --- VARIABILI ---
const GridContainer = _GridContainer as DefineComponent;
const editMode = ref(false);

// Mappa dei componenti - chiave: ID componente
const componentMap: Record<string, Component> = {
  form: CategoryForm,
  table: CategoryTable,
  stats: CategoryStats,
};

// --- COMPUTED ---
const layout = computed({
  get: () => layoutStore.layoutItems(componentName).value,
  set: (newLayout) => layoutStore.updateLayoutItems(componentName, newLayout)
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
    // Copia il layout nella chiave del componentName per far funzionare il computed
    if (layoutStore.currentLayout[DEFAULT_LAYOUT_CATEGORIES]) {
      layoutStore.currentLayout[componentName] = {
        ...layoutStore.currentLayout[DEFAULT_LAYOUT_CATEGORIES],
        layoutName: componentName,
        isDefault: false,
        id: undefined
      };
    }
  }

  await categoryStore.fetchCategories();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const toggleEditMode = async () => {
  if (editMode.value && layoutStore.currentLayout !== null && layoutStore.currentLayout[componentName] !== undefined) {
    if (layoutStore.currentLayout[componentName].isDefault) {
      layoutStore.currentLayout[componentName] = {
        ...layoutStore.currentLayout[componentName],
        id: undefined,
        layoutName: componentName,
        isDefault: false,
      };
      console.log("[CategoriesView.toggleEditMode] 🔀 Clonato layout default → personalizzato");
      await layoutStore.saveLayout(componentName);
      console.log("[CategoriesView.toggleEditMode] 🔒 Layout bloccato e salvato");
    } else {
      console.debug(`[CategoriesView.toggleEditMode] layoutStore.currentLayout: ${JSON.stringify(layoutStore.currentLayout[componentName])}`)
      await layoutStore.saveLayout(componentName);
    }
  }

  editMode.value = !editMode.value;
};

/**
 * Resetta il layout al default
 */
const resetLayout = async () => {
  if (confirm("Vuoi ripristinare il layout predefinito? Le modifiche andranno perse.")) {
    try {
      // 1. Verifica se esiste un layout personalizzato da eliminare
      const existingLayout = layoutStore.currentLayout[componentName];
      if (existingLayout && existingLayout.id && !existingLayout.isDefault) {
        await layoutStore.deleteLayout(existingLayout);
      }

      // 2. Carica il layout di default dal DB
      await layoutStore.fetchLayout(DEFAULT_LAYOUT_CATEGORIES, true);

      // 3. Copia il layout di default nella chiave del componentName
      // Mantiene isDefault: true (questo È il layout originale)
      if (layoutStore.currentLayout[DEFAULT_LAYOUT_CATEGORIES]) {
        layoutStore.currentLayout[componentName] = {
          ...layoutStore.currentLayout[DEFAULT_LAYOUT_CATEGORIES],
          layoutName: componentName,
          isDefault: true
        };
      }
      console.log("[CategoriesView.resetLayout] 🔄 Layout resettato");
    } catch (error) {
      console.error("[CategoriesView.resetLayout] ❌ Errore nel reset del layout");
    }
  }
};

// HomeView.vue o CategoriesView.vue
const handleLayoutChange = async (newItems: LayoutItemVO[]) => {
  if (!layoutStore.currentLayout) return;

  // Se è il layout di default, dobbiamo creare un "clone" personalizzato
  if (layoutStore.currentLayout.isDefault) {

    console.debug(`[CategoriesView.handleLayoutChange] layoutStore.currentLayout: ${JSON.stringify(newItems)}`)
    layoutStore.updateLayoutItems(componentName, newItems);

    console.log(`[CategoriesView.handleLayoutChange] Rilevata modifica al default in ${componentName}. Generazione nuovo layout...`);
  }
};
</script>

<template>
  <main class="mx-auto p-6">
    <header>
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
    <GridContainer v-model:layout="layout" :is-editable="editMode" @layout-changed="handleLayoutChange">
      <template #default="{ item }: any">
        <component v-if="item && item.i" :is="getComponent(item.i)"
          :edit-data="item.i === 'form' ? categoryToEdit : null"
          @edit="handleEditCategory"
          @success="handleFormSuccess"
          @cancel="handleFormCancel"
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
