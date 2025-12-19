import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, registerAdmin } from "../api/authApi";
import { setAuthToken } from "../api/apiClient";
import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "USER", // ✅ default
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Ensure no JWT is attached
    setAuthToken(null);

    try {
      if (form.role === "ADMIN") {
        await registerAdmin(
          form.username,
          form.fullName,
          form.email,
          form.password
        );
      } else {
        await registerUser(
          form.username,
          form.fullName,
          form.email,
          form.password
        );
      }

      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="register-card">
        <h1 className="register-title">Create Account</h1>

        <form className="register-form" onSubmit={submit}>
          <div className="form-group">
            <label>Username</label>
            <input
              name="username"
              className="form-input"
              value={form.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Full Name</label>
            <input
              name="fullName"
              className="form-input"
              value={form.fullName}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              className="form-input"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              className="form-input"
              value={form.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          {/* 🔐 ROLE SELECT */}
          <div className="form-group">
            <label>Register As</label>
            <select
              name="role"
              className="form-input"
              value={form.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {error && <p className="alert-error">{error}</p>}

          <button
            type="submit"
            className="btn-primary register-btn"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="login-link-text">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
