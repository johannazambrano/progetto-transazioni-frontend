export interface CategoryDTO {
    id?: string;
    descrizione: string;
    codice: string;
}

export interface CategoryResponseDTO {
    categories: CategoryDTO[];
}