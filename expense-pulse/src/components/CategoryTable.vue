<script setup lang="ts">
/**
 * CATEGORY TABLE COMPONENT
 * Componente per la visualizzazione della lista delle categorie.
 * Integrato con Pinia Store e Lucide Icons.
 */

import type { CategoryVO } from "@/models/vo/CategoryVO";
import { useCategoryStore } from "@/stores/categoryStore";
import { Pencil, Trash2 } from "lucide-vue-next";
import { formatCurrency } from "@/utils/formatCurrency";

// --- STORE ---
const categoryStore = useCategoryStore();

// Eventi per comunicare con il compoenente padre
const emit = defineEmits<{
  (e: "edit", vategory: CategoryVO): void;
}>();

const confirmDelete = async (cat: CategoryVO) => {
  if (
    confirm(`Sei sicuro di voler eliminare la categoria "${cat.descrizione}"?`)
  ) {
    try {
      await categoryStore.deleteCategory(cat.id);
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : "Errore durante l'eliminazione");
    }
  }
};
</script>

<template>
  <div class="card-wrapper">
    <header class="card-header">
      <div class="p-4 sm:p-6 border-b border-gray-100">
        <h2 class="text-lg sm:text-xl font-bold text-gray-800">Categorie</h2>
      </div>
    </header>

    <div class="card-content overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[500px]">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100">
            <th class="p-2 sm:p-4 text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Colore</th>
            <th class="p-2 sm:p-4 text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Codice</th>
            <th class="p-2 sm:p-4 text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Descrizione</th>
            <th class="p-2 sm:p-4 text-[10px] sm:text-xs font-bold text-gray-400 uppercase text-right">Budget</th>
            <th class="p-2 sm:p-4 text-[10px] sm:text-xs font-bold text-gray-400 uppercase text-center">Azioni</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="cat in categoryStore.categories" :key="cat.id" class="hover:bg-gray-50 transition-colors">
            <td class="p-2 sm:p-4">
              <div class="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-200" :style="{ backgroundColor: cat.colore }"></div>
            </td>
            <td class="p-2 sm:p-4 font-mono text-[10px] sm:text-sm text-gray-500">{{ cat.codice }}</td>
            <td class="p-2 sm:p-4 font-bold text-sm sm:text-base text-gray-800">{{ cat.descrizione }}</td>
            <td class="p-2 sm:p-4 text-right font-semibold text-indigo-600 text-sm sm:text-base">{{ formatCurrency(cat.budget) }}</td>
            <td class="p-2 sm:p-4">
              <div class="flex justify-center gap-1 sm:gap-2">
                <button @click="emit('edit', cat)" class="p-1 sm:p-2 text-gray-400 hover:text-amber-500 transition-colors">
                  <Pencil :size="16" class="sm:hidden" />
                  <Pencil :size="18" class="hidden sm:inline" />
                </button>
                <button @click="confirmDelete(cat)" class="p-1 sm:p-2 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 :size="16" class="sm:hidden" />
                  <Trash2 :size="18" class="hidden sm:inline" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
