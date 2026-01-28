import type { CategoryDTO } from "./CategoryDTO";
import type { PaginazioneDTO } from "./PaginazioneDTO";

export interface TransactionDTO {
    id?: string;
    title: string;
    amount: number;
    category: CategoryDTO; // Qui Quarkus invia la descrizione o l'ID della categoria
    startDate: string;
    endDate: string;
}