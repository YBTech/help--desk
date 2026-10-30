import { useNavigate } from "react-router-dom";
import styles from "./TicketForm.module.css";
import { useEffect, useState, type SubmitEvent } from "react";
import type {
  Ticket,
  TicketCategory,
  TicketPriority,
  User,
} from "../../types/ticket.types";
import axios from "axios";
import type { ApiResponse } from "../../../../shared/types/api.types";
import { useAuth } from "../../../auth/context/AuthContext";

export interface CreateTicketData {
  title: string;
  description: string;
  priority: TicketPriority;
  category: TicketCategory;
  reporterName: string;
  reporterEmail: string;
  assigneeId?: number | null;
}

const url = "http://localhost:4000/api";

type FieldErrors = Partial<
  Record<"title" | "description" | "reporterName" | "reporterEmail", string>
>;

function validate(form: {
  title: string;
  description: string;
  reporterName: string;
  reporterEmail: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  if (form.title.trim().length < 5)
    errors.title = "Title must be at least 5 characters!";
  if (!form.description.trim()) errors.description = "Description is required!";
  if (!form.reporterName.trim())
    errors.reporterName = "Reporter name is required!";
  if (
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.reporterEmail)
  )
    errors.reporterEmail = "Please enter a valid email!";
  return errors;
}

export function TicketCreateForm() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // 🔴 TODO:
  // 1. set up controlled component state for: title, description, priority, category,
  //    reporterName, reporterEmail, assigneeId
  // 2. fetch users from GET /api/users on mount (for the assignee dropdown)
  // 3. on submit, POST to /api/tickets with the form data,
  //    then navigate to /tickets/:id using the returned ticket id
  // 4. track a "submitting" state — disable the submit button and show "Saving..." while the request is in flight
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TicketPriority>("low");
  const [category, setCategory] = useState<TicketCategory>("bug");
  const [reporterName, setReporterName] = useState(user?.displayName ?? "");
  const [reporterEmail, setReporterEmail] = useState(user?.email ?? "");
  const [assigneeId, setAssigneeId] = useState("");

  const [users, setUsers] = useState<User[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const result = await axios.get<ApiResponse<User[]>>(`${url}/users`);
        setUsers(result.data.data);
      } catch (error) {
        axios.isAxiosError(error);
      }
    }
    fetchUsers();
  }, []);

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (submitting) return;

    const errors = validate({
      title,
      description,
      reporterName,
      reporterEmail,
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload: CreateTicketData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      reporterName: reporterName.trim(),
      reporterEmail: reporterEmail.trim(),
      assigneeId: assigneeId ? Number(assigneeId) : null,
    };

    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await axios.post<ApiResponse<Ticket>>(
        `${url}/tickets`,
        payload,
      );
      navigate(`/tickets/${result.data.data.id}`);
    } catch (error) {
      setSubmitError(
        (axios.isAxiosError(error) && error.response?.data.message) ||
          "Failed to create ticket!",
      );
      setSubmitting(false);
    }
  }

  const inputClass = (field: keyof FieldErrors) =>
    fieldErrors[field] ? styles.inputError : undefined;

  return (
    <div className={styles.container}>
      <h1>Create Ticket</h1>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass("title")}
          />
          {fieldErrors.title && (
            <span className={styles.error}>{fieldErrors.title}</span>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClass("description")}
          />
          {fieldErrors.description && (
            <span className={styles.error}>{fieldErrors.description}</span>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TicketPriority)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as TicketCategory)}
            >
              <option value="bug">Bug</option>
              <option value="feature_request">Feature Request</option>
              <option value="question">Question</option>
              <option value="account_issue">Account Issue</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="reporterName">Reporter Name *</label>
            <input
              id="reporterName"
              type="text"
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              className={inputClass("reporterName")}
            />
            {fieldErrors.reporterName && (
              <span className={styles.error}>{fieldErrors.reporterName}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="reporterEmail">Reporter Email *</label>
            <input
              id="reporterEmail"
              type="email"
              value={reporterEmail}
              onChange={(e) => setReporterEmail(e.target.value)}
              className={inputClass("reporterEmail")}
            />
            {fieldErrors.reporterEmail && (
              <span className={styles.error}>{fieldErrors.reporterEmail}</span>
            )}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="assigneeId">Assignee</label>
          <select
            id="assigneeId"
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
          >
            <option value="">Unassigned</option>
            {/* render one <option> per user from the fetched users list */}
            {users.map((user) => (
              <option value={user.id} key={user.id}>
                {user.displayName}
              </option>
            ))}
          </select>
        </div>

        {submitError && <span className={styles.error}>{submitError}</span>}

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Create Ticket"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className={styles.cancelButton}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
