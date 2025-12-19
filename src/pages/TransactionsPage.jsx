// src/pages/TransactionsPage.jsx
import React, { useEffect, useState } from "react";
// 🎯 NEW: Import useLocation and useNavigate from react-router-dom
import { useLocation, useNavigate } from "react-router-dom"; 
import { getWalletTransactions, getAllTransactions } from "../api/walletApi"; 

// IMPORT DEDICATED CSS (Assume you will create this file)
// import './TransactionsPage.css';

// Utility function for professional currency formatting
const formatCurrency = (amount, currency) => {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch (e) {
        // Fallback for unsupported currency codes
        return `${amount} ${currency}`;
    }
};

const TransactionsPage = () => {
    // 🎯 Use useLocation for reliable query parsing in React Router
    const location = useLocation();
    const navigate = useNavigate();

    // Get walletId from URL query: /transactions?walletId=...
    const query = new URLSearchParams(location.search);
    const walletId = query.get('walletId'); 

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTransactions = async () => {
        setLoading(true);
        setError("");

        try {
            let res;
            if (walletId) {
                // Fetch transactions for a SPECIFIC wallet
                res = await getWalletTransactions(walletId);
            } else {
                // Fetch ALL transactions
                res = await getAllTransactions();
            }
            
            setTransactions(res.data);
        } catch (err) {
            console.error("Failed to load transactions", err);
            setError(err.response?.data?.message || "Failed to load transactions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [walletId]); // Re-fetch whenever the walletId in the URL changes

    const title = walletId 
        ? `Transactions for Wallet ID: ${walletId.substring(0, 8)}...`
        : "All Global Transactions";

    if (loading) {
        return <div className="loading-state">Loading transactions...</div>;
    }

    // Determine the CSS class for the amount based on transaction type (for visual matching with Dashboard)
    const getAmountClassName = (type) => {
        const lowerType = type ? type.toLowerCase() : '';
        if (lowerType.includes('deposit') || lowerType.includes('credit')) return 'amount-credit';
        if (lowerType.includes('transfer') || lowerType.includes('withdrawal')) return 'amount-debit';
        return '';
    };

    return (
        // Match the outer container class for consistent styling
        <div className="dashboard-container"> 
            <header className="dashboard-header">
                <h1>{title}</h1>
                <button 
                    // 🎯 FIX APPLIED: Use navigate for client-side routing
                    onClick={() => navigate('/')} 
                    className="btn-secondary"
                >
                    &larr; Back to Wallets
                </button>
            </header>

            {/* Error Display Area */}
            {error && <div className="alert alert-error">{error}</div>}

            {/* Transaction List/Table */}
            <div className="wallet-list-area"> 
                {transactions.length === 0 ? (
                    <p className="empty-state">No transactions found for this wallet.</p>
                ) : (
                    // Match the table class name from Dashboard
                    <table className="wallets-table"> 
                        <thead>
                            <tr>
                                <th>ID</th>
                                {/* 🎯 CONDITIONAL RENDER: Only show Wallet ID if viewing ALL transactions */}
                                {!walletId && <th>Wallet ID</th>} 
                                <th>Type</th>
                                <th className="text-right">Amount</th> 
                                <th>Currency</th>
                                <th>Description</th>
                                <th className="text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(tx => (
                                <tr key={tx.id} className="transaction-row">
                                    {/* Display truncated ID */}
                                    <td>{tx.id.toString().substring(0, 8)}...</td> 
                                    
                                    {/* 🎯 CONDITIONAL RENDER: Wallet ID column */}
                                    {!walletId && <td>{tx.walletId.toString().substring(0, 8)}...</td>}
                                    
                                    <td>{tx.type}</td>
                                    <td className={`text-right ${getAmountClassName(tx.type)}`}>
                                        {/* 🎯 FORMATTING: Apply currency formatting */}
                                        <strong>{formatCurrency(tx.amount, tx.currency)}</strong>
                                    </td>
                                    <td>{tx.currency}</td>
                                    <td>{tx.description}</td>
                                    <td className="text-right">{new Date(tx.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TransactionsPage;