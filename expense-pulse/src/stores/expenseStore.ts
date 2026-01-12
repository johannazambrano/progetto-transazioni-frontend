import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "@/services/api";
import type { Transaction, Pagination } from "@/models/entities/Transaction";
import type { TransactionDTO } from "@/models/dtos/TransactionDTO";
import { useCategoryStore } from "./categoryStore";
import { TransactionMapper } from "@/models/mappers/TransactionMapper";
import type {
  TransactionResponseDTO,
  FiltroRicercaTransactionDTO,
} from "@/models/dtos/TransactionDTO";
import type { FiltroTransactionDTO } from "@/models/dtos/FiltroTransactionDTO";
import type { PaginazioneDTO } from "@/models/dtos/PaginazioneDTO";

export const useExpenseStore = defineStore("expense", () => {
  // STATO
  console.log("[useExpenseStore] entriamo dentro useExpenseStore");

  const transactions = ref<Transaction[]>([]);
  const pagination = ref<Pagination | null>(null);
  const loading = ref(false); // Utile per mostrare uno spinner

  // GETTERS: calcoli automatici (reattivi)
  const totalBalance = computed(() =>
    transactions.value.reduce((acc, t) => acc + t.amount, 0)
  );

  const totalIncomes = computed(() =>
    transactions.value
      .filter((t) => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0)
  );

  const totalExpenses = computed(() =>
    transactions.value
      .filter((t) => t.amount < 0)
      .reduce((acc, t) => acc + t.amount, 0)
  );

  // Azioni asincrone
  const fetchTransactions = async (
  filters: Partial<FiltroRicercaTransactionDTO> = {}
) => {
  loading.value = true;
  try {
    // Creiamo il payload dinamicamente
    const payload: FiltroRicercaTransactionDTO = {
      // Invia il titolo solo se non è una stringa vuota, altrimenti undefined
      title: filters.title?.trim() || undefined,
      
      // Fondamentale: invia la categoria solo se non è "" (Tutte le categorie)
      category: filters.category && filters.category !== "" ? filters.category : undefined,
      
      paginazione: {
        numeroPagina: filters.paginazione?.numeroPagina || 0,
        numeroElementiPerPagina: 10,
      },
    };

    console.log("[expenseStore] Inviando payload ricerca:", payload);

    const response = await api.post<TransactionResponseDTO>(
      "/transactions/ricerca",
      payload
    );

    const mapped = TransactionMapper.toResponseState(response.data);
    transactions.value = mapped.transactions;
    pagination.value = mapped.pagination;
  } catch (error) {
    console.error("Errore nella ricerca transazioni: ", error);
  } finally {
    loading.value = false;
  }
};

  const addTransaction = async (transactionData: Omit<Transaction, "id">) => {
    try {
      // 1. Creiamo un'entità temporanea (id vuoto per la creazione)
      const newEntity: Transaction = {
        ...transactionData,
        id: "",
      };

      // 2. Usiamo il mapper per generare il DTO corretto.
      // Il mapper gestirà correttamente l'oggetto category annidato.
      const dto = TransactionMapper.toDTO(newEntity);

      // 3. Invio al backend
      await api.post("/transactions", dto);

      // 4. Refresh della lista
      await fetchTransactions();
    } catch (error) {
      console.error("Errore add transaction:", error);
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      await fetchTransactions();
    } catch (error) {
      console.error("Errore delete:", error);
    }
  };

  const updateTransaction = async (updatedTransaction: Transaction) => {
    loading.value = true;
    try {
      // 1. Trasformiamo l'entity in DTO usando il mapper, garantendo così che Category venga inviata come oggetto
      const dto = TransactionMapper.toDTO(updatedTransaction);

      // 2. Eseguiamo la PUT
      await api.put(`/transactions/${updatedTransaction.id}`, dto);

    // 3. Refresh locale o ricaricamento dal server
      await fetchTransactions();

      console.log(`[expenseStore] Transazione ${updatedTransaction.id} aggiornata con successo`);
    } catch (error) {
      console.error("Errore durante l'aggiornamento della transazione: ", error);
      throw error;
    } finally {
        loading.value = false;
    }
  };

  const changePage = async (pageNumber: number) => {
  // Chiamiamo fetchTransactions passando il numero della pagina desiderata
  await fetchTransactions({
    paginazione: {
      numeroPagina: pageNumber,
      numeroElementiPerPagina: 10 // O il valore che preferisci
    }
  });
};

  return {
    transactions,
    pagination,
    totalBalance,
    totalIncomes,
    totalExpenses,
    fetchTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    changePage,
  };
});
