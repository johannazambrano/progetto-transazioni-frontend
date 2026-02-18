<script setup lang="ts">
import { ref, onMounted, type Component, computed } from "vue";
import { useExpenseStore } from "../stores/expenseStore";
import { useCategoryStore } from "../stores/categoryStore";
import { Lock, Edit3, RotateCcw } from "lucide-vue-next";
import BalanceCards from "@/components/BalanceCards.vue";
import ExpenseChart from "@/components/ExpenseChart.vue";
import TimeChart from "@/components/TimeChart.vue";
import TransactionForm from "@/components/TransactionForm.vue";
import ResearchTable from "@/components/ResearchTable.vue";
import TransactionHistory from "@/components/TransactionHistory.vue";
import Header from "@/components/Header.vue";
import type { LayoutItemVO } from "@/models/vo/LayoutItemVO";
import { DEFAULT_LAYOUT_HOME, LAYOUT_STORAGE_KEY } from "@/constants/app.constants";
import _GridContainer from "@/components/GridContainer.vue";
import { useLayoutStore } from "@/stores/layoutStore";

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
    // Carica il layout dal backend
    await layoutStore.fetchLayout('default');

    // Carica i dati degli store
    store.fetchTransactions();
    await categoryStore.fetchCategories();
  } catch (error) {
    console.error("[HomeView.onMounted] ❌ Errore nel caricamento del layout:", error);
  }


  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Optional smooth scroll to top when component mounts
window.scrollTo({ top: 0, behavior: "smooth" });

// --- FUNZIONI DI PERSISTENZA ---

/**
 * Carica il layout salvato da localStorage
 * Se non esiste, restituisce il layout di default
 */
const loadLayout = (): LayoutItemVO[] => {
  try {
    const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY);

    if (savedLayout) {
      const parsed = JSON.parse(savedLayout) as LayoutItemVO[];

      // Validazione: assicurati che tutti gli elementi richiesti esistano
      const requiredIds = DEFAULT_LAYOUT_HOME.map(item => item.i);
      const savedIds = parsed.map(item => item.i);
      const allIdsPresent = requiredIds.every(id => savedIds.includes(id));

      if (allIdsPresent && parsed.length === DEFAULT_LAYOUT_HOME.length) {
        console.log("[HomeView.loadLayout] ✅ Layout caricato da localStorage");
        return parsed;
      } else {
        console.warn("[HomeView.loadLayout] ⚠️ Layout salvato incompleto, uso quello di default");
        return [...DEFAULT_LAYOUT_HOME];
      }
    }
  } catch (error) {
    console.error("[HomeView.loadLayout] ❌ Errore nel caricamento del layout:", error);
  }

  console.log("[HomeView.loadLayout] 📋 Uso layout di default");
  return [...DEFAULT_LAYOUT_HOME];
};

/**
 * Salva il layout corrente in localStorage
 */
const saveLayout = (layoutToSave: LayoutItemVO[]) => {
  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layoutToSave));
    console.log("[HomeView.saveLayout] 💾 Layout salvato");
  } catch (error) {
    console.error("[HomeView.saveLayout] ❌ Errore nel salvataggio del layout:", error);
  }
};

/**
 * Resetta il layout al default
 */
const resetLayout = async () => {
  if (confirm("Vuoi ripristinare il layout predefinito? Le modifiche andranno perse.")) {
    try {
      await layoutStore.resetLayout();
      console.log("[HomeView.resetLayout] 🔄 Layout resettato");
    } catch (error) {
      console.error("[HomeView.resetLayout] ❌ Errore nel reset del layout");
    }
  }
};

/**
 * Handler per l'evento di aggiornamento del layout
 * Viene chiamato quando l'utente trascina o ridimensiona un elemento
 */
const handleLayoutUpdated = async (newLayout: LayoutItemVO[]) => {

  layoutStore.updateLayoutItems(newLayout);

  // Salva automaticamente solo se non in edit mode (cioè quando l'utente ha finito di modificare)
  if (!editMode.value) {
    await layoutStore.saveLayout();
  }
};

const toggleEditMode = async () => {
  // Se stiamo uscendo dalla modalità edit (quindi editMode è true), salva il layout
  if (editMode.value) {
    await layoutStore.saveLayout();
    console.log("[HomeView.toggleEditMode] 🔒 Layout bloccato e salvato");
  }

  editMode.value = !editMode.value;
};
</script>

<template>
  <main class="mx-auto p-6">
    <header>
      <!-- <Header /> -->
      <div 
        v-if="layoutStore.isUsingFallback" 
        class="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm"
      >
        ⚠️ Modalità sviluppo: usando layout locale
      </div>
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
    
    <GridContainer v-model:layout="layout" :is-editable="editMode">
      <template #default="{ item }: any">
        <component v-if="item && item.i" :is="getComponent(item.i)"
          :class="!editMode ? '' : 'rounded-2xl shadow-sm border dashed border-indigo-500/30 overflow-hidden fit-content'" />
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
  padding-bottom: 120px; /* ⬅️ Aggiungi spazio per il footer */
}
</style>