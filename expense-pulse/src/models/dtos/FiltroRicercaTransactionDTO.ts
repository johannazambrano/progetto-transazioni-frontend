import type { PaginazioneDTO } from "./PaginazioneDTO";

// DTO per l'invio della ricerca (POST /ricerca)
export interface FiltroRicercaTransactionDTO {
    title?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    paginazione: Partial<PaginazioneDTO>;
}