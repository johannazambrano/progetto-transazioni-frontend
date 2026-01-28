import type { CategoryVO } from "./CategoryVO";

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    category: CategoryVO;
    date: string;
}
