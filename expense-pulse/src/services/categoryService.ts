import api from './api';

export interface CategoryDTO {
    descrizione: string;
    codice: string;

    /* id?: string;
    name: string;
    icon?: string; //opzionale per salvare un'icona */
}

export const categoryService = {
  // Recupera l'elenco (corrisponde a @GET elencoCategories)
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data; // Ritorna l'oggetto CategoryResponse
  },

  // Crea nuova categoria (corrisponde a @POST creaCategory)
  create: async (category: CategoryDTO) => {
    return await api.post('/categories', category);
  }
};