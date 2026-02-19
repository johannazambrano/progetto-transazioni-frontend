<script setup lang="ts">
import { ref, watch } from "vue";
import { Pencil, Plus, X } from "lucide-vue-next";
import { useExpenseStore } from "../stores/expenseStore";
import { useCategoryStore } from "../stores/categoryStore";
import type { TransactionVO } from "../models/vo/TransactionVO";
import CategoryForm from "./CategoryForm.vue";

// --- VARIABILI ---
const isShakingForm = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const showErrors = ref(false);
const store = useExpenseStore();
const categoryStore = useCategoryStore();
const isCategoryModalOpen = ref(false);
const newCat = ref({
  descrizione: "",
  codice: "",
  budget: 0,
  colore: "#4f46e5", // Colore di default (Indigo)
});

// Stato interno del form
const newTransaction = ref({
  title: "",
  amount: 0,
  category: "Altro",
  date: new Date().toISOString().split("T")[0],
});
const props = defineProps<{
  editData?: TransactionVO | null
}>();
const emit = defineEmits(['success', 'cancel', 'edit']);

// Funzione per generare un colore HEX random
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const openCategoryModal = () => {
  // Si imposta automaticamente il codice restituito dallo store
  newCat.value.codice = categoryStore.nextAvailableCode;
  newCat.value.descrizione = "";
  newCat.value.budget = 0;
  isCategoryModalOpen.value = true;
  // Generiamo un colore casuale
  let randomColor = generateRandomColor();

  // Opzionale: Controllo rapido per evitare duplicati immediati con quelli esistenti
  const existingColors = categoryStore.categories.map((c) =>
    c.colore.toUpperCase(),
  );
  while (existingColors.includes(randomColor.toUpperCase())) {
    randomColor = generateRandomColor();
  }

  newCat.value.colore = randomColor;
  isCategoryModalOpen.value = true;
};

const triggerShakeForm = () => {
  isShakingForm.value = true;
  setTimeout(() => (isShakingForm.value = false), 400);
};

// Funzione per annullare la modifica
const cancelEdit = () => {
  isEditing.value = false;
  editingId.value = null;
  showErrors.value = false; // Reset stato errore
  newTransaction.value = {
    title: "",
    amount: 0,
    category: "Altro",
    date: new Date().toISOString().split("T")[0] as string,
  };
};

const handleSave = async () => {
  // Attiviamo la visualizzazione degli errori grafici
  showErrors.value = true;

  // Validazione descrizione
  if (!newTransaction.value.title.trim()) {
    triggerShakeForm();
    return; // Il messaggio apparirà sotto l'input
  }

  // Validazione importo
  if (newTransaction.value.amount === 0) {
    triggerShakeForm();
    return;
  }

  const selectedCategoryObj = categoryStore.categories.find(
    (cat) => cat.descrizione === newTransaction.value.category,
  );

  if (!selectedCategoryObj) {
    triggerShakeForm();
    return;
  }

  try {
    // 2. Prepariamo i dati nel formato Entity 
    const transactionData = {
      title: newTransaction.value.title,
      amount: newTransaction.value.amount,
      date: newTransaction.value.date!,
      category: selectedCategoryObj,
    };

    // 2. Logica Unica: o Modifica o Aggiunta
    if (isEditing.value && editingId.value) {
      // Caso modifica: usiamo l'editingId esistente
      await store.updateTransaction({
        ...transactionData,
        id: editingId.value,
      } as TransactionVO);
    } else {
      // Caso nuova operazione: Non generiamo un nuovo ID: lo store userà il Mapper per inviare un DTO pulito.
      // Quarkus riceverà solo title, amount, category e date.
      await store.addTransaction(transactionData);
    }

    // 3. // Reset degli errori e del form dopo il successo
    showErrors.value = false;
    cancelEdit();
  } catch (error) {
    console.error("[TransactionForm.handleSave] ❌ Errore durante il salvataggio della transazione:", error);
    alert("Si è verificato un errore durante il salvataggio.");
  }
};

const saveCategory = async () => {
  // Validazione: controlla che la descrizione non sia vuota
  if (!newCat.value.descrizione.trim()) {
    // || newCat.value.budget <= 0 per gestire eventualmente il budget
    alert("Inserisci una descrizione valida per la categoria."); // e un budget valido.
    return;
  }

  // Controllo se il colore è già in uso
  const colorExists = categoryStore.categories.some(
    (c) => c.colore === newCat.value.colore,
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
      descrizione: newCat.value.descrizione,
      budget: newCat.value.budget,
      colore: newCat.value.colore,
    });

    // Reset e chiusura
    isCategoryModalOpen.value = false;
    newCat.value = {
      descrizione: "",
      codice: "",
      budget: 0,
      colore: "#4f46e5",
    };
    alert("Categoria creata con successo");
  } catch (e: any) {
    console.error("[TransactionForm.saveCategory] ❌ Errore durante il salvataggio della categoria:", e);
    alert(e.message || "Errore durante il salvataggio della categoria.");
  }
};

// Osserva se cambiano i dati da modificare
watch(() => props.editData, (newData) => {
  if (newData) {
    // Creiamo un oggetto compatibile con la struttura del Form
    newTransaction.value = {
      title: newData.title,
      amount: newData.amount,
      // Estraiamo solo la descrizione o l'id perché il form usa una stringa
      category: typeof newData.category === 'object'
        ? newData.category.descrizione
        : newData.category,
      date: newData.date
    };
    // Settiamo gli stati di editing
    editingId.value = newData.id; // Salviamo l'ID per sapere cosa aggiornare dopo
    isEditing.value = true;
  } else {
    cancelEdit(); // Se editData diventa null, puliamo il form
  }
}, { deep: true });
</script>

<template>
  <div>
    <section v-if="!isCategoryModalOpen"
      class="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-10 transition-all"
      :class="{ 'animate-shake border-red-200': isShakingForm }">
      <h2 class="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
        <component :is="isEditing ? Pencil : Plus" :class="isEditing ? 'text-amber-500' : 'text-indigo-600'" :size="18" />
        {{ isEditing ? "Modifica Operazione" : "Nuova Operazione" }}
      </h2>
      <div class="flex flex-col md:flex-row gap-4 items-end">
        <div class="flex-1 w-full relative">
          <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Descrizione</label>
          <input v-model="newTransaction.title" type="text" placeholder="Es. Affitto o Stipendio"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            :class="{
              'border-red-400': showErrors && !newTransaction.title.trim(),
            }" />
          <p v-if="showErrors && !newTransaction.title.trim()" class="text-[10px] text-red-500 mt-1 absolute left-1">
            Campo obbligatorio
          </p>
        </div>
        <div class="w-full md:w-32 relative">
          <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Importo</label>
          <input v-model.number="newTransaction.amount" type="number" placeholder="0.00"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            :class="{
              'border-red-400': showErrors && newTransaction.amount === 0,
            }" />
          <p v-if="showErrors && newTransaction.amount === 0" class="text-[10px] text-red-500 mt-1 absolute left-1">
            Deve essere ≠ 0
          </p>
        </div>
        <div class="w-full md:w-44">
          <div class="flex justify-between items-center mb-1 ml-1">
            <label class="block text-xs font-bold text-gray-400 uppercase">Categoria</label>
            <button @click="isCategoryModalOpen = true" class="text-indigo-600 hover:text-indigo-800 transition-colors">
              <Plus :size="14" stroke-width="3" />
            </button>
          </div>
          <select v-model="newTransaction.category"
            class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
            <option disabled value="">Seleziona...</option>
            <option v-if="categoryStore.categories.length === 0" disabled>
              Caricamento categorie...
            </option>
            <option v-for="cat in categoryStore.categories" :key="cat.id || cat.codice" :value="cat.descrizione">
              {{ cat.descrizione }}
            </option>
          </select>
        </div>
        <div class="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <button @click="handleSave" :class="[
            isEditing
              ? 'bg-amber-500 hover:bg-amber-600'
              : 'bg-indigo-600 hover:bg-indigo-700',
          ]" class="text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
            {{ isEditing ? "Salva Modifiche" : "Aggiungi" }}
          </button>

          <button v-if="isEditing" @click="cancelEdit"
            class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-xl font-bold transition-all">
            Annulla
          </button>
        </div>
      </div>
      <p class="text-[10px] text-gray-400 mt-3">
        * Usa il segno meno (es. -50) per registrare una spesa.
      </p>
    </section>
    <div v-if="isCategoryModalOpen" class="relative">
      <div class="flex justify-end m-4">
        <button @click="isCategoryModalOpen = false"
          class="absolute top-8 right-4 z-10 bg-red-500 backdrop-blur-sm text-white hover:bg-red-600 transition-all p-2 rounded-full shadow-md"
          title="Chiudi">
          <X :size="20" />
        </button>
      </div>
      <CategoryForm />
    </div>
  </div>
</template>