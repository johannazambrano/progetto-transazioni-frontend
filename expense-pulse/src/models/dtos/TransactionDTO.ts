import type { CategoryDTO } from "./CategoryDTO";
import type { PaginazioneDTO } from "./PaginazioneDTO";

export interface TransactionDTO {
    id?: string;
    title: string;
    amount: number;
    category: CategoryDTO; // Qui Quarkus invia la descrizione o l'ID della categoria
    date: string;
}

// DTO per l'invio della ricerca (POST /ricerca)
export interface FiltroRicercaTransactionDTO {
    title?: string;
    category?: string;
    paginazione: Partial<PaginazioneDTO>; 
}

// DTO per la ricezione dei dati
export interface TransactionResponseDTO {
    transactions: TransactionDTO[];
    paginazione: PaginazioneDTO;
}