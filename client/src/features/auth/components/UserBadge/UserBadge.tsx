import { useState, useRef, useEffect } from "react";
import { LoginForm } from "../LoginForm/LoginForm";
import styles from "./UserBadge.module.css";

export function UserBadge() {
  // 🔴 Todo: get the user from the auth context.
  const user = null; //change this line

  // do not edit below this line
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  if (!user) {
    return (
      <div ref={dropdownRef} className={styles.loginWrapper}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={styles.loginButton}
        >
          Login
        </button>
        {open && (
          <div className={styles.dropdown}>
            <LoginForm />
          </div>
        )}
      </div>
    );
  }

  // 🔴 Todo: display user info if logged in. click logout button to log user out
  return (
    <div className={styles.userInfo}>
      <div className={styles.userText}>
        <div className={styles.userName}>display name</div>
        <div className={styles.userRole}>user role</div>
      </div>
      <button className={styles.logoutButton}>Logout</button>
    </div>
  );
}
