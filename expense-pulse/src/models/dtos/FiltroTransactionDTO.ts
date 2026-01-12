import type { PaginazioneDTO } from "./PaginazioneDTO";

export interface FiltroTransactionDTO {
    transactions?: any[]; 
    paginazione?: PaginazioneDTO;
}