import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getMyAuditLogs } from "../api/walletApi";

const AuditLogsPage = () => {
    const navigate = useNavigate();

    const [logs, setLogs] = useState([]);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ✅ Stabilized function reference
    const fetchAuditLogs = useCallback(
        async (pageNumber = page) => {
            setLoading(true);
            setError("");

            try {
                const res = await getMyAuditLogs(pageNumber, size);

                setLogs(res.data.content);
                setPage(res.data.number);
                setTotalPages(res.data.totalPages);
            } catch (err) {
                setError(
                    err.response?.data?.message || "Failed to load audit logs"
                );
            } finally {
                setLoading(false);
            }
        },
        [page, size]
    );

    // ✅ Proper dependency handling
    useEffect(() => {
        fetchAuditLogs();
    }, [fetchAuditLogs]);

    if (loading) {
        return <div className="loading-state">Loading audit logs...</div>;
    }

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>My Audit Logs</h1>
                <button
                    onClick={() => navigate("/")}
                    className="btn-secondary"
                >
                    &larr; Back to Wallets
                </button>
            </header>

            {error && <div className="alert alert-error">{error}</div>}

            <div className="wallet-list-area">
                {logs.length === 0 ? (
                    <p className="empty-state">No audit logs found.</p>
                ) : (
                    <table className="wallets-table">
                        <thead>
                            <tr>
                                <th>Action</th>
                                <th>Entity</th>
                                <th>Status</th>
                                <th>Description</th>
                                <th className="text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log) => (
                                <tr key={log.id}>
                                    <td>{log.action}</td>
                                    <td>{log.entityType}</td>
                                    <td>{log.status}</td>
                                    <td>{log.description}</td>
                                    <td className="text-right">
                                        {new Date(
                                            log.createdAt
                                        ).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls">
                <button
                    className="btn-secondary"
                    disabled={page === 0}
                    onClick={() => fetchAuditLogs(page - 1)}
                >
                    ← Previous
                </button>

                <span>
                    Page {page + 1} of {totalPages}
                </span>

                <button
                    className="btn-secondary"
                    disabled={page + 1 >= totalPages}
                    onClick={() => fetchAuditLogs(page + 1)}
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default AuditLogsPage;
