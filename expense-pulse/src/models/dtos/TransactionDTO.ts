import type { CategoryDTO } from "./CategoryDTO";

export interface TransactionDTO {
    id?: string;
    title: string;
    amount: number;
    category: CategoryDTO;
    date: string;
}