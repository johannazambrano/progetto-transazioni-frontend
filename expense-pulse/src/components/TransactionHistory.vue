<script setup lang="ts">
/**
 * TRANSACTION HISTORY COMPONENT
 * Componente per la visualizzazione e gestione della lista transazioni.
 * Integrato con Pinia Store e Lucide Icons.
 */
import { Calendar, Trash2, Pencil, ArrowUpCircle, ArrowDownCircle, X } from "lucide-vue-next";
import { useExpenseStore } from "@/stores/expenseStore";
import AppPagination from "@/components/AppPagination.vue";
import type { Transaction } from "@/models/vo/Transaction";
import { ref } from "vue";
import { useCategoryStore } from "@/stores/categoryStore";

// --- STORE ---
const store = useExpenseStore();
const categoryStore = useCategoryStore();


// --- VARIABILI ---
const isTransactionModalOpen = ref(false);
const editTransaction = ref<Transaction>();


// --- FUNZIONI ---
// Funzione per generare un colore HEX random
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Utility: Formattazione Valuta locale
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

// Eventi: Emettiamo gli eventi al padre (HomeView) invece di gestire
// la logica complessa qui, mantenendo il componente "Snello".
const emit = defineEmits(['edit', 'delete']);

const handlePageChange = (p: number) => {
  store.fetchTransactions({
    paginazione: { numeroPagina: p, numeroElementiPerPagina: 10 }
  });
};

// const startEdit = (t: Transaction) => emit('edit', t);
// const confirmDelete = (t: Transaction) => emit('delete', t);
const startEdit = (t: Transaction) => {
  isTransactionModalOpen.value = true;
  editTransaction.value = {
    id: t.id,
    title: t.title,
    amount: t.amount,
    category: t.category,
    date: t.date,
  };
}

const confirmDelete = async (t: Transaction) => {
  if (confirm(`Sei sicuro di voler eliminare ${t.title}?`)) {
    try {
      await store.deleteTransaction(t.id); // Chiamata diretta allo store
      // Lo store aggiornerà la lista e tutti i componenti (Grafici, Saldo) 
      // reagiranno automaticamente grazie alla reattività di Pinia.
    } catch (error) {
      console.error("Errore durante l'eliminazione", error);
    }
  }
};

const saveTransaction = async () => {
  // Validazione: controlla che la descrizione non sia vuota
  if (!editTransaction.value?.title.trim()) {
    // || newCat.value.budget <= 0 per gestire eventualmente il budget
    alert("Inserisci un titolo valido per la transazione."); // e un budget valido.
    return;
  }

  // Controllo se il colore è già in uso
  const colorExists = categoryStore.categories.some(
    (c) => c.colore === editTransaction.value?.category.colore,
  );

  if (colorExists) {
    alert(
      "Questo colore è già stato assegnato a un'altra categoria. Scegline uno diverso!",
    );
    return;
  }

  try {
    // Passiamo solo la stringa della descrizione allo store
    await categoryStore.addCategory({
      descrizione: editTransaction.value.category.descrizione,
      budget: editTransaction.value.category.budget,
      colore: editTransaction.value.category.colore,
    });

    // Reset e chiusura
    isTransactionModalOpen.value = false;
    editTransaction.value = {
      id: "",
      title: "",
      amount: 0,
      category: {
        id: "",
        descrizione: "",
        codice: "",
        budget: 0,
        colore: "",
      },
      date: new Date().toISOString().split("T")[0] as string,
    };
    alert("Categoria creata con successo");
  } catch (e: any) {
    console.error(e);
    // e.message in questo punto conterrà "La categoria $categoria esiste già" lanciato dallo store
    alert(e.message || "Errore durante il salvataggio della categoria.");
  }
};
</script>

<template>
  <section class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-6 border-b border-gray-100 flex justify-between items-center">
      <h2 class="text-xl font-bold text-gray-800">Cronologia</h2>
      <span class="text-sm text-gray-500">{{ store.transactions.length }} operazioni</span>
    </div>

    <ul class="divide-y divide-gray-100">
      <li v-for="t in store.transactions" :key="t.id"
        class="p-5 hover:bg-gray-50 transition-colors flex items-center justify-between group">
        <div class="flex items-center gap-4">
          <div :class="[
            'p-3 rounded-2xl transition-all',
            t.amount > 0
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-rose-100 text-rose-500',
          ]">
            <component :is="t.amount > 0 ? ArrowUpCircle : ArrowDownCircle" :size="24" />
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
          <span :class="[
            'font-black text-lg mr-4',
            t.amount > 0 ? 'text-emerald-600' : 'text-rose-600',
          ]">
            {{ t.amount > 0 ? "+" : "" }}{{ formatCurrency(t.amount) }}
          </span>

          <button @click="startEdit(t)"
            class="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-amber-500 transition-all p-2">
            <Pencil :size="18" />
          </button>

          <button @click="confirmDelete(t)"
            class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Elimina transazione">
            <Trash2 :size="18" />
          </button>
        </div>
      </li>
    </ul>

    <AppPagination :pagination="store.pagination" @change="handlePageChange" />

    <div v-if="store.transactions.length === 0" class="p-20 text-center text-gray-400">
      <p>Non ci sono ancora transazioni. Inizia aggiungendone una!</p>
    </div>
  </section>
  <div v-if="isTransactionModalOpen"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-gray-900">Modifica transazione</h3>
        <button @click="isTransactionModalOpen = false" class="text-gray-400 hover:text-gray-600">
          <X :size="24" />
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Titolo</label>
          <input v-model="editTransaction!.title" type="text" placeholder="Spesa, aperitivo, benzina, ecc"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Importo</label>
          <input v-model="editTransaction!.amount" type="number" placeholder="500.00"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1">Categoria</label>
            <input v-model="editTransaction!.category.descrizione" type="text" placeholder="Categoria"
              class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        </div>
      </div>

      <div class="mt-8 flex gap-3">
        <button @click="isTransactionModalOpen = false"
          class="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">
          Annulla
        </button>
        <button @click="saveTransaction"
          class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200">
          Salva
        </button>
      </div>
    </div>
  </div>
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
  line-clamp: 1;
}
</style>