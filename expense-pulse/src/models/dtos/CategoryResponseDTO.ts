import type { CategoryDTO } from "./CategoryDTO";
import type { PaginazioneDTO } from "./PaginazioneDTO";

export interface CategoryResponseDTO {
    categories: CategoryDTO[];
    paginazione?: PaginazioneDTO;
}