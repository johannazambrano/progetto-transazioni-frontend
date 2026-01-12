import type { Category } from "./Category";

export interface Transaction {
    id: string;
    title: string;
    amount: number;
    category: Category;
    date: string;
}

export interface Pagination {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
}