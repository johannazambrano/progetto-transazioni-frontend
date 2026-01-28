import type { PaginazioneDTO } from "./PaginazioneDTO";
import type { TransactionDTO } from "./TransactionDTO";

// DTO per la ricezione dei dati
export interface TransactionResponseDTO {
    transactions: TransactionDTO[];
    paginazione: PaginazioneDTO;
}