import { createContext, ReactNode, useEffect, useState } from 'react';

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
}

// Interface que define as propriedades que o componente TransactionsProvider deve receber
interface TransactionsProviderProps {
  children: ReactNode; // Filhos do componente (elementos React)
}

// Criação do contexto de transações
export const TransactionsContext = createContext({} as TransactionContextType);

// Componente que provê o contexto de transações
export function TransactionsProvider({ children }: TransactionsProviderProps) {
  // Estado local para armazenar as transações
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Função assíncrona para carregar as transações da API
  async function loadTransactions() {
    const response = await fetch('http://localhost:3000/transactions'); // Requisição à API
    const data = await response.json(); // Conversão da resposta para JSON
    setTransactions(data); // Atualiza o estado com as transações obtidas
  }

  // Efeito que é executado quando o componente é montado
  useEffect(() => {
    loadTransactions(); // Chama a função para carregar as transações
  }, []);

  // Retorna o provedor do contexto com as transações como valor
  return (
    <TransactionsContext.Provider value={{ transactions }}>
      {children} {/* Renderiza os componentes filhos dentro do provedor de contexto */}
    </TransactionsContext.Provider>
  );
}
