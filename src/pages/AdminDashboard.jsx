import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAdminMetrics } from "../api/adminApi";
import { logout } from "../store/authSlice";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import "./AdminDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const ICON_AUDIT = "🧾";
const ICON_LOGOUT = "🚪";
const ICON_WALLET = "💰"; // New icon for viewing wallets

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await getAdminMetrics();
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to load admin metrics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleAuditLogs = () => {
    navigate("/audit");
  };

  // ✅ New: Navigate to normal dashboard
  const handleViewWallet = () => {
    navigate("/");
  };

  if (loading) return <p className="loading">Loading admin dashboard...</p>;
  if (!metrics) return <p>Unable to load metrics</p>;

  const barData = {
    labels: ["Users", "Wallets", "Transactions"],
    datasets: [
      {
        label: "System Overview",
        data: [
          metrics.totalUsers || 0,
          metrics.totalWallets || 0,
          metrics.totalTransactions || 0,
        ],
        backgroundColor: ["#2563eb", "#16a34a", "#f59e0b"],
      },
    ],
  };

  const doughnutData = {
    labels: ["Transaction Volume"],
    datasets: [
      {
        data: [metrics.totalTransactionVolume || 0, 1],
        backgroundColor: ["#0ea5e9", "#e5e7eb"],
      },
    ],
  };

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-actions-group">
          <button className="btn-wallet" onClick={handleViewWallet}>
            {ICON_WALLET} View Wallet
          </button>
          <button className="btn-audit" onClick={handleAuditLogs}>
            {ICON_AUDIT} Audit Logs
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            {ICON_LOGOUT} Logout
          </button>
        </div>
      </header>

      {/* METRIC CARDS */}
      <div className="metric-grid">
        <div className="metric-card">
          <h3>Total Users</h3>
          <p>{metrics.totalUsers}</p>
        </div>

        <div className="metric-card">
          <h3>Total Wallets</h3>
          <p>{metrics.totalWallets}</p>
        </div>

        <div className="metric-card">
          <h3>Total Transactions</h3>
          <p>{metrics.totalTransactions}</p>
        </div>

        <div className="metric-card">
          <h3>Audit Logs</h3>
          <p>{metrics.recentAuditLogs}</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>System Distribution</h3>
          <Bar data={barData} />
        </div>

        <div className="chart-card">
          <h3>Transaction Volume</h3>
          <Doughnut data={doughnutData} />
        </div>
      </div>
    </div>
  );
}
