import { useContextSelector } from "use-context-selector";
import { TransactionsContext } from "../context/TransctionsContext"


export function useSummary(){
    // Importa o hook useContext do React para acessar o contexto de transações
const  transactions  = useContextSelector(TransactionsContext, (context) =>{
  return context.transactions;
});

// Calcula um resumo das transações usando o método reduce
const summary = transactions.reduce(
  // Função de redução que recebe um acumulador (acc) e a transação atual (transaction)
  (acc, transaction) => {
    // Verifica se o tipo da transação é 'income' (entrada)
    if (transaction.type === 'income') {
      // Se for, incrementa o valor da transação ao total de renda (acc.income)
      acc.income += transaction.price;
      // Incrementa também o valor da transação ao total geral (acc.total)
      acc.total += transaction.price;
    } else {
      // Se não for uma entrada, assume que é uma saída (outcome)
      // Incrementa o valor da transação ao total de despesas (acc.outcome)
      acc.outcome += transaction.price;
      // Subtrai o valor da transação do total geral (acc.total)
      acc.total -= transaction.price;
    }

    // Retorna o acumulador atualizado para a próxima iteração
    return acc;
  },
  // Valor inicial do acumulador, contendo os totais de renda, despesas e total geral
  {
    income: 0,
    outcome: 0,
    total: 0,
  }
);
return summary;
}