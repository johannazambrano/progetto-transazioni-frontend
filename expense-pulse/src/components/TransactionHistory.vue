<script setup lang="ts">
import { Calendar, Trash2, Pencil, ArrowUpCircle, ArrowDownCircle } from "lucide-vue-next";
import { useExpenseStore } from "@/stores/expenseStore";
import AppPagination from "@/components/AppPagination.vue";
import type { TransactionVO } from "@/models/vo/TransactionVO";
import { ref } from "vue";
import { formatCurrency } from "@/utils/formatCurrency";

const store = useExpenseStore();

const handlePageChange = (p: number) => {
  store.fetchTransactions({
    paginazione: { numeroPagina: p, numeroElementiPerPagina: 10 }
  });
};

const startEdit = (t: TransactionVO) => {
  // emit edit event to parent for modal handling
};

const confirmDelete = async (t: TransactionVO) => {
  if (confirm(`Sei sicuro di voler eliminare ${t.title}?`)) {
    try {
      await store.deleteTransaction(t.id);
    } catch (error) {
      console.error("[TransactionHistory.confirmDelete] Errore durante l'eliminazione", error);
    }
  }
};
</script>

<template>
  <div class="card-wrapper">
    <header class="card-header">
      <div class="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-lg sm:text-xl font-bold text-gray-800">Cronologia</h2>
        <span class="text-xs sm:text-sm text-gray-500">{{ store.transactions.length }} operazioni</span>
      </div>
    </header>

    <div class="card-content">
      <ul class="divide-y divide-gray-100">
        <li v-for="t in store.transactions" :key="t.id"
          class="p-3 sm:p-5 hover:bg-gray-50 transition-colors flex items-center justify-between gap-2 group">
          <div class="flex items-center gap-2 sm:gap-4 min-w-0">
            <div :class="[
              'p-2 sm:p-3 rounded-2xl transition-all shrink-0',
              t.amount > 0
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-rose-100 text-rose-500',
            ]">
              <component :is="t.amount > 0 ? ArrowUpCircle : ArrowDownCircle" :size="20" />
            </div>
            <div class="min-w-0">
              <p class="font-bold text-sm sm:text-base text-gray-900 truncate">{{ t.title }}</p>
              <p class="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1 flex-wrap">
                <Calendar :size="10" class="sm:hidden" />
                <Calendar :size="12" class="hidden sm:inline" /> {{ t.date }}
                <span class="hidden sm:inline">•</span>
                <span class="hidden xs:inline">{{ t.category.descrizione }}</span>
                <span class="inline xs:hidden">{{ t.category.codice }}</span>
              </p>
            </div>
          </div>
          <div class="flex items-center gap-1 sm:gap-2 shrink-0">
            <span :class="[
              'font-black text-base sm:text-lg mr-1 sm:mr-4',
              t.amount > 0 ? 'text-emerald-600' : 'text-rose-600',
            ]">
              {{ t.amount > 0 ? "+" : "" }}{{ formatCurrency(t.amount) }}
            </span>

            <button @click="startEdit(t)"
              class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-amber-500 transition-all p-2">
              <Pencil :size="16" class="sm:hidden" />
              <Pencil :size="18" class="hidden sm:inline" />
            </button>

            <button @click="confirmDelete(t)"
              class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Elimina transazione">
              <Trash2 :size="16" class="sm:hidden" />
              <Trash2 :size="18" class="hidden sm:inline" />
            </button>
          </div>
        </li>
      </ul>

      <div v-if="store.transactions.length === 0" class="p-8 sm:p-20 text-center text-gray-400">
        <p class="text-sm sm:text-base">Non ci sono ancora transazioni. Inizia aggiungendone una!</p>
      </div>
    </div>

    <footer class="card-footer">
      <AppPagination :pagination="store.pagination" @change="handlePageChange" />
    </footer>
  </div>
</template>