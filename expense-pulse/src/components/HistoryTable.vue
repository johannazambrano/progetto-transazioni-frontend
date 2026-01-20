<script setup lang="ts">
// import { Calendar, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-vue-next";
import { useExpenseStore } from "../stores/expenseStore";
// import AppPagination from "@/components/AppPagination.vue";
import { ref } from "vue";
import { useCategoryStore } from "@/stores/categoryStore";

// --- STORE ---
const store = useExpenseStore();
const categoryStore = useCategoryStore();


// ---VARIABILI ---
const isShakingSearch = ref(false);
// Stato per i filtri
const filters = ref({
  title: "",
  category: "",
  startDate: "",
  endDate: "",
});


// --- FUNZIONI ---
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(value);
};

// Reset dei filtri
const resetFilters = async () => {
  filters.value = { title: "", category: "", startDate: "", endDate: "" };
  await store.fetchTransactions();
};

// Trigger per la Ricerca Avanzata
const triggerShakeSearch = () => {
  isShakingSearch.value = true;
  setTimeout(() => (isShakingSearch.value = false), 400);
};

// Funzione per applicare i filtri
const applyFilters = async () => {
  const { startDate, endDate } = filters.value;

  // 1. Controllo Intervallo Completo: Se uno dei due è presente, serve anche l'altro
  if ((startDate && !endDate) || (!startDate && endDate)) {
    triggerShakeSearch();
    return; // Usciamo silenziosamente, il messaggio apparirà nel template
  }

  // 2. Controllo Coerenza Date: Fine deve essere >= Inizio
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    // Qui non facciamo nulla, lasciamo che il messaggio di errore nel template avvisi l'utente
    triggerShakeSearch();
    return;
  }

  // Passiamo l'intero oggetto filters. Lo store si occuperà di pulire le stringhe vuote.
  await store.fetchTransactions({
    title: filters.value.title,
    category: filters.value.category,
    startDate: filters.value.startDate || undefined,
    endDate: filters.value.endDate || undefined,
    paginazione: {
      numeroPagina: 0,
      numeroElementiPerPagina: 10,
    },
  });
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