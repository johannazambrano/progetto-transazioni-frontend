<script setup lang="ts">
import { ref, onMounted } from "vue";
import { RouterLink } from "vue-router";
import { useExpenseStore } from "../stores/expenseStore";
import { useCategoryStore } from "../stores/categoryStore";
import { Layers } from "lucide-vue-next";
import type { Transaction } from "@/models/entities/Transaction";

// Components
import BalanceCards from "@/components/BalanceCards.vue";
import ExpenseChart from "@/components/ExpenseChart.vue";
import TimeChart from "@/components/TimeChart.vue";
import TransactionForm from "@/components/TransactionForm.vue";
import ResearchTable from "@/components/ResearchTable.vue";
import TransactionHistory from "@/components/TransactionHistory.vue";

// Grid layout library
import { GridLayout, GridItem } from "vue3-grid-layout-next";

// Store instances
const store = useExpenseStore();
const categoryStore = useCategoryStore();

// Reactive edit data for the form
const transactionToEdit = ref<Transaction | null>(null);

// Grid layout definition – 12 columns grid, responsive heights
const layout = ref([
  // Top full‑width cards
  { i: "balance", x: 0, y: 0, w: 12, h: 4 },
  // Charts side‑by‑side
  { i: "expenseChart", x: 0, y: 4, w: 6, h: 8 },
  { i: "timeChart", x: 6, y: 4, w: 6, h: 8 },
  // Form spanning full width
  { i: "transactionForm", x: 0, y: 14, w: 12, h: 6 },
  // Table and history stacked
  { i: "researchTable", x: 0, y: 16, w: 12, h: 4 },
  { i: "transactionHistory", x: 0, y: 28, w: 12, h: 8 },
]);

onMounted(async () => {
  store.fetchTransactions();
  await categoryStore.fetchCategories();
});

// Optional smooth scroll to top when component mounts
window.scrollTo({ top: 0, behavior: "smooth" });
</script>

<template>
  <main class="max-w-5xl mx-auto p-6">
    <header class="mb-10 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">ExpensePulse</h1>
        <p class="text-gray-500">Monitora le tue finanze in tempo reale</p>
      </div>
      <RouterLink to="/categories"
        class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all">
        <Layers :size="18" />
        Gestione Categorie
      </RouterLink>
    </header>

    <GridLayout :layout="layout" :col-num="12" :row-height="30" :is-draggable="true" :is-resizable="true"
      :margin="[10, 10]" :use-css-transforms="true" class="bg-gray-50 p-4 rounded-lg">
      <GridItem v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i">
        <component :is="item.i === 'balance' ? BalanceCards :
            item.i === 'expenseChart' ? ExpenseChart :
              item.i === 'timeChart' ? TimeChart :
                item.i === 'transactionForm' ? TransactionForm :
                  item.i === 'researchTable' ? ResearchTable :
                    item.i === 'transactionHistory' ? TransactionHistory : null
          " v-bind="item.i === 'transactionForm' ? { editData: transactionToEdit } : {}"
          @success="transactionToEdit = null" @cancel="transactionToEdit = null" />
      </GridItem>
    </GridLayout>
  </main>
</template>
