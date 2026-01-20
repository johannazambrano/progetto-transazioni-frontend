<script setup lang="ts">
import { ref } from "vue";
import { Pencil, Plus } from "lucide-vue-next";
import { useExpenseStore } from "../stores/expenseStore";
import { useCategoryStore } from "../stores/categoryStore";

const store = useExpenseStore();
const categoryStore = useCategoryStore();

// Stato interno del form (estratto da HomeView)
const newTransaction = ref({
  title: "",
  amount: 0,
  category: "Altro",
  date: new Date().toISOString().split("T")[0],
});

const isShaking = ref(false);

const handleAdd = async () => {
  if (!newTransaction.value.title.trim() || newTransaction.value.amount === 0) {
    isShaking.value = true;
    setTimeout(() => (isShaking.value = false), 400);
    return;
  }
  // Qui va la logica handleSave originale...
  console.log("Salvataggio transazione...");
};
</script>

<template>
  <!-- <section class="p-6 h-full bg-white transition-all" :class="{ 'animate-shake border-red-200': isShaking }">
    <h2 class="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
      <Plus class="text-indigo-600" :size="18" /> Nuova Operazione
    </h2>
    <div class="grid grid-cols-1 gap-4">
      <input v-model="newTransaction.title" type="text" placeholder="Descrizione" class="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
      <input v-model.number="newTransaction.amount" type="number" placeholder="Importo" class="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
      <select v-model="newTransaction.category" class="p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
        <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.descrizione">{{ cat.descrizione }}</option>
      </select>
      <button @click="handleAdd" class="bg-indigo-600 text-white p-3 rounded-xl font-bold hover:bg-indigo-700 transition-all">
        Aggiungi
      </button>
    </div>
  </section> -->
     <section
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
    </section>
</template>