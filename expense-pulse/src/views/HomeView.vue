<script setup lang="ts">
import { ref, computed } from "vue";
import { Pencil, X } from "lucide-vue-next";
import { useExpenseStore } from "../stores/expenseStore";
import { useCategoryStore } from "../stores/categoryStore";
import type { Transaction } from "../models/entities/Transaction";
import { categoryService } from "@/services/categoryService";
import { onMounted } from "vue";
import ExpenseChart from "@/components/ExpenseChart.vue";
import AppPagination from "@/components/AppPagination.vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  Trash2,
  Calendar,
} from "lucide-vue-next";

const store = useExpenseStore();
const categoryStore = useCategoryStore();

// --- DEFINIZIONE TIPO LOCALE PER IL FORM ---
// Usiamo string per category perché la <select> lavora con valori testuali
interface TransactionForm {
  title: string;
  amount: number;
  category: string;
  date: string;
}

// Ora TypeScript non darà più errore perché 'category' è dichiarata come string
const newTransaction = ref<TransactionForm>({
  title: "",
  amount: 0,
  category: "Altro",
  date: new Date().toISOString().split("T")[0] as string,
});

onMounted(async () => {
  store.fetchTransactions();
  //testCreaCategoria();
  await categoryStore.fetchCategories();
  categoryStore.nextAvailableCode;
  console.log("STEP 1: OnMounted -> chiamo ", categoryStore.nextAvailableCode);
});

// Variabile per capire se siamo in modalità modifica
const isEditing = ref(false);
const editingId = ref<string | null>(null);

// Funzione per caricare i dati nel form
const startEdit = (transaction: Transaction) => {
  isEditing.value = true;
  editingId.value = transaction.id;
  // Quando carichiamo i dati per la modifica, estraiamo la descrizione (stringa) dall'oggetto
  newTransaction.value = {
    title: transaction.title,
    amount: transaction.amount,
    category: transaction.category.descrizione,
    date: transaction.date,
  };
};

//scroll automatico verso il form
window.scrollTo({ top: 0, behavior: "smooth" });

// Funzione per annullare la modifica
const cancelEdit = () => {
  isEditing.value = false;
  editingId.value = null;
  newTransaction.value = {
    title: "",
    amount: 0,
    category: "Altro",
    date: new Date().toISOString().split("T")[0] as string,
  };
};

// Variabile per capire se il modale è attivo o no
const isCategoryModalOpen = ref(false);
const newCat = ref({ descrizione: "", codice: "" });

const openCategoryModal = () => {
  console.log("Entro qui 2");
  // Si imposta automaticamente il codice restituito dallo store
  newCat.value.codice = categoryStore.nextAvailableCode;
  console.log("category codice:", categoryStore.nextAvailableCode);
  newCat.value.descrizione = "";
  isCategoryModalOpen.value = true;
};

const saveCategory = async () => {
  // Validazione: controlla che la descrizione non sia vuota
  if (!newCat.value.descrizione.trim()) return;

  try {
    // Passiamo solo la stringa della descrizione allo store
    await categoryStore.addCategory(newCat.value.descrizione);

    // Reset e chiusura
    isCategoryModalOpen.value = false;
    newCat.value.descrizione = "";
    alert("Categoria creata con successo");
  } catch (e: any) {
    console.error(e);
    // e.message in questo punto conterrà "La categoria $categoria esiste già" lanciato dallo store
    alert(e.message || "Errore durante il salvataggio della categoria.");
  }
};

// Funzione per testare
const testCreaCategoria = async () => {
  try {
    const nuovaCategoria = {
      descrizione: "Spesa cibo",
      codice: "003",
    };

    console.log("Invio dati a Quarkus...");
    const res = await categoryService.create(nuovaCategoria);

    if (res.status === 201) {
      alert("Successo! Quarkus ha creato la categoria.");
      console.log("Location header:", res.headers.location);
    }
  } catch (error) {
    console.error("Errore nel test:", error);
    alert("Errore! Controlla la console e i log di Quarkus.");
  }
};

