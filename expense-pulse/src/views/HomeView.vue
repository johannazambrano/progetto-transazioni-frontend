<script setup lang="ts">
import { ref, onMounted, type Component, computed, watch } from "vue";
import { useExpenseStore } from "../stores/expenseStore";
import { useCategoryStore } from "../stores/categoryStore";
import { Lock, Edit3, RotateCcw } from "lucide-vue-next";
import BalanceCards from "@/components/BalanceCards.vue";
import ExpenseChart from "@/components/ExpenseChart.vue";
import TimeChart from "@/components/TimeChart.vue";
import TransactionForm from "@/components/TransactionForm.vue";
import ResearchTable from "@/components/ResearchTable.vue";
import TransactionHistory from "@/components/TransactionHistory.vue";
import type { LayoutItemVO } from "@/models/vo/LayoutItemVO";
import { DEFAULT_LAYOUT_HOME } from "@/constants/app.constants";
import _GridContainer from "@/components/GridContainer.vue";
import { useLayoutStore } from "@/stores/layoutStore";

const componentName = "HomeView";

// --- STORE ---
const store = useExpenseStore();
const categoryStore = useCategoryStore();
const layoutStore = useLayoutStore();

// --- VARIABILI ---
// Mappa dei componenti - chiave: ID componente
const componentMap: Record<string, Component> = {
  balance: BalanceCards,
  expenseChart: ExpenseChart,
  timeChart: TimeChart,
  transactionForm: TransactionForm,
  researchTable: ResearchTable,
  transactionHistory: TransactionHistory,
};
const GridContainer = _GridContainer as any;

const editMode = ref(false); // Stato per la modalità di modifica del layout

watch(() => layoutStore.currentLayout, (val) => {
  console.log('[DEBUG] currentLayout changed → isDefault:', val?.isDefault, '| id:', val?.id);
}, { immediate: true, deep: false });

// --- COMPUTED ---
// Il layout ora viene dallo store invece che da ref locale
const layout = computed({
  get: () => layoutStore.layoutItems,
  set: (newLayout) => layoutStore.updateLayoutItems(newLayout)
});

// --- FUNZIONI
// Funzione per ottenere il componente dalla mappa
const getComponent = (itemId: string): Component | undefined => {
  return componentMap[itemId];
};

onMounted(async () => {
  try {
    // Carica il layout dal backend specificando che è quello di default
    await layoutStore.fetchLayout(componentName, false);    
  } catch (error) {
    console.error("[HomeView.onMounted] ❌ Errore nel caricamento del layout:", error);
    await layoutStore.fetchLayout(DEFAULT_LAYOUT_HOME, true);
  }
    // Carica i dati degli store
    await store.fetchTransactions();
    await categoryStore.fetchCategories();


  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Optional smooth scroll to top when component mounts
window.scrollTo({ top: 0, behavior: "smooth" });

// --- FUNZIONI DI PERSISTENZA ---

/**
 * Resetta il layout al default
 */
const resetLayout = async () => {
  if (confirm("Vuoi ripristinare il layout predefinito? Le modifiche andranno perse.")) {
    try {
      await layoutStore.fetchLayout(DEFAULT_LAYOUT_HOME, true);
      console.log("[HomeView.resetLayout] Caricato layout di default");
      if(layoutStore.currentLayout !== null) {
        await layoutStore.deleteLayout(layoutStore.currentLayout);
      }

      console.log("[HomeView.resetLayout] 🔄 Layout resettato");
    } catch (error) {
      console.error("[HomeView.resetLayout] ❌ Errore nel reset del layout");
    }
  }
};

const toggleEditMode = async () => {
  
  if (editMode.value && layoutStore.currentLayout !== null) {
    console.debug(`[HomeView.toggleEditMode] editMode.value: ${editMode.value}`)
    if (layoutStore.currentLayout.isDefault) {
      layoutStore.currentLayout = {
        ...layoutStore.currentLayout,
        id: undefined,
        layoutName: componentName,
        isDefault: false,
      };
      console.log("[HomeView.toggleEditMode] 🔀 Clonato layout default → personalizzato");
      await layoutStore.saveLayout(layoutStore.currentLayout);
      console.log("[HomeView.toggleEditMode] 🔒 Layout bloccato e salvato");
    }

    console.debug(`[HomeView.toggleEditMode] layoutStore.currentLayout: ${JSON.stringify(layoutStore.currentLayout)}`)
    await layoutStore.updateLayout(layoutStore.currentLayout);
  }

  editMode.value = !editMode.value;
};

const handleLayoutChange = async (newItems: LayoutItemVO[]) => {
  if (!layoutStore.currentLayout) return;

  // Se è il layout di default, dobbiamo creare un "clone" personalizzato
  layoutStore.updateLayoutItems(newItems);
};
</script>

<template>
  <main class="mx-auto p-6">
    <header>
    </header>

    <div class="flex justify-end mr-3 mb-4 gap-2">
      <button v-if="editMode" @click="resetLayout"
        class="flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all bg-red-400 border border-gray-200 text-white hover:border-red-400 hover:bg-red-600 hover:shadow-sm"
        title="Ripristina layout predefinito">
        <RotateCcw :size="18" class="mr-2" />
        <span>Reset</span>
      </button>
      <button @click="toggleEditMode" :class="[
        'flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all',
        !editMode
          ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
          : 'bg-green-500 border border-gray-200 text-white hover:bg-green-600 hover:shadow-sm'
      ]">
        <Lock v-if="editMode" :size="18" class="mr-2" />
        <Edit3 v-else :size="18" class="mr-2" />
        <span>{{ editMode ? 'Salva & Blocca' : 'Modifica Layout' }}</span>
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

main {
  padding-bottom: 120px;
}
</style>