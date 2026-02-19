<script setup lang="ts">
/**
 * CATEGORY STATS COMPONENT
 * Mostra statistiche aggregate sulle categorie
 */
import { computed } from "vue";
import { useCategoryStore } from "@/stores/categoryStore";
import { Layers, TrendingUp, Wallet } from "lucide-vue-next";

// --- STORE ---
const categoryStore = useCategoryStore();

// --- COMPUTED ---
const totalCategories = computed(() => categoryStore.categories.length);

const totalBudget = computed(() => {
  return categoryStore.categories.reduce((sum, cat) => sum + cat.budget, 0);
});

const averageBudget = computed(() => {
  if (totalCategories.value === 0) return 0;
  return totalBudget.value / totalCategories.value;
});

// --- FUNZIONI ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-32 p-2">
    <!-- Totale Categorie -->
    <div
      class="bg-linear-to-br from-indigo-500 to-indigo-600 p-4 rounded-2xl shadow-lg flex flex-col justify-center text-white"
    >
      <div class="flex items-center justify-between mb-1">
        <span class="text-indigo-100 text-xs font-bold uppercase">
          Categorie
        </span>
        <Layers class="text-indigo-200" :size="18" />
      </div>
      <p class="text-3xl font-bold">{{ totalCategories }}</p>
    </div>

    <!-- Budget Totale -->
    <div
      class="bg-linear-to-br from-emerald-500 to-emerald-600 p-4 rounded-2xl shadow-lg flex flex-col justify-center text-white"
    >
      <div class="flex items-center justify-between mb-1">
        <span class="text-emerald-100 text-xs font-bold uppercase">
          Budget Totale
        </span>
        <Wallet class="text-emerald-200" :size="18" />
      </div>
      <p class="text-2xl font-bold">{{ formatCurrency(totalBudget) }}</p>
    </div>

    <!-- Budget Medio -->
    <div
      class="bg-linear-to-br from-amber-500 to-amber-600 p-4 rounded-2xl shadow-lg flex flex-col justify-center text-white"
    >
      <div class="flex items-center justify-between mb-1">
        <span class="text-amber-100 text-xs font-bold uppercase">
          Budget Medio
        </span>
        <TrendingUp class="text-amber-200" :size="18" />
      </div>
      <p class="text-2xl font-bold">{{ formatCurrency(averageBudget) }}</p>
    </div>
  </div>
</template>
