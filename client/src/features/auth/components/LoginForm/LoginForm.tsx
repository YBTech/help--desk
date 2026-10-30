import { useState, type SubmitEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./LoginForm.module.css";
import axios from "axios";
import type { ApiResponse } from "../../../../shared/types/api.types";
import type { User } from "../../types/auth.types";

const url = "http://localhost:4000/api";

export function LoginForm() {
  // 🔴 Todo: implement login logic.
  // 1. handle the form submission and validation logic.
  //    - username: admin, alice, bob, carol, or dave
  //    - password: 123
  // 2. call the login API with axios and handle the response. api: POST http://localhost:4000/api/users/login
  // 3. display error message if login fails.
  // 4. on successful login, update the auth context with the user information
  //    (the dropdown closes by itself, because UserBadge re-renders once there is a user).
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      setError("Username and Password can not be empty!");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const response = await axios.post<ApiResponse<User>>(
        `${url}/users/login`,
        { username: username.trim(), password },
      );
      login(response.data.data);
    } catch (error) {
      console.log("Login error: ", error);
      setError("Username and password are not match, please double check!");
      setSubmitting(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-username">
            Username
          </label>
          <input
            type="text"
            className={styles.input}
            id="login-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="login-password">
            Password
          </label>
          <input
            type="password"
            className={styles.input}
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {/* <div className={styles.error}>Wrong username or password</div> */}
        {error && <div className={styles.error}>{error}</div>}
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <div className={styles.hint}>
        <p>Try: admin, alice, bob, carol, or dave</p>
        <p>Password: 123</p>
      </div>
    </>
  );
}
