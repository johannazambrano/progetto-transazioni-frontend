<script setup lang="ts">
/**
* EDIT CONTROL COMPONENT
* Componente per modifica e blocco del layout.
*/
import { ref } from "vue";
import { Lock, Edit3, RotateCcw } from "lucide-vue-next";
import type { LayoutItem } from "@/models/vo/LayoutItemVO";
import { DEFAULT_LAYOUT_HOME, LAYOUT_STORAGE_KEY } from "@/constants/app.constants";


// VARIABILI
const editMode = ref(false);
const layout = ref<LayoutItem[]>([]);

// FUNZIONI
/**
 * Resetta il layout al default
 */
const resetLayout = () => {
  if (confirm("Vuoi ripristinare il layout predefinito? Le modifiche andranno perse.")) {
    layout.value = [...DEFAULT_LAYOUT_HOME];
    // saveLayout(layout.value);
    console.log("🔄 Layout resettato");
  }
};

const toggleEditMode = () => {
  // Se stiamo uscendo dalla modalità edit, salva il layout
  if (!editMode.value) {
    saveLayout(layout.value);
    console.log("🔒 Layout bloccato e salvato");
  }

  editMode.value = !editMode.value;
};

/**
 * Salva il layout corrente in localStorage
 */
const saveLayout = (layoutToSave: LayoutItem[]) => {
  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(layoutToSave));
    console.log("💾 Layout salvato");
  } catch (error) {
    console.error("❌ Errore nel salvataggio del layout:", error);
  }
};

</script>

<template>
  <div class="flex justify-end mr-3">
    <button v-if="editMode" @click="resetLayout"
      class="flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-all bg-red-400 border border-gray-200 text-white hover:border-red-400 hover:bg-red-600 hover:shadow-sm"
      title="Ripristina layout predefinito">
      <RotateCcw :size="18" class="mr-2" />
      <span>Reset</span>
    </button>
    <button @click="toggleEditMode" :class="[
      'flex items-center px-2 py-2 rounded-xl text-sm font-medium transition-all',
      !editMode
        ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700'
        : 'bg-green-400 border border-gray-200 text-white hover:bg-green-600 hover:shadow-sm'
    ]">
      <Lock v-if="editMode" :size="18" class="mr-2" />
      <Edit3 v-else :size="18" class="mr-2" />
      <span>{{ editMode ? 'Blocca Layout' : 'Modifica Layout' }}</span>
    </button>
  </div>
</template>