<script setup lang="ts">
import { Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-vue-next";
import { useExpenseStore } from "../stores/expenseStore";

const store = useExpenseStore();

// Formattazione Euro (Best Practice: spostare in un utility file se usato spesso)
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-full p-2">
    <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
      <div class="flex items-center justify-between mb-1">
        <span class="text-gray-500 text-xs font-bold uppercase">Saldo Totale</span>
        <Wallet class="text-indigo-600" :size="18" />
      </div>
      <p class="text-2xl font-bold" :class="store.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'">
        {{ formatCurrency(store.totalBalance) }}
      </p>
    </div>

    <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
      <div class="flex items-center justify-between mb-1">
        <span class="text-emerald-600 text-xs font-bold uppercase">Entrate</span>
        <ArrowUpCircle class="text-emerald-600" :size="18" />
      </div>
      <p class="text-2xl font-bold text-emerald-600">{{ formatCurrency(store.totalIncomes) }}</p>
    </div>

    <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-center">
      <div class="flex items-center justify-between mb-1">
        <span class="text-rose-600 text-xs font-bold uppercase">Uscite</span>
        <ArrowDownCircle class="text-rose-600" :size="18" />
      </div>
      <p class="text-2xl font-bold text-rose-600">{{ formatCurrency(Math.abs(store.totalExpenses)) }}</p>
    </div>
  </div>
</template>