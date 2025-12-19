import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTransactions } from "../api/walletApi";
import { setAllTransactions } from "../store/walletSlice";
import TransactionCard from "../components/TransactionCard";

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.wallet.allTransactions);

  useEffect(() => {
    getAllTransactions().then((res) => dispatch(setAllTransactions(res.data)));
  }, [dispatch]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Transaction History</h2>
      {transactions.map((t) => (
        <TransactionCard key={t.id} transaction={t} />
      ))}
    </div>
  );
}