// --- AZIONI ---
const handleSave = async () => {
  // 1. Validazione
  if (!newTransaction.value.title.trim() || newTransaction.value.amount === 0) {
    alert("Per favore, inserisci una descrizione e un importo (diverso da 0)");
    return;
  }

  // 2. Recupero dell'oggetto categoria completo dallo store
  const selectedCategoryObj = categoryStore.categories.find(
    (cat) => cat.descrizione === newTransaction.value.category
  );

  if (!selectedCategoryObj) {
    alert("Per favore, seleziona una categoria valida");
    return;
  }

  try {
    // 2. Prepariamo i dati nel formato Entity (con l'oggetto categoria)
    const transactionData = {
      title: newTransaction.value.title,
      amount: newTransaction.value.amount,
      date: newTransaction.value.date,
      category: selectedCategoryObj, // Qui passiamo l'oggetto {id, descrizione, codice}
    };

    // 2. Logica Unica: o Modifica o Aggiunta
    if (isEditing.value && editingId.value) {
      // Caso modifica: usiamo l'editingId esistente
      await store.updateTransaction({
        ...transactionData,
        id: editingId.value,
      } as Transaction);
    } else {
      // Caso nuova operazione: Non generiamo un nuovo ID: lo store userà il Mapper per inviare un DTO pulito.
      // Quarkus riceverà solo title, amount, category e date.
      await store.addTransaction(transactionData);
    }

    // 3. Reset del form (usiamo la funzione cancelEdit che hai già per pulire tutto)
    cancelEdit();
  } catch (error) {
    console.error("Errore durante il salvataggio della transazione:", error);
    alert("Si è verificato un errore durante il salvataggio.");
  }
};

// Formattazione Euro
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
};

const confirmDelete = async (transaction: Transaction) => {
  // Messaggio di conferma dinamico
  const message = `Sei sicuro di voler eliminare "${
    transaction.title
  }" di €${transaction.amount.toFixed(2)}?`;

  if (window.confirm(message)) {
    try {
      await store.deleteTransaction(transaction.id);
      // Opzionale: feedback di successo
      console.log("Transazione eliminata");
    } catch (error) {
      alert("Non è stato possibile eliminare la transazione.");
    }
  }
};

const handlePageChange = async (newPage: number) => {
  await store.fetchTransactions({
    title: filters.value.title,
    category: filters.value.category,
    paginazione: {
      numeroPagina: newPage,
      numeroElementiPerPagina: 10
    }
  });
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Stato per i filtri
const filters = ref({
  title: "",
  category: "",
});

// Funzione per applicare i filtri
const applyFilters = async () => {
  // Passiamo l'intero oggetto filters. Lo store si occuperà di pulire le stringhe vuote.
  await store.fetchTransactions({
    title: filters.value.title,
    category: filters.value.category,
    paginazione: {
      numeroPagina: 0,
      numeroElementiPerPagina: 10
    }
  });
};

// Reset dei filtri
const resetFilters = async () => {
  filters.value = { title: "", category: "" };
  await store.fetchTransactions();
};
</script>

<template>
  <main class="max-w-5xl mx-auto p-6">
    <header class="mb-10">
      <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
        ExpensePulse
      </h1>
      <p class="text-gray-500">Monitora le tue finanze in tempo reale</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <span class="text-gray-500 text-sm font-semibold uppercase"
            >Saldo Totale</span
          >
          <Wallet class="text-indigo-600" :size="20" />
        </div>
        <p
          class="text-3xl font-bold transition-colors duration-300"
          :class="store.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'"
        >
          {{ formatCurrency(store.totalBalance) }}
        </p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <span
            class="text-gray-500 text-sm font-semibold uppercase text-emerald-600"
            >Entrate</span
          >
          <ArrowUpCircle class="text-emerald-600" :size="20" />
        </div>
        <p class="text-3xl font-bold text-emerald-600">
          {{ formatCurrency(store.totalIncomes) }}
        </p>
      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div class="flex items-center justify-between mb-2">
          <span
            class="text-gray-500 text-sm font-semibold uppercase text-rose-600"
            >Uscite</span
          >
          <ArrowDownCircle class="text-rose-600" :size="20" />
        </div>
        <p class="text-3xl font-bold text-rose-600">
          {{ formatCurrency(Math.abs(store.totalExpenses)) }}
        </p>
      </div>
    </div>
    <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 class="text-lg font-bold mb-4 text-gray-800">Distribuzione Spese</h3>
      <div class="mb-10">
        <ExpenseChart />
      </div>
    </div>

    <section
      class="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-10 transition-all"
    >
      <h2 class="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
        <component
          :is="isEditing ? Pencil : Plus"
          :class="isEditing ? 'text-amber-500' : 'text-indigo-600'"
          :size="18"
        />
        {{ isEditing ? "Modifica Operazione" : "Nuova Operazione" }}
      </h2>
      <div class="flex flex-col md:flex-row gap-4 items-end">
        <div class="flex-1 w-full">
          <label
            class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1"
            >Descrizione</label
          >
          <input
            v-model="newTransaction.title"
            type="text"
            placeholder="Es. Affitto o Stipendio"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div class="w-full md:w-32">
          <label
            class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1"
            >Importo</label
          >
          <input
            v-model.number="newTransaction.amount"
            type="number"
            placeholder="0.00"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
        <div class="w-full md:w-44">
          <div class="flex justify-between items-center mb-1 ml-1">
            <label class="block text-xs font-bold text-gray-400 uppercase"
              >Categoria</label
            >
            <button
              @click="openCategoryModal"
              class="text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <Plus :size="14" stroke-width="3" />
            </button>
          </div>
          <select
            v-model="newTransaction.category"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option disabled value="">Seleziona...</option>
            <option v-if="categoryStore.categories.length === 0" disabled>
              Caricamento categorie...
            </option>
            <option
              v-for="cat in categoryStore.categories"
              :key="cat.id || cat.codice"
              :value="cat.descrizione"
            >
              {{ cat.descrizione }}
            </option>
          </select>
        </div>
        <div class="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <button
            @click="handleSave"
            :class="[
              isEditing
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-indigo-600 hover:bg-indigo-700',
            ]"
            class="text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            {{ isEditing ? "Salva Modifiche" : "Aggiungi" }}
          </button>

          <button
            v-if="isEditing"
            @click="cancelEdit"
            class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-xl font-bold transition-all"
          >
            Annulla
          </button>
        </div>
      </div>
      <p class="text-[10px] text-gray-400 mt-3">
        * Usa il segno meno (es. -50) per registrare una spesa.
      </p>
    </section>
    <section
      class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6"
    >
      <div class="flex flex-col md:flex-row gap-4 items-center">
        <div class="flex-1 w-full">
          <input
            v-model="filters.title"
            @input="applyFilters"
            type="text"
            placeholder="Cerca per descrizione..."
            class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div class="w-full md:w-48">
          <select
            v-model="filters.category"
            @change="applyFilters"
            class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
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

        <button
          @click="resetFilters"
          class="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          Reset
        </button>
      </div>
    </section>
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
  </main>

  <div
    v-if="isCategoryModalOpen"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
  >
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-bold text-gray-900">Nuova Categoria</h3>
        <button
          @click="isCategoryModalOpen = false"
          class="text-gray-400 hover:text-gray-600"
        >
          <X :size="24" />
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase mb-1"
            >Codice (Auto-generato)</label
          >
          <input
            v-model="newCat.codice"
            type="text"
            readonly
            class="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
          />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase mb-1"
            >Nome Categoria</label
          >
          <input
            v-model="newCat.descrizione"
            type="text"
            placeholder="Es. Palestra"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      <div class="mt-8 flex gap-3">
        <button
          @click="isCategoryModalOpen = false"
          class="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
        >
          Annulla
        </button>
        <button
          @click="saveCategory"
          class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200"
        >
          Salva
        </button>
      </div>
    </div>
  </div>
</template>
