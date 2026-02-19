<script setup lang="ts">
/**
 * CATEGORY TABLE COMPONENT
 * Componente per la visualizzazione della lista delle categorie.
 * Integrato con Pinia Store e Lucide Icons.
 */

import type { CategoryVO } from "@/models/vo/CategoryVO";
import { useCategoryStore } from "@/stores/categoryStore";
import { Pencil, Trash2 } from "lucide-vue-next";

// --- STORE ---
const categoryStore = useCategoryStore();

// Eventi per comunicare con il compoenente padre
const emit = defineEmits<{
  (e: "edit", vategory: CategoryVO): void;
}>();

// Formattazione Euro
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

const confirmDelete = async (cat: CategoryVO) => {
  if (
    confirm(`Sei sicuro di voler eliminare la categoria "${cat.descrizione}"?`)
  ) {
    try {
      await categoryStore.deleteCategory(cat.id);
    } catch (error: any) {
      alert(error.message || "Errore durante l'eliminazione");
    }
  }
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-gray-50 border-b border-gray-100">
          <th class="p-4 text-xs font-bold text-gray-400 uppercase">Colore</th>
          <th class="p-4 text-xs font-bold text-gray-400 uppercase">Codice</th>
          <th class="p-4 text-xs font-bold text-gray-400 uppercase">Descrizione</th>
          <th class="p-4 text-xs font-bold text-gray-400 uppercase text-right">Budget</th>
          <th class="p-4 text-xs font-bold text-gray-400 uppercase text-center">Azioni</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr v-for="cat in categoryStore.categories" :key="cat.id" class="hover:bg-gray-50 transition-colors">
          <td class="p-4">
            <div class="w-6 h-6 rounded-full border border-gray-200" :style="{ backgroundColor: cat.colore }"></div>
          </td>
          <td class="p-4 font-mono text-sm text-gray-500">{{ cat.codice }}</td>
          <td class="p-4 font-bold text-gray-800">{{ cat.descrizione }}</td>
          <td class="p-4 text-right font-semibold text-indigo-600">{{ formatCurrency(cat.budget) }}</td>
          <td class="p-4">
            <div class="flex justify-center gap-2">
              <button @click="emit('edit', cat)" class="p-2 text-gray-400 hover:text-amber-500 transition-colors">
                <Pencil :size="18" />
              </button>
              <button @click="confirmDelete(cat)" class="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Trash2 :size="18" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
