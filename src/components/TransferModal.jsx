import { useState } from "react";
import { transferWallet } from "../api/walletApi";

export default function TransferModal({
  fromWalletId,
  availableWallets,
  close,
  onSuccess,
}) {
  const fromWallet = availableWallets.find((w) => w.id === fromWalletId);

  const destinationWallets = availableWallets.filter(
    (w) => w.id !== fromWalletId
  );

  const [toWalletId, setToWalletId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!toWalletId || !amount || parseFloat(amount) <= 0) {
      setError("Please select a destination or enter a valid wallet ID and amount.");
      return;
    }
    if (fromWallet && parseFloat(amount) > fromWallet.balance) {
      setError("Transfer amount exceeds available balance.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await transferWallet(fromWalletId, toWalletId, amount);

      if (onSuccess) onSuccess();
      close();
    } catch (err) {
      console.error("Transfer submission error:", err);
      setError(err.response?.data?.message || "Transfer failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fromWallet) return null;

  return (
    <div className="modal-content">
      <h3>Transfer Funds</h3>
      <p>
        <strong>From Wallet:</strong> {fromWallet.currency} (Balance: {fromWallet.balance})
      </p>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label htmlFor="toWalletSelect">To Wallet (Select Internal Wallet):</label>
      <select
        id="toWalletSelect"
        value={toWalletId}
        onChange={(e) => setToWalletId(e.target.value)}
        disabled={isSubmitting}
      >
        <option value="">Select Destination Wallet</option>
        {destinationWallets.map((w) => (
          <option key={w.id} value={w.id}>
            {w.currency} (ID: {w.id.toString().substring(0, 8)}...)
          </option>
        ))}
      </select>

      <p style={{ fontSize: "small", color: "#555" }}>Or enter any wallet ID manually:</p>
      <input
        type="text"
        placeholder="Enter Wallet ID"
        value={toWalletId}
        onChange={(e) => setToWalletId(e.target.value)}
        disabled={isSubmitting}
      />

      <label htmlFor="amountInput">Amount:</label>
      <input
        id="amountInput"
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={isSubmitting}
      />

      <button
        onClick={submit}
        disabled={isSubmitting || !toWalletId || amount <= 0}
      >
        {isSubmitting ? "Sending..." : "Send"}
      </button>
      <button onClick={close} disabled={isSubmitting}>
        Cancel
      </button>
    </div>
  );
}
