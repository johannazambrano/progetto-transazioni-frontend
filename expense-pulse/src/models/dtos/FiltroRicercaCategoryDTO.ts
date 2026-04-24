import type { PaginazioneDTO } from "./PaginazioneDTO";

export interface FiltroRicercaCategoryDTO {
    descrizione?: string;
    paginazione?: Partial<PaginazioneDTO>;
}