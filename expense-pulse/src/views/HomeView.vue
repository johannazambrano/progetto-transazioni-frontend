<script setup lang="ts">
import { ref, onMounted, type Component } from "vue";
import { RouterLink } from "vue-router";
import { useExpenseStore } from "../stores/expenseStore";
import { useCategoryStore } from "../stores/categoryStore";
import { House, Layers } from "lucide-vue-next";
import BalanceCards from "@/components/BalanceCards.vue";
import ExpenseChart from "@/components/ExpenseChart.vue";
import TimeChart from "@/components/TimeChart.vue";
import TransactionForm from "@/components/TransactionForm.vue";
import ResearchTable from "@/components/ResearchTable.vue";
import TransactionHistory from "@/components/TransactionHistory.vue";
import { GridLayout, GridItem } from "vue3-grid-layout-next";

// --- STORE ---
const store = useExpenseStore();
const categoryStore = useCategoryStore();

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
}

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

// Layout senza riferimenti ai componenti
const layout = ref<LayoutItem[]>([
  {i: "balance",x: 0,y: 0,w: 12,h: 3,minW: 8,maxW: 12,minH: 3,maxH: 3,static: false},
  {i: "expenseChart",x: 0,y: 4,w: 6,h: 9,minW: 4,maxW: 12,minH: 6,maxH: 12,static: false},
  {i: "timeChart",x: 6,y: 4,w: 6,h: 9,minW: 5,maxW: 12,minH: 9,maxH: 12,static: false},
  {i: "transactionForm",x: 0,y: 12,w: 12,h: 5,minW: 8,maxW: 12,minH: 5,maxH: 5,static: false},
  {i: "researchTable",x: 0,y: 18,w: 12,h: 4,minW: 8,maxW: 12,minH: 3,maxH: 8,static: false},
  {i: "transactionHistory",x: 0,y: 22,w: 12,h: 8,minW: 6,maxW: 12,minH: 4,maxH: 15,static: false},
]);

const draggable = ref(true);
const resizable = ref(true);
const editMode = ref(true); // Stato per la modalità di modifica del layout


// --- FUNZIONI
// Funzione per ottenere il componente dalla mappa
const getComponent = (itemId: string): Component | undefined => {
  return componentMap[itemId];
};

onMounted(async () => {
  store.fetchTransactions();
  await categoryStore.fetchCategories();
});

// Optional smooth scroll to top when component mounts
window.scrollTo({ top: 0, behavior: "smooth" });

// Toggle modalità modifica
const toggleEditMode = () => {
  editMode.value = !editMode.value;
};
</script>

<template>
  <main class="max-w-5xl mx-auto p-6">
    <header class="mb-10 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">ExpensePulse</h1>
        <p class="text-gray-500">Monitora le tue finanze in tempo reale</p>
      </div>
     <div class="flex gap-2">
        <RouterLink to="/home"
          class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all">
          <House :size="18" />
          Home
        </RouterLink>
        <RouterLink to="/categories"
          class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all">
          <Layers :size="18" />
          Gestione Categorie
        </RouterLink>
      </div>
    </header>

    <button
      @click="toggleEditMode"
      :class="[
        'flex items-center px-2 py-2 rounded-xl text-sm font-medium transition-all',
        !editMode 
          ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' 
          : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-sm'
      ]"
    >
      <Edit3 v-if="!editMode" :size="18" />
      <Lock v-else :size="18" />
      <span>{{ editMode ? 'Modifica Layout' : 'Blocca Layout' }}</span>
    </button>
    <grid-layout
      v-model:layout="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="!editMode"
      :is-resizable="!editMode"
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
        :class="editMode ? '' : 'rounded-lg shadow-sm border border-gray-200 overflow-hidden fit-content'"
      >
        <component
          :is="getComponent(item.i)"
          class="w-full h-full p-4"
        />
      </grid-item>
    </grid-layout>

  </main>
</template>
<style scoped>
</style>