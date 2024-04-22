import {  ReactNode, useEffect, useState, useCallback } from 'react';
import { api } from '../lib/axios';
import { createContext } from 'use-context-selector'
// Interface que define a estrutura de uma transação
interface Transaction {
  id: number;
  description: string;
  type: 'income' | 'outcome'; // Tipo de transação: entrada ou saída
  price: number;
  category: string;
  createdAt: string;
}


// Interface que define o tipo de objeto que será fornecido pelo contexto
interface TransactionContextType {
  transactions: Transaction[]; // Lista de transações
  fetchTransactions: (query?: string) => Promise<void>;
  createTransaction: (data: CreateTransactionInput) => Promise<void>;
}

// Interface que define as propriedades que o componente TransactionsProvider deve receber
interface TransactionsProviderProps {
  children: ReactNode; // Filhos do componente (elementos React)
}

interface CreateTransactionInput {
  description: string;
  price: number;
  category: string;
  type: 'income' | 'outcome';
}

// Criação do contexto de transações
export const TransactionsContext = createContext({} as TransactionContextType);

// Componente que provê o contexto de transações
export function TransactionsProvider({ children }: TransactionsProviderProps) {
  // Estado local para armazenar as transações
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Função assíncrona para carregar as transações da API
  const fetchTransactions = useCallback(async(query?: string) => {
    const response = await api.get('transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      }
    })
    setTransactions(response.data); // Atualiza o estado com as transações obtidas
  },[])

  const createTransaction = useCallback(async (data: CreateTransactionInput) => {
    const { description, price, category, type } = data;

    const response = await api.post('transactions', {
      description,
      price,
      category,
      type,
      createdAt: new Date(),
    });

    setTransactions(state => [response.data, ...state])
  }, [])
  // Efeito que é executado quando o componente é montado
  useEffect(() => {
    fetchTransactions(); // Chama a função para carregar as transações
  }, []);

  // Retorna o provedor do contexto com as transações como valor
  return (
    <TransactionsContext.Provider value={{ 
      transactions,
      fetchTransactions,
      createTransaction
      }}>
      {children} {/* Renderiza os componentes filhos dentro do provedor de contexto */}
    </TransactionsContext.Provider>
  );
}
