<script setup lang="ts">
import { Calendar, Trash2, Pencil, ArrowUpCircle, ArrowDownCircle } from "lucide-vue-next";
import { useExpenseStore } from "@/stores/expenseStore";
import AppPagination from "@/components/AppPagination.vue";
import type { TransactionVO } from "@/models/vo/TransactionVO";
import { ref } from "vue";
import { formatCurrency } from "@/utils/formatCurrency";

const store = useExpenseStore();

const emit = defineEmits<{
  (e: 'edit', transaction: TransactionVO): void
}>();

const handlePageChange = (p: number) => {
  store.fetchTransactions({
    paginazione: { numeroPagina: p, numeroElementiPerPagina: 10 }
  });
};

const onEditClick = (transaction: TransactionVO) => {
  emit('edit', transaction);
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

    <div class="card-content overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[600px]">
        <thead class="sticky top-0 bg-gray-50 z-10">
          <tr class="bg-gray-50 border-b border-gray-100">
            <th class="p-2 sm:p-4 text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Tipo</th>
            <th class="p-2 sm:p-4 text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Titolo</th>
            <th class="p-2 sm:p-4 text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Data</th>
            <th class="p-2 sm:p-4 text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Categoria</th>
            <th class="p-2 sm:p-4 text-[10px] sm:text-xs font-bold text-gray-400 uppercase text-right">Importo</th>
            <th class="p-2 sm:p-4 text-[10px] sm:text-xs font-bold text-gray-400 uppercase text-center">Azioni</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="t in store.transactions" :key="t.id" class="hover:bg-gray-50 transition-colors">
            <td class="p-2 sm:p-4">
              <div :class="[
                'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all shrink-0',
                t.amount > 0
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-100 text-rose-500',
              ]">
                <component :is="t.amount > 0 ? ArrowUpCircle : ArrowDownCircle" :size="20" />
              </div>
            </td>
            <td class="p-2 sm:p-4">
              <p class="font-bold text-sm sm:text-base text-gray-900">{{ t.title }}</p>
            </td>
            <td class="p-2 sm:p-4">
              <p class="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
                <Calendar :size="12" /> {{ t.date }}
              </p>
            </td>
            <td class="p-2 sm:p-4">
              <span class="inline-block px-2 py-1 rounded-md text-[10px] sm:text-xs font-medium"
                :style="{ backgroundColor: t.category.colore + '20', color: t.category.colore }">
                {{ t.category.descrizione }}
              </span>
            </td>
            <td class="p-2 sm:p-4 text-right">
              <span :class="[
                'font-black text-base sm:text-lg',
                t.amount > 0 ? 'text-emerald-600' : 'text-rose-600',
              ]">
                {{ t.amount > 0 ? "+" : "" }}{{ formatCurrency(t.amount) }}
              </span>
            </td>
            <td class="p-2 sm:p-4">
              <div class="flex justify-center gap-1 sm:gap-2">
                <button @click="onEditClick(t)"
                  class="p-1 sm:p-2 text-gray-400 hover:text-amber-500 transition-colors">
                  <Pencil :size="16" class="sm:hidden" />
                  <Pencil :size="18" class="hidden sm:inline" />
                </button>
                <button @click="confirmDelete(t)"
                  class="p-1 sm:p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 :size="16" class="sm:hidden" />
                  <Trash2 :size="18" class="hidden sm:inline" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="store.transactions.length === 0" class="p-8 sm:p-20 text-center text-gray-400">
        <p class="text-sm sm:text-base">Non ci sono ancora transazioni. Inizia aggiungendone una!</p>
      </div>
    </div>

    <footer class="card-footer">
      <AppPagination :pagination="store.pagination" @change="handlePageChange" />
    </footer>
  </div>
</template>