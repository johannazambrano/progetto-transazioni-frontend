import type { CategoryDTO } from "./CategoryDTO";

export interface TransactionDTO {
    id?: string;
    title: string;
    amount: number;
    category: CategoryDTO; // Qui Quarkus invia la descrizione o l'ID della categoria
    startDate: string;
    endDate: string;
}