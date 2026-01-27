<script setup lang="ts">
import { ref, onMounted, type Component } from "vue";
import { useExpenseStore } from "../stores/expenseStore";
import { useCategoryStore } from "../stores/categoryStore";
import { Lock, Edit3, RotateCcw } from "lucide-vue-next";
import BalanceCards from "@/components/BalanceCards.vue";
import ExpenseChart from "@/components/ExpenseChart.vue";
import TimeChart from "@/components/TimeChart.vue";
import TransactionForm from "@/components/TransactionForm.vue";
import ResearchTable from "@/components/ResearchTable.vue";
import TransactionHistory from "@/components/TransactionHistory.vue";
import { GridLayout, GridItem } from "vue3-grid-layout-next";
import Header from "@/components/Header.vue";
import type { LayoutItem } from "@/models/entities/LayoutItem";
import { DEFAULT_LAYOUT_HOME, LAYOUT_STORAGE_KEY } from "@/constants/app.constants";
import _GridContainer from "@/components/GridContainer.vue";

// --- STORE ---
const store = useExpenseStore();
const categoryStore = useCategoryStore();

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
const layout = ref<LayoutItem[]>([]);


// --- FUNZIONI
// Funzione per ottenere il componente dalla mappa
const getComponent = (itemId: string): Component | undefined => {
  return componentMap[itemId];
};

onMounted(async () => {
  // Carica il layout salvato
  layout.value = loadLayout();
  
  // Carica i dati degli store
  store.fetchTransactions();
  await categoryStore.fetchCategories();
  
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
const loadLayout = (): LayoutItem[] => {
  try {
    const savedLayout = localStorage.getItem(LAYOUT_STORAGE_KEY);
    
    if (savedLayout) {
      const parsed = JSON.parse(savedLayout) as LayoutItem[];
      
      // Validazione: assicurati che tutti gli elementi richiesti esistano
      const requiredIds = DEFAULT_LAYOUT_HOME.map(item => item.i);
      const savedIds = parsed.map(item => item.i);
      const allIdsPresent = requiredIds.every(id => savedIds.includes(id));
      
      if (allIdsPresent && parsed.length === DEFAULT_LAYOUT_HOME.length) {
        console.log("✅ Layout caricato da localStorage");
        return parsed;
      } else {
        console.warn("⚠️ Layout salvato incompleto, uso quello di default");
        return [...DEFAULT_LAYOUT_HOME];
      }
    }
  } catch (error) {
    console.error("❌ Errore nel caricamento del layout:", error);
  }
  
  console.log("📋 Uso layout di default");
  return [...DEFAULT_LAYOUT_HOME];
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

/**
 * Resetta il layout al default
 */
const resetLayout = () => {
  if (confirm("Vuoi ripristinare il layout predefinito? Le modifiche andranno perse.")) {
    layout.value = [...DEFAULT_LAYOUT_HOME];
    // saveLayout(layout.value);
    console.log("🔄 Layout resettato");
  }
};

/**
 * Handler per l'evento di aggiornamento del layout
 * Viene chiamato quando l'utente trascina o ridimensiona un elemento
 */
const handleLayoutUpdated = (newLayout: LayoutItem[]) => {
  // Salva automaticamente solo se non in edit mode (cioè quando l'utente ha finito di modificare)
  if (!editMode.value) {
    saveLayout(newLayout);
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
</script>

<template>
  <main class="max-w-5xl mx-auto p-6">
    <header>
      <Header />
    </header>

    <div class="flex justify-end mr-3">
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
          : 'bg-green-400 border border-gray-200 text-white hover:bg-green-600 hover:shadow-sm'
      ]">
        <Lock v-if="editMode" :size="18" class="mr-2" />
        <Edit3 v-else :size="18" class="mr-2" />
        <span>{{ editMode ? 'Blocca Layout' : 'Modifica Layout' }}</span>
      </button>
    </div>
   <GridContainer 
    v-model:layout="layout" 
    :is-editable="editMode"
    >
      <template #default="{ item }: any">
        <component v-if="item && item.i" :is="getComponent(item.i)"
          :class="!editMode ? '' : 'rounded-2xl shadow-sm border dashed border-indigo-500/30 overflow-hidden fit-content'" />
      </template>
    </GridContainer>
    <!-- <grid-layout
      v-model:layout="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="editMode"
      :is-resizable="editMode"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="item in layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :min-w="item.minW"
        :max-w="item.maxW"
        :min-h="item.minH"
        :max-h="item.maxH"
        :static="item.static"
        :class="!editMode ? '' : 'rounded-2xl shadow-sm border dashed border-indigo-500/30 overflow-hidden fit-content'"
      >
        <component
          :is="getComponent(item.i)"
          class="w-full h-full p-4"
        />
      </grid-item>
    </grid-layout> -->

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