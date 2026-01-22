<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useExpenseStore } from "../stores/expenseStore";
import { useCategoryStore } from "../stores/categoryStore";
import { categoryService } from "@/services/categoryService";
import { onMounted } from "vue";
import ExpenseChart from "@/components/ExpenseChart.vue";
import TimeChart from "@/components/TimeChart.vue";

import {
  Layers
} from "lucide-vue-next";
import BalanceCards from "@/components/BalanceCards.vue";
import TransactionForm from "@/components/TransactionForm.vue";
import ResearchTable from "@/components/ResearchTable.vue";
import TransactionHistory from "@/components/TransactionHistory.vue";
import type { Transaction } from "@/models/entities/Transaction";

// --- STORE ---
const store = useExpenseStore();
const categoryStore = useCategoryStore();

// --- VARIABILI ---
interface TransactionForm {
  title: string;
  amount: number;
  category: string;
  date: string;
}

const transactionToEdit = ref<Transaction | null>(null);

// --- FUNZIONI ---
onMounted(async () => {
  store.fetchTransactions();
  await categoryStore.fetchCategories();
  categoryStore.nextAvailableCode;
});

//scroll automatico verso il form
window.scrollTo({ top: 0, behavior: "smooth" });
</script>

<template>
  <main class="max-w-5xl mx-auto p-6">
    <header class="mb-10">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
          ExpensePulse
        </h1>
        <p class="text-gray-500">Monitora le tue finanze in tempo reale</p>
      </div>

      <RouterLink to="/categories"
        class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all">
        <Layers :size="18" />
        Gestione Categorie
      </RouterLink>
    </header>
    <BalanceCards />
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      <ExpenseChart />
      <TimeChart />
    </div>
    <TransactionForm 
    :edit-data="transactionToEdit"
    @success="transactionToEdit = null" 
    @cancel="transactionToEdit = null"
    />
    <ResearchTable />
    <TransactionHistory />
  </main>
</template>
