// src/pages/Dashboard.jsx (FULLY UPDATED WITH LOGOUT BUTTON)

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { getWallets, createWallet } from "../api/walletApi";
import { setWallets } from "../store/walletSlice";
import { logout } from "../store/authSlice"; // ✅ Import logout action
import TopUpModal from "../components/TopUpModal";
import TransferModal from "../components/TransferModal";

// IMPORT DEDICATED CSS
import './Dashboard.css'; 

// Using emojis as placeholder icons (you can replace these with actual icon components like react-icons)
const ICON_TOP_UP = '⬆️';
const ICON_TRANSFER = '↔️';
const ICON_TRANSACTIONS = '📄';
const ICON_AUDIT = '🧾'; 
const ICON_LOGOUT = '🚪'; // Logout icon

const formatCurrency = (amount, currency) => {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    } catch (e) {
        return `${amount} ${currency}`;
    }
};

export default function Dashboard() {
    const dispatch = useDispatch();
    const wallets = useSelector((state) => state.wallet.wallets);
    const navigate = useNavigate(); 

    const [topUpWalletId, setTopUpWalletId] = useState(null);
    const [transferWalletId, setTransferWalletId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [creating, setCreating] = useState(false);
    const [currency, setCurrency] = useState("NGN"); 

    const fetchWallets = async () => {
        try {
            const res = await getWallets();
            dispatch(setWallets(res.data));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch wallets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    const handleCreateWallet = async () => {
        setCreating(true);
        setError(""); 
        try {
            await createWallet(currency); 
            fetchWallets(); 
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create wallet");
        } finally {
            setCreating(false);
        }
    };

    // ✅ Logout handler
    const handleLogout = () => {
        dispatch(logout());  // Clear auth state
        navigate('/login');  // Redirect to login page
    };

    if (loading) return <div className="loading-state">Loading wallets...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>My Wallets</h1>
                
                <div className="wallet-actions-group">
                    {/* Currency selection */}
                    <div className="currency-selector-group">
                        <label htmlFor="currency-select">Currency:</label>
                        <select 
                            id="currency-select"
                            value={currency} 
                            onChange={(e) => setCurrency(e.target.value)}
                            disabled={creating}
                        >
                            <option value="NGN">NGN - Nigerian Naira</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                        </select>
                    </div>

                    {/* Create wallet button */}
                    <button
                        className="btn-primary"
                        onClick={handleCreateWallet}
                        disabled={creating}
                    >
                        {creating ? "Creating..." : "Create New Wallet"}
                    </button>

                    {/* Audit Logs button */}
                    <button
                        className="btn-audit" 
                        onClick={() => navigate('/audit')}
                    >
                        {ICON_AUDIT} Audit Logs
                    </button>

                    {/* Logout button */}
                    <button
                        className="btn-logout"
                        onClick={handleLogout}
                    >
                        {ICON_LOGOUT} Logout
                    </button>
                </div>
            </header>
            
            {error && <div className="alert alert-error">{error}</div>}

            {/* Wallet List/Table */}
            <div className="wallet-list-area">
                {wallets.length === 0 ? (
                    <p className="empty-state">You have no wallets yet. Create one to get started!</p>
                ) : (
                    <table className="wallets-table">
                        <thead>
                            <tr>
                                <th>Wallet ID</th>
                                <th>Currency</th>
                                <th className="text-right">Balance</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wallets.map((w) => (
                                <tr key={w.id} className="wallet-row">
                                    <td>{w.id.toString().substring(0, 8)}...</td> 
                                    <td>{w.currency}</td>
                                    <td className="text-right">
                                        <strong>{formatCurrency(w.balance, w.currency)}</strong>
                                    </td>
                                    <td className="actions-cell">
                                        <button 
                                            className="btn-action" 
                                            title="Top Up"
                                            onClick={() => setTopUpWalletId(w.id)}
                                        >
                                            {ICON_TOP_UP} Top Up
                                        </button>
                                        <button 
                                            className="btn-action" 
                                            title="Transfer Funds"
                                            onClick={() => setTransferWalletId(w.id)}
                                        >
                                            {ICON_TRANSFER} Transfer
                                        </button>
                                        <button 
                                            className="btn-action" 
                                            title="View Transactions"
                                            onClick={() => navigate(`/transactions?walletId=${w.id}`)}
                                        >
                                            {ICON_TRANSACTIONS} Transactions
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modals */}
            {topUpWalletId && (
                <TopUpModal 
                    walletId={topUpWalletId} 
                    close={() => setTopUpWalletId(null)} 
                    onSuccess={fetchWallets}
                />
            )}
            {transferWalletId && (
                <TransferModal 
                    fromWalletId={transferWalletId} 
                    close={() => setTransferWalletId(null)} 
                    onSuccess={fetchWallets}
                    availableWallets={wallets} 
                />
            )}
        </div>
    );
}
