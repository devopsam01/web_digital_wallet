// src/components/TopUpModal.jsx
import { useState } from "react";
import { topUpWallet } from "../api/walletApi";

// 🎯 Accept the onSuccess prop
export default function TopUpModal({ walletId, close, onSuccess }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(""); // Add local error state
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state

  const submit = async () => {
    if (amount <= 0) {
        setError("Amount must be greater than zero.");
        return;
    }
    
    setIsSubmitting(true);
    setError("");

    try {
        const numericAmount = parseFloat(amount);
        await topUpWallet(walletId, numericAmount);

        // 1. Call the success handler (which runs fetchWallets in Dashboard.jsx)
        if (onSuccess) {
            onSuccess(); 
        }

        // 2. Close the modal
        close();

        // ❌ DELETED: The line window.location.reload(); is removed.

    } catch (err) {
        console.error("Top-Up failed:", err);
        setError(err.response?.data?.message || "Failed to complete top-up.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    // For a quick fix, using basic styles, but ideally this should use classes
    <div style={{ 
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
        backgroundColor: 'white', padding: '20px', border: '1px solid #ccc', zIndex: 1000
    }}>
      <h3>Top-Up Wallet ID: {walletId}</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input 
            type="number"
            placeholder="Amount" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)} 
            disabled={isSubmitting}
        />
      <button onClick={submit} disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Confirm"}
      </button>
      <button onClick={close} disabled={isSubmitting}>Cancel</button>
    </div>
  );
}