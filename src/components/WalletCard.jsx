import React from "react";

export default function WalletCard({ wallet, onTopUp, onTransfer, onViewTransactions }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 16, marginBottom: 12, borderRadius: 8 }}>
      <h3>{wallet.currency} Wallet</h3>
      <p>Wallet ID: {wallet.id}</p>
      <p>Balance: {wallet.balance.toFixed(2)}</p>
      <button onClick={() => onTopUp(wallet.id)}>Top-Up</button>
      <button onClick={() => onTransfer(wallet.id)}>Transfer</button>
      <button onClick={() => onViewTransactions(wallet.id)}>Transactions</button>
    </div>
  );
}
