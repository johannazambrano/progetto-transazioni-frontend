<script setup lang="ts">
import { Calendar, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-vue-next";
import { useExpenseStore } from "../stores/expenseStore";
import AppPagination from "@/components/AppPagination.vue";

const store = useExpenseStore();

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(value);
};
</script>

<template>
    <section
      class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 transition-all"
      :class="{ 'animate-shake border-red-200': isShakingSearch }"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider">
          Ricerca Avanzata
        </h3>
        <button
          @click="resetFilters"
          class="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
        >
          <X :size="14" />
          RESET FILTRI
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="space-y-1">
          <label class="text-xs font-semibold text-gray-500 ml-1"
            >Descrizione</label
          >
          <input
            v-model="filters.title"
            @input="applyFilters"
            type="text"
            placeholder="E.g. Spesa Esselunga"
            class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs font-semibold text-gray-500 ml-1"
            >Categoria</label
          >
          <select
            v-model="filters.category"
            @change="applyFilters"
            class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="">Tutte le categorie</option>
            <option
              v-for="cat in categoryStore.categories"
              :key="cat.id"
              :value="cat.descrizione"
            >
              {{ cat.descrizione }}
            </option>
          </select>
        </div>

        <div class="space-y-1 relative">
          <label class="text-xs font-semibold text-gray-500 ml-1">Dal</label>
          <input
            v-model="filters.startDate"
            @change="applyFilters"
            type="date"
            class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            :class="{ 'border-red-400': filters.startDate && !filters.endDate }"
          />
          <p
            v-if="filters.startDate && !filters.endDate"
            class="text-[10px] text-red-500 mt-0.5 absolute left-1"
          >
            Seleziona anche la fine
          </p>
        </div>

        <div class="space-y-1 relative">
          <label class="text-xs font-semibold text-gray-500 ml-1">Al</label>
          <input
            v-model="filters.endDate"
            @change="applyFilters"
            type="date"
            class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            :class="{
              'border-red-400':
                (filters.endDate && !filters.startDate) ||
                (filters.startDate &&
                  filters.endDate &&
                  new Date(filters.endDate) < new Date(filters.startDate)),
            }"
          />
          <p
            v-if="filters.endDate && !filters.startDate"
            class="text-[10px] text-red-500 mt-0.5 absolute left-1"
          >
            Seleziona anche l'inizio
          </p>
          <p
            v-if="
              filters.startDate &&
              filters.endDate &&
              new Date(filters.endDate) < new Date(filters.startDate)
            "
            class="text-[10px] text-red-500 mt-0.5 absolute left-1"
          >
            La fine deve essere successiva all'inizio
          </p>
        </div>
      </div>
    </section>
</template>