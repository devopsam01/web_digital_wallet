import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi";
import { setCredentials } from "../store/authSlice";
import { setAuthToken } from "../api/apiClient";
import "./LoginPage.css";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector((state) => state.auth.role);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await loginUser(username, password);
      const token = response.data.token;
      const userRole = response.data.role;

      console.log("API Response:", response.data); // ✅ see full response
      console.log("Token:", token);
      console.log("Role from API:", userRole);

      // Attach token for future requests
      setAuthToken(token);

      // Store both token and role in Redux
      //dispatch(setCredentials({ token, role: userRole }));
      dispatch(setCredentials({ token, role: response.data.role }));
      console.log("Role in Redux after dispatch:", role); // ⚠ may be old due to async

      // ROLE-BASED REDIRECT
      if (userRole === "ADMIN") {
        console.log("Redirecting to admin dashboard");
        navigate("/admin/dashboard");
      } else {
        console.log("Redirecting to user dashboard");
        navigate("/");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="login-card">
        <h1 className="login-title">Digital Wallet Login</h1>

        <form className="login-form" onSubmit={submit}>
          <div className="form-group">
            <label>Username</label>
            <input
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="alert-error">{error}</p>}

          <button className="btn-primary" disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>

        <p className="register-link-text">
          Don’t have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
