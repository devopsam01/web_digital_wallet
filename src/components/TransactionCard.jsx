import React from "react";

export default function TransactionCard({ transaction }) {
  return (
    <div style={{ border: "1px solid #eee", padding: 12, marginBottom: 8, borderRadius: 6 }}>
      <p><strong>{transaction.type}</strong> - {transaction.amount.toFixed(2)}</p>
      <p>{transaction.description}</p>
      <p>Wallet ID: {transaction.walletId} | {transaction.currency}</p>
      <p>{new Date(transaction.createdAt).toLocaleString()}</p>
    </div>
  );
}
