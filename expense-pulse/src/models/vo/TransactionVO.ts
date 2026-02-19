import type { CategoryVO } from "./CategoryVO";

export interface TransactionVO {
    id: string;
    title: string;
    amount: number;
    category: CategoryVO;
    date: string;
}
