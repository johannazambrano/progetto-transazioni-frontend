<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Category } from "@/models/entities/Category";
import { useCategoryStore } from "@/stores/categoryStore";
import { GridLayout, GridItem } from "vue3-grid-layout-next";

// Import dei componenti atomici
import CategoryTable from "@/components/CategoryTable.vue";
import CategoryForm from "@/components/CategoryForm.vue";
import Header from "@/components/Header.vue";

// VARIABILI
const categoryStore = useCategoryStore();
const selectedCategory = ref<Category | null>(null);
const isEditModalOpen = ref(false);
const editingCategory = ref<Category | null>(null);
const isSaving = ref(false);


const layout = ref([
  { i: "form", x: 0, y: 0, w: 12, h: 6 },
  { i: "table", x: 0, y: 6, w: 12, h: 10 },
]);

onMounted(() => {
  categoryStore.fetchCategories();
});

const handleEdit = (cat: Category) => {
  selectedCategory.value = { ...cat };
  // Opzionale: scroll al form o focus
};

const handleSuccess = () => {
  selectedCategory.value = null;
};

 const openEditModal = (cat: Category) => {
  // Cloniamo l'oggetto per non modificare lo store prima del save
  editingCategory.value = { ...cat };
  isEditModalOpen.value = true;
};


const handleUpdate = async () => {
  if (
    // 1. Controllo che i dati esistano e siano validi
    !editingCategory.value ||
    editingCategory.value.descrizione.trim() === ""
  ) {
    return;
  }

  try {
    // 2. Imposto lo stato di salvataggio
    isSaving.value = true;

    // 3. Chiamata allo store per aggiornare la categoria
    await categoryStore.updateCategory(editingCategory.value);

    // 4. Successo: chiudiamo il modale
    isEditModalOpen.value = false;
  } catch (error: unknown) {
    let messaggio = "Errore durante l'aggiornamento";
    if (error instanceof Error) {
      // Se è un errore standard, prendiamo il suo messaggio
      messaggio = error.message;
    } else if (typeof error === "string") {
      // Se il server ha mandato solo una scritta, usiamo quella
      messaggio = error;
    }
    alert(messaggio);
  } finally {
    // 5. Resetto lo stato di salvataggio
    isSaving.value = false;
  }
}; 

</script>

<template>
  <main class="max-w-5xl mx-auto p-6">
    <header>
      <Header />
    </header>

    <GridLayout
      v-model:layout="layout"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      class="bg-gray-50 p-4 rounded-xl"
    >
      <GridItem v-for="item in layout" :key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i">
        
        <template v-if="item.i === 'table'">
          <CategoryTable @edit="handleEdit" />
        </template>
        
        <template v-if="item.i === 'form'">
          <CategoryForm :editData="selectedCategory" @success="handleSuccess" />
        </template>

      </GridItem>
    </GridLayout>
  </main>
</template>

<!-- <template>
  <main class="max-w-5xl mx-auto p-6">
    <header class="mb-8 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Gestione Categorie</h1>
        <p class="text-gray-500">Personalizza i tuoi budget e colori</p>
      </div>
    </header>

    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
                <button @click="openEditModal(cat)" class="p-2 text-gray-400 hover:text-amber-500 transition-colors">
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

    <div v-if="isEditModalOpen" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900">Modifica Categoria</h3>
          <button @click="isEditModalOpen = false" class="text-gray-400 hover:text-gray-600"><X :size="24" /></button>
        </div>

        <div v-if="editingCategory" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Descrizione</label>
            <input v-model="editingCategory.descrizione" type="text" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Budget</label>
              <input v-model.number="editingCategory.budget" type="number" class="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">Colore</label>
              <input v-model="editingCategory.colore" type="color" class="w-full h-12 p-1 bg-white border border-gray-200 rounded-xl cursor-pointer" />
            </div>
          </div>
          <div class="pt-4 flex gap-3">
            <button @click="isEditModalOpen = false" class="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Annulla</button>
            <button @click="handleUpdate" class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Salva</button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template> -->
