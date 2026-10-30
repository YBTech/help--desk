import { useState, useMemo, useEffect } from "react";
import type { User, UserRole } from "../../types/user.types";
import styles from "./UserList.module.css";
import axios from "axios";
import type { ApiResponse } from "../../../../shared/types/api.types";
import { LoadingSpinner } from "../../../../shared/components/LoadingSpinner/LoadingSpinner";

const url = "http://localhost:4000/api/users";

export function UserList() {
  // 🔴 TODO (bonus):
  // 1. Fetch GET http://localhost:4000/api/users with axios inside useEffect, and store response.data.data with setUsers
  //    (the response looks like { success: true, data: User[] })
  // 2. Track loading and error states, and show them instead of the table
  // 3. Replace the hardcoded <tr> rows below with filteredAndSorted.map() — remember the key prop
  // 4. Show "No users found" when filteredAndSorted is empty
  // 5. Replace the hardcoded count with filteredAndSorted.length
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const result = await axios.get<ApiResponse<User[]>>(url);
        setUsers(result.data.data);
      } catch (error) {
        setError(
          (axios.isAxiosError(error) && error.response?.data?.message) ||
            "Failed to fetch users!",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // already written: filter by role and sort by display name
  const filteredAndSorted = useMemo(() => {
    const filtered = roleFilter
      ? users.filter((u) => u.role === roleFilter)
      : users;
    return [...filtered].sort((a, b) =>
      sortOrder === "asc"
        ? a.displayName.localeCompare(b.displayName)
        : b.displayName.localeCompare(a.displayName),
    );
  }, [users, roleFilter, sortOrder]);

  // don't change, helper function to get the CSS class for the role badge
  const getRoleBadgeClass = (role: UserRole) => {
    if (role === "admin") return `${styles.roleBadge} ${styles.roleAdmin}`;
    if (role === "agent") return `${styles.roleBadge} ${styles.roleAgent}`;
    return `${styles.roleBadge} ${styles.roleViewer}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Users</h1>
      </div>

      <div className={styles.controls}>
        <label>
          Role
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="agent">Agent</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>

        <label>
          Sort by Name
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </label>

        <span className={styles.resultCount}>
          {/* 🔴 TODO (bonus): replace hardcoded count with the number of filtered users */}
          {filteredAndSorted.length}{" "}
          {filteredAndSorted.length === 1 ? "user" : "users"}
        </span>
      </div>
      {loading && <LoadingSpinner />}
      {error && <p className={styles.error}>{error}</p>}
      {!loading &&
        !error &&
        (filteredAndSorted.length === 0 ? (
          <p className={styles.noUsers}>No user found!</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Display Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {/* 🔴 TODO (bonus): replace hardcoded rows with filteredAndSorted.map() */}
              {filteredAndSorted.map(user => (
                <tr key={user.id}>
                  <td>{user.displayName}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
    </div>
  );
}
