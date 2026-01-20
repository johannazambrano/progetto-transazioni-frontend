<script setup lang="ts">
/**
 * TRANSACTION HISTORY COMPONENT
 * Componente per la visualizzazione e gestione della lista transazioni.
 * Integrato con Pinia Store e Lucide Icons.
 */
import { Calendar, Trash2, Pencil, ArrowUpCircle, ArrowDownCircle } from "lucide-vue-next";
import { useExpenseStore } from "@/stores/expenseStore";
import AppPagination from "@/components/AppPagination.vue";
import type { Transaction } from "@/models/entities/Transaction";

const store = useExpenseStore();

/**
 * Utility: Formattazione Valuta locale
 */
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

/**
 * Eventi: Emettiamo gli eventi al padre (HomeView) invece di gestire
 * la logica complessa qui, mantenendo il componente "Snello".
 */
const emit = defineEmits(['edit', 'delete']);

const handlePageChange = (p: number) => {
  store.fetchTransactions({
    paginazione: { numeroPagina: p, numeroElementiPerPagina: 10 }
  });
};

const startEdit = (t: Transaction) => emit('edit', t);
const confirmDelete = (t: Transaction) => emit('delete', t);
</script>

<template>
  <!-- <div class="flex flex-col h-full bg-white">
    <div class="p-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
      <h2 class="text-xl font-bold text-gray-800">Cronologia</h2>
      <span class="text-sm text-gray-500">
        {{ store.transactions.length }} operazioni
      </span>
    </div>

    <div class="flex-1 overflow-y-auto min-h-0">
      <ul v-if="store.transactions.length > 0" class="divide-y divide-gray-100">
        <li
          v-for="t in store.transactions"
          :key="t.id"
          class="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between group"
        >
          <div class="flex items-center gap-4">
            <div
              :class="[
                'p-3 rounded-2xl transition-all',
                t.amount > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-100 text-rose-500',
              ]"
            >
              <component
                :is="t.amount > 0 ? ArrowUpCircle : ArrowDownCircle"
                :size="24"
              />
            </div>
            <div>
              <p class="font-bold text-gray-900 line-clamp-1">{{ t.title }}</p>
              <p class="text-xs text-gray-400 flex items-center gap-1">
                <Calendar :size="12" /> {{ t.date }} • {{ t.category.descrizione }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span
              :class="[
                'font-black text-lg mr-4 whitespace-nowrap',
                t.amount > 0 ? 'text-emerald-600' : 'text-rose-600',
              ]"
            >
              {{ t.amount > 0 ? "+" : "" }}{{ formatCurrency(t.amount) }}
            </span>

            <div class="flex opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                @click="startEdit(t)"
                class="text-gray-300 hover:text-amber-500 transition-all p-2"
              >
                <Pencil :size="18" />
              </button>
              <button
                @click="confirmDelete(t)"
                class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 :size="18" />
              </button>
            </div>
          </div>
        </li>
      </ul>

      <div v-else class="h-full flex flex-col items-center justify-center p-10 text-center text-gray-400">
        <p>Non ci sono ancora transazioni.</p>
        <p class="text-sm">Inizia aggiungendone una!</p>
      </div>
    </div>

    <div class="p-4 border-t border-gray-100 bg-gray-50">
      <AppPagination
        :pagination="store.pagination"
        @change="handlePageChange"
      />
    </div>
  </div> -->
<section
      class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div
        class="p-6 border-b border-gray-100 flex justify-between items-center"
      >
        <h2 class="text-xl font-bold text-gray-800">Cronologia</h2>
        <span class="text-sm text-gray-500"
          >{{ store.transactions.length }} operazioni</span
        >
      </div>

      <ul class="divide-y divide-gray-100">
        <li
          v-for="t in store.transactions"
          :key="t.id"
          class="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between group"
        >
          <div class="flex items-center gap-4">
            <div
              :class="[
                'p-3 rounded-2xl transition-all',
                t.amount > 0
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-rose-100 text-rose-500',
              ]"
            >
              <component
                :is="t.amount > 0 ? ArrowUpCircle : ArrowDownCircle"
                :size="24"
              />
            </div>
            <div>
              <p class="font-bold text-gray-900">{{ t.title }}</p>
              <p class="text-xs text-gray-400 flex items-center gap-1">
                <Calendar :size="12" /> {{ t.date }} •
                {{ t.category.descrizione }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <span
              :class="[
                'font-black text-lg mr-4',
                t.amount > 0 ? 'text-emerald-600' : 'text-rose-600',
              ]"
            >
              {{ t.amount > 0 ? "+" : "" }}{{ formatCurrency(t.amount) }}
            </span>

            <button
              @click="startEdit(t)"
              class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-amber-500 transition-all p-2"
            >
              <Pencil :size="18" />
            </button>

            <button
              @click="confirmDelete(t)"
              class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Elimina transazione"
            >
              <Trash2 :size="18" />
            </button>
          </div>
        </li>
      </ul>

      <AppPagination
        :pagination="store.pagination"
        @change="handlePageChange"
      />

      <div
        v-if="store.transactions.length === 0"
        class="p-20 text-center text-gray-400"
      >
        <p>Non ci sono ancora transazioni. Inizia aggiungendone una!</p>
      </div>
    </section>
</template>



<style scoped>
/* Ottimizzazione scrollbar per un look più moderno nella dashboard */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 10px;
}
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>