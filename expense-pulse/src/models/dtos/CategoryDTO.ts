export interface CategoryDTO {
    id?: string;
    descrizione: string;
    codice: string;
    budget?: number;
    colore?: string;
}

export interface CategoryResponseDTO {
    categories: CategoryDTO[];
}