import api from "@/services/api";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { CategoryMapper } from "@/models/mappers/CategoryMapper";
import type { CategoryResponseDTO } from "@/models/dtos/CategoryResponseDTO";
import type { CategoryVO } from "@/models/vo/CategoryVO";

export const useCategoryStore = defineStore("category", () => {
  console.log("[categoryStore] Entriamo dentro useCategoryStore");

  //const categories = ref<Category[]>([]);
  const categories = ref<CategoryVO[]>([]);
  const loading = ref(false);

  // Calcola il prossimo codice incrementando l'ultimo (es: "002" -> "003")
  const nextAvailableCode = computed(() => {
    console.log("[categoryStore.nextAvailableCode] 🔍 category lunghezza: ", categories.value.length);
    if (categories.value.length === 0) return "001";

    const codes = categories.value
      .map((c) => parseInt(c.codice))
      .filter((n) => !isNaN(n));
    const maxCode = Math.max(...codes);
    return (maxCode + 1).toString().padStart(3, "0");
  });

  const fetchCategories = async () => {
    loading.value = true;
    try {
      const response = await api.get<CategoryResponseDTO>("/categories");
      categories.value = response.data.categories.map(CategoryMapper.toEntity);
    } catch (error) {
      console.error("[categoryStore.fetchCategories] ❌ Errore nel caricamento categorie:", error);
    } finally {
      loading.value = false;
    }
  };

  const addCategory = async (catData: {
    descrizione: string;
    budget: number;
    colore: string;
  }) => {
    try {
      // 1. Controllo univocità Descrizione (Case Insensitive)
      const isDuplicate = categories.value.some(
        (cat) =>
          cat.descrizione.toLowerCase() === catData.descrizione.toLowerCase()
      );

      if (isDuplicate) {
        // si lancia un errore specifico che si potrebbe catturare nella view
        throw new Error(`La categoria "${catData.descrizione}" esiste già.`);
      }

      // 2. Recuperiamo il codice dalla computed
      const code = nextAvailableCode.value;

      // 3. Creiamo l'entity
      const newEntity: CategoryVO = {
        id: "",
        descrizione: catData.descrizione,
        codice: code,
        budget: catData.budget,
        colore: catData.colore,
      };

      // 4. Creiamo DTO e lo inviamo
      const dto = CategoryMapper.toDTO(newEntity);

      // Ora il DTO conterrà solo descrizione e codice perché l'id è ''
      await api.post("/categories", dto);

      // 5. Refresh della lista
      await fetchCategories();
    } catch (error) {
      console.error("[categoryStore.addCategory] ❌ Errore durante l'aggiunta:", error);
      throw error;
    }
  };

  const updateCategory = async (cat: CategoryVO) => {
    // Implementa la logica di aggiornamento categoria
    try {
      // convertiamo l'entity in dto
      const dto = CategoryMapper.toDTO(cat);

      // chiamata PUT al BE con l'ID della categoria
      await api.put(`/categories/${cat.id}`, dto);
      // refresh della lista
      await fetchCategories();
    } catch (error) {
      console.error("[categoryStore.updateCategory] ❌ Errore durante la modifica della categoria:", error);
      throw error;
    }
  };

  const deleteCategory = async (catId: string) => {
    // Implementa la logica di eliminazione categoria
    try {
      // chiamata DELETE al BE con l'ID della categoria
      await api.delete(`/categories/${catId}`);
      // refresh della lista
      await fetchCategories();
    } catch (error) {
      console.error("[categoryStore.deleteCategory] ❌ Errore durante l'eliminazione della categoria:", error);
    }
  };

  return {
    categories,
    loading,
    nextAvailableCode,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
});
