<script setup lang="ts">
/**
 * CATEGORY FORM COMPONENT
 * Gestisce l'inserimento e la modifica delle categorie.
 */
import { ref, watch } from "vue";
import { Plus, Pencil, RotateCcw } from "lucide-vue-next";
import { useCategoryStore } from "@/stores/categoryStore";
import type { CategoryVO } from "@/models/vo/CategoryVO";

const props = defineProps<{
  editData?: CategoryVO | null;
}>();

const emit = defineEmits(["success", "cancel"]);

// VARIABILI
const categoryStore = useCategoryStore();
const isEditing = ref(false);
const showErrors = ref(false);

// --- STATO DEL FORM ---
const formData = ref({
  id: "",
  descrizione: "",
  codice: "",
  budget: 0,
  colore: "#4f46e5",
});

// --- FUNZIONI ---
const generateRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const resetForm = () => {
  isEditing.value = false;
  showErrors.value = false;
  formData.value = {
    id: "",
    descrizione: "",
    codice: categoryStore.nextAvailableCode, // Codice suggerito dallo store
    budget: 0,
    colore: generateRandomColor(),
  };
  emit("cancel");
};

const handleSave = async () => {
  showErrors.value = true;

  if (!formData.value.descrizione.trim()) return;

  try {
    if (isEditing.value) {
      await categoryStore.updateCategory(formData.value as CategoryVO);
    } else {
      await categoryStore.addCategory({
        descrizione: formData.value.descrizione,
        budget: formData.value.budget,
        colore: formData.value.colore,
      });
    }
    resetForm();
    emit("success");
  } catch (error: any) {
    alert(error.message || "Errore durante il salvataggio");
  }
};

// Reazione al click "Modifica" dalla tabella esterna
watch(
  () => props.editData,
  (newVal) => {
    if (newVal) {
      isEditing.value = true;
      formData.value = { ...newVal };
    } else {
      resetForm();
    }
  },
  { immediate: true },
);
</script>

<template>
  <section class="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-6 transition-all">
    <h2 class="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
      <component :is="isEditing ? Pencil : Plus" :class="isEditing ? 'text-amber-500' : 'text-indigo-600'" :size="18" />
      {{ isEditing ? "Modifica Categoria" : "Nuova Categoria" }}
    </h2>

    <div class="flex flex-col md:flex-row gap-4 items-end">
      <div class="flex-1 w-full relative">
        <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Descrizione</label>
        <input v-model="formData.descrizione" type="text" placeholder="Es. Casa, Spese, Hobby..."
          class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
          :class="{
            'border-red-400': showErrors && !formData.descrizione.trim(),
          }" />
      </div>

      <div class="w-full md:w-40">
        <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Budget</label>
        <input v-model.number="formData.budget" type="number" placeholder="0"
          class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm" />
      </div>
      <div class="w-full md:w-44">
        <div class="flex justify-between items-center mb-1 ml-1">
          <label class="block text-xs font-bold text-gray-400 uppercase">Colore</label>

          <button @click="formData.colore = generateRandomColor()" type="button"
            class="text-[10px] text-indigo-600 hover:underline flex items-center gap-1 font-bold mt-0.5 transition-colors">
            <RotateCcw :size="10" stroke-width="3" />
            Cambia colore
          </button>
        </div>
        <div class="flex items-center gap-2 p-1.5 bg-gray-50 border border-gray-200 rounded-xl h-11.5">
          <input v-model="formData.colore" type="color" class="w-10 h-full bg-transparent border-none cursor-pointer" />
          <span class="text-xs font-mono font-bold text-gray-500 flex-1 text-center">{{ formData.colore.toUpperCase()
          }}</span>
        </div>
      </div>

      <div class="flex gap-2 w-full md:w-auto">
        <button @click="handleSave" :class="isEditing
          ? 'bg-amber-500 hover:bg-amber-600'
          : 'bg-indigo-600 hover:bg-indigo-700'
          "
          class="text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 flex-1 md:flex-none">
          {{ isEditing ? "Salva" : "Aggiungi" }}
        </button>

        <button v-if="isEditing" @click="resetForm"
          class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-3 rounded-xl font-bold transition-all">
          X
        </button>
      </div>
    </div>
  </section>
</template>
