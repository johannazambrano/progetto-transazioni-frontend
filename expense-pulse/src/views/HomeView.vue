<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
// import { Pencil, X } from "lucide-vue-next";
import { useExpenseStore } from "../stores/expenseStore";
import { useCategoryStore } from "../stores/categoryStore";
// import type { Transaction } from "../models/entities/Transaction";
import { categoryService } from "@/services/categoryService";
import { onMounted } from "vue";
import ExpenseChart from "@/components/ExpenseChart.vue";
import TimeChart from "@/components/TimeChart.vue";
// import AppPagination from "@/components/AppPagination.vue";
import {
  Wallet,
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  Trash2,
  Calendar,
  Settings,
  Layers
} from "lucide-vue-next";
import BalanceCards from "@/components/BalanceCards.vue";
import TransactionForm from "@/components/TransactionForm.vue";
import HistoryTable from "@/components/HistoryTable.vue";
import TransactionHistory from "@/components/TransactionHistory.vue";

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

// Variabile per attivare l'effetto shake sugli errori
// const isShakingForm = ref(false);
const isShakingSearch = ref(false);

// Funzione per attivare l'effetto shake
// Trigger per il form Nuova Operazione
// const triggerShakeForm = () => {
//   isShakingForm.value = true;
//   setTimeout(() => (isShakingForm.value = false), 400);
// };

// Trigger per la Ricerca Avanzata
// const triggerShakeSearch = () => {
//   isShakingSearch.value = true;
//   setTimeout(() => (isShakingSearch.value = false), 400);
// };

// Funzione per caricare i dati nel form
// const startEdit = (transaction: Transaction) => {
//   isEditing.value = true;
//   editingId.value = transaction.id;
//   // Quando carichiamo i dati per la modifica, estraiamo la descrizione (stringa) dall'oggetto
//   newTransaction.value = {
//     title: transaction.title,
//     amount: transaction.amount,
//     category: transaction.category.descrizione,
//     date: transaction.date,
//   };
// };

//scroll automatico verso il form
window.scrollTo({ top: 0, behavior: "smooth" });

// Funzione per annullare la modifica
// const cancelEdit = () => {
//   isEditing.value = false;
//   editingId.value = null;
//   showErrors.value = false; // Reset stato errore
//   newTransaction.value = {
//     title: "",
//     amount: 0,
//     category: "Altro",
//     date: new Date().toISOString().split("T")[0] as string,
//   };
// };

// Variabile per capire se il modale è attivo o no
// const isCategoryModalOpen = ref(false);
// const newCat = ref({
//   descrizione: "",
//   codice: "",
//   budget: 0,
//   colore: "#4f46e5", // Colore di default (Indigo)
// });

// const openCategoryModal = () => {
//   // Si imposta automaticamente il codice restituito dallo store
//   newCat.value.codice = categoryStore.nextAvailableCode;
//   console.log("category codice:", categoryStore.nextAvailableCode);
//   newCat.value.descrizione = "";
//   newCat.value.budget = 0;
//   isCategoryModalOpen.value = true;
//   // Generiamo un colore casuale
//   let randomColor = generateRandomColor();

//   // Opzionale: Controllo rapido per evitare duplicati immediati con quelli esistenti
//   const existingColors = categoryStore.categories.map((c) =>
//     c.colore.toUpperCase(),
//   );
//   while (existingColors.includes(randomColor.toUpperCase())) {
//     randomColor = generateRandomColor();
//   }

//   newCat.value.colore = randomColor;
//   isCategoryModalOpen.value = true;
// };

// const saveCategory = async () => {
//   // Validazione: controlla che la descrizione non sia vuota
//   if (!newCat.value.descrizione.trim()) {
//     // || newCat.value.budget <= 0 per gestire eventualmente il budget
//     alert("Inserisci una descrizione valida per la categoria."); // e un budget valido.
//     return;
//   }

//   // Controllo se il colore è già in uso
//   const colorExists = categoryStore.categories.some(
//     (c) => c.colore === newCat.value.colore,
//   );

//   if (colorExists) {
//     alert(
//       "Questo colore è già stato assegnato a un'altra categoria. Scegline uno diverso!",
//     );
//     return;
//   }

//   try {
//     // Passiamo solo la stringa della descrizione allo store
//     await categoryStore.addCategory({
//       descrizione: newCat.value.descrizione,
//       budget: newCat.value.budget,
//       colore: newCat.value.colore,
//     });

//     // Reset e chiusura
//     isCategoryModalOpen.value = false;
//     newCat.value = {
//       descrizione: "",
//       codice: "",
//       budget: 0,
//       colore: "#4f46e5",
//     };
//     alert("Categoria creata con successo");
//   } catch (e: any) {
//     console.error(e);
//     // e.message in questo punto conterrà "La categoria $categoria esiste già" lanciato dallo store
//     alert(e.message || "Errore durante il salvataggio della categoria.");
//   }
// };

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

const showErrors = ref(false);

// --- AZIONI ---
// const handleSave = async () => {
//   // Attiviamo la visualizzazione degli errori grafici
//   showErrors.value = true;

//   // Validazione descrizione
//   if (!newTransaction.value.title.trim()) {
//     triggerShakeForm();
//     return; // Il messaggio apparirà sotto l'input
//   }

//   // Validazione importo (ora gestita graficamente nel template)
//   if (newTransaction.value.amount === 0) {
//     triggerShakeForm();
//     return;
//   }

//   const selectedCategoryObj = categoryStore.categories.find(
//     (cat) => cat.descrizione === newTransaction.value.category,
//   );

//   if (!selectedCategoryObj) {
//     triggerShakeForm();
//     return;
//   }

//   try {
//     // 2. Prepariamo i dati nel formato Entity (con l'oggetto categoria)
//     const transactionData = {
//       title: newTransaction.value.title,
//       amount: newTransaction.value.amount,
//       date: newTransaction.value.date,
//       category: selectedCategoryObj, // Qui passiamo l'oggetto {id, descrizione, codice}
//     };

//     // 2. Logica Unica: o Modifica o Aggiunta
//     if (isEditing.value && editingId.value) {
//       // Caso modifica: usiamo l'editingId esistente
//       await store.updateTransaction({
//         ...transactionData,
//         id: editingId.value,
//       } as Transaction);
//     } else {
//       // Caso nuova operazione: Non generiamo un nuovo ID: lo store userà il Mapper per inviare un DTO pulito.
//       // Quarkus riceverà solo title, amount, category e date.
//       await store.addTransaction(transactionData);
//     }

//     // 3. // Reset degli errori e del form dopo il successo
//     showErrors.value = false;
//     cancelEdit();
//   } catch (error) {
//     console.error("Errore durante il salvataggio della transazione:", error);
//     alert("Si è verificato un errore durante il salvataggio.");
//   }
// };

// Formattazione Euro
// const formatCurrency = (value: number) => {
//   return new Intl.NumberFormat("it-IT", {
//     style: "currency",
//     currency: "EUR",
//   }).format(value);
// };

// const confirmDelete = async (transaction: Transaction) => {
//   // Messaggio di conferma dinamico
//   const message = `Sei sicuro di voler eliminare "${
//     transaction.title
//   }" di €${transaction.amount.toFixed(2)}?`;

//   if (window.confirm(message)) {
//     try {
//       await store.deleteTransaction(transaction.id);
//       // Opzionale: feedback di successo
//       console.log("Transazione eliminata");
//     } catch (error) {
//       alert("Non è stato possibile eliminare la transazione.");
//     }
//   }
// };

// const handlePageChange = async (newPage: number) => {
//   await store.fetchTransactions({
//     title: filters.value.title,
//     category: filters.value.category,
//     paginazione: {
//       numeroPagina: newPage,
//       numeroElementiPerPagina: 10,
//     },
//   });

//   window.scrollTo({ top: 0, behavior: "smooth" });
// };

// Stato per i filtri
const filters = ref({
  title: "",
  category: "",
  startDate: "",
  endDate: "",
});

// Funzione per applicare i filtri
// const applyFilters = async () => {
//   const { startDate, endDate } = filters.value;

//   // 1. Controllo Intervallo Completo: Se uno dei due è presente, serve anche l'altro
//   if ((startDate && !endDate) || (!startDate && endDate)) {
//     triggerShakeSearch();
//     return; // Usciamo silenziosamente, il messaggio apparirà nel template
//   }

//   // 2. Controllo Coerenza Date: Fine deve essere >= Inizio
//   if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
//     // Qui non facciamo nulla, lasciamo che il messaggio di errore nel template avvisi l'utente
//     triggerShakeSearch();
//     return;
//   }

//   // Passiamo l'intero oggetto filters. Lo store si occuperà di pulire le stringhe vuote.
//   await store.fetchTransactions({
//     title: filters.value.title,
//     category: filters.value.category,
//     startDate: filters.value.startDate || undefined,
//     endDate: filters.value.endDate || undefined,
//     paginazione: {
//       numeroPagina: 0,
//       numeroElementiPerPagina: 10,
//     },
//   });
// };

// Reset dei filtri
// const resetFilters = async () => {
//   filters.value = { title: "", category: "", startDate: "", endDate: "" };
//   await store.fetchTransactions();
// };

// Funzione per generare un colore HEX random
// const generateRandomColor = () => {
//   const letters = "0123456789ABCDEF";
//   let color = "#";
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// };
</script>

<template>
  <main class="max-w-5xl mx-auto p-6">
    <header class="mb-10">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">
          ExpensePulse
        </h1>
        <p class="text-gray-500">Monitora le tue finanze in tempo reale</p>
      </div>

      <RouterLink to="/categories" class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all">
        <Layers :size="18" />
        Gestione Categorie
      </RouterLink>
    </header>
    <BalanceCards/>
    <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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
    </div> -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      <ExpenseChart />
      <TimeChart />
    </div>

    <!-- <section
      class="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-10 transition-all"
      :class="{ 'animate-shake border-red-200': isShakingForm }"
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
        <div class="flex-1 w-full relative">
          <label
            class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1"
            >Descrizione</label
          >
          <input
            v-model="newTransaction.title"
            type="text"
            placeholder="Es. Affitto o Stipendio"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            :class="{
              'border-red-400': showErrors && !newTransaction.title.trim(),
            }"
          />
          <p
            v-if="showErrors && !newTransaction.title.trim()"
            class="text-[10px] text-red-500 mt-1 absolute left-1"
          >
            Campo obbligatorio
          </p>
        </div>
        <div class="w-full md:w-32 relative">
          <label
            class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1"
            >Importo</label
          >
          <input
            v-model.number="newTransaction.amount"
            type="number"
            placeholder="0.00"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            :class="{
              'border-red-400': showErrors && newTransaction.amount === 0,
            }"
          />
          <p
            v-if="showErrors && newTransaction.amount === 0"
            class="text-[10px] text-red-500 mt-1 absolute left-1"
          >
            Deve essere ≠ 0
          </p>
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
    </section> -->
    <TransactionForm />

    <!-- INIZIO RICERCA AVANZATA -->
    <!-- <section
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
    </section> -->
    <HistoryTable />
    <!-- FINE RICERCA AVANZATA -->

    <!-- INIZIO LISTA TRANSAZIONI -->
    <!-- <section
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
    </section> -->
    <TransactionHistory />
    <!-- FINE LISTA TRANSAZIONI -->
  </main>

  <!-- <div
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
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1"
              >Budget Mensile</label
            >
            <input
              v-model.number="newCat.budget"
              type="number"
              placeholder="0.00"
              class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1"
              >Colore Identificativo</label
            >
            <div class="flex items-center gap-3">
              <div class="relative group">
                <input
                  v-model="newCat.colore"
                  type="color"
                  class="w-12 h-12 p-1 bg-white border border-gray-200 rounded-xl cursor-pointer"
                />
              </div>

              <div class="flex flex-col">
                <span class="text-xs font-mono font-bold text-gray-600">{{
                  newCat.colore.toUpperCase()
                }}</span>
                <button
                  @click="newCat.colore = generateRandomColor()"
                  type="button"
                  class="text-[10px] text-indigo-600 hover:underline flex items-center gap-1"
                >
                  Cambia colore
                </button>
              </div>
            </div>
          </div>
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
  </div> -->
</template>
