import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { role } from "../lib/auth";
import { getLibraryAccess, isLibraryAdmin } from "../lib/libraryRoles";

const API = import.meta.env.VITE_API_BASE_URL;
const ADMIN = `${API}/content/library/admin`;

const emptyBook = { title: "", author: "", category: "", publisher: "", isbn: "", copies: "" };
const emptyIssue = { bookTitle: "", personName: "", personType: "Student", issueDate: "", dueDate: "" };
const emptyStudent = { name: "", rollNo: "", className: "", contact: "", email: "" };
const emptyTeacher = { name: "", empId: "", department: "", contact: "", email: "" };

/* ============================================================
   DESIGN TOKENS (same as Library page)
   ============================================================ */
const tokens = {
  navy: "#0F2C4C",
  navyDeep: "#0A2138",
  brass: "#B8862E",
  paper: "#FAF7EF",
  paperCard: "#FFFFFF",
  ink: "#1B2430",
  inkSoft: "#5B6472",
  line: "#E6DFC9",
  terracotta: "#B54A32",
  sage: "#3F7D5C",
  sageBg: "#EAF3EC",
  terracottaBg: "#FBEAE4",
};

const SIDEBAR_WIDTH = 260;

/* ============================================================
   INLINE STYLES
   ============================================================ */
const styles = {
  page: {
    minHeight: "100vh",
    overflowX: "hidden",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    background: `linear-gradient(to right, ${tokens.navy} ${SIDEBAR_WIDTH}px, ${tokens.paper} ${SIDEBAR_WIDTH}px)`,
  },
  main: {
    marginLeft: SIDEBAR_WIDTH,
    marginTop: 0,
    minHeight: "100vh",
  },
  container: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "24px 24px 40px",
  },
  headerTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: 32,
    color: tokens.ink,
    margin: 0,
  },
  headerSubtitle: {
    color: tokens.inkSoft,
    marginTop: -500,
    fontSize: 15,
  },
  alert: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFF8E6",
    color: "#8A5A00",
    border: `1px solid #F0D78C`,
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 14,
    marginTop: -400,
  },
  errorAlert: {
    backgroundColor: tokens.terracottaBg,
    color: tokens.terracotta,
    border: `1px solid ${tokens.terracotta}55`,
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 14,
    marginTop: 12,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
    margin: "28px 0",
  },
  statCard: {
    backgroundColor: tokens.paperCard,
    border: `1px solid ${tokens.line}`,
    borderRadius: 14,
    padding: "20px 24px",
    position: "relative",
    overflow: "hidden",
  },
  statValue: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: 32,
    fontWeight: 600,
    color: tokens.ink,
    margin: 0,
  },
  statLabel: {
    marginTop: 6,
    fontSize: 13,
    color: tokens.inkSoft,
    fontWeight: 600,
  },
  actionsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  btnPrimary: {
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 8,
    border: "none",
    backgroundColor: tokens.navy,
    color: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnOutline: {
    padding: "10px 18px",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 8,
    border: `1.5px solid ${tokens.navy}`,
    backgroundColor: "transparent",
    color: tokens.navy,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  searchInput: {
    width: "100%",
    padding: "13px 16px",
    fontSize: 15,
    borderRadius: 10,
    border: `1px solid ${tokens.line}`,
    backgroundColor: tokens.paperCard,
    color: tokens.ink,
    outline: "none",
    boxSizing: "border-box",
    marginBottom: 20,
  },
  tableWrap: {
    backgroundColor: tokens.paperCard,
    border: `1px solid ${tokens.line}`,
    borderRadius: 14,
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14.5,
  },
  th: {
    textAlign: "left",
    padding: "14px 18px",
    backgroundColor: "#F7F3E9",
    color: tokens.inkSoft,
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: "0.03em",
    borderBottom: `1px solid ${tokens.line}`,
  },
  td: {
    padding: "14px 18px",
    borderBottom: `1px solid ${tokens.line}`,
    color: tokens.ink,
  },
  // Modal
  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(15, 44, 76, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1300,
    padding: 16,
  },
  modal: {
    backgroundColor: tokens.paperCard,
    borderRadius: 16,
    width: "100%",
    maxWidth: 520,
    boxShadow: "0 20px 40px rgba(15,44,76,0.25)",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  modalWide: {
    maxWidth: 720,
  },
  modalHeader: {
    padding: "20px 24px 8px",
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: 20,
    color: tokens.ink,
  },
  modalBody: {
    padding: "12px 24px 8px",
  },
  modalFooter: {
    padding: "16px 24px 20px",
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  formStack: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: tokens.ink,
    marginBottom: 4,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "11px 14px",
    fontSize: 14.5,
    borderRadius: 8,
    border: `1px solid ${tokens.line}`,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  },
  select: {
    width: "100%",
    padding: "11px 14px",
    fontSize: 14.5,
    borderRadius: 8,
    border: `1px solid ${tokens.line}`,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    backgroundColor: "#fff",
  },
  chip: {
    display: "inline-block",
    padding: "5px 12px",
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 20,
    backgroundColor: "#F0EDE4",
    color: tokens.ink,
    margin: "4px",
  },
  tabs: {
    display: "flex",
    gap: 4,
    borderBottom: `1px solid ${tokens.line}`,
    marginBottom: 20,
  },
  tab: {
    padding: "10px 18px",
    fontSize: 14.5,
    fontWeight: 600,
    color: tokens.inkSoft,
    background: "none",
    border: "none",
    cursor: "pointer",
    position: "relative",
    fontFamily: "inherit",
  },
  tabActive: {
    color: tokens.navy,
  },
  tabIndicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: tokens.brass,
    borderRadius: 2,
  },
  btnText: {
    padding: "9px 16px",
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    background: "none",
    color: tokens.inkSoft,
    cursor: "pointer",
    fontFamily: "inherit",
  },
};

export default function LibraryAdmins() {
  const navigate = useNavigate();
  const userRole = role();
  const access = getLibraryAccess(userRole);

  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [bookDialog, setBookDialog] = useState(false);
  const [issueDialog, setIssueDialog] = useState(false);
  const [returnDialog, setReturnDialog] = useState(false);
  const [categoryDialog, setCategoryDialog] = useState(false);
  const [peopleDialog, setPeopleDialog] = useState(false);
  const [reportsDialog, setReportsDialog] = useState(false);

  const [newBook, setNewBook] = useState(emptyBook);
  const [issueForm, setIssueForm] = useState(emptyIssue);
  const [selectedIssueId, setSelectedIssueId] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [peopleTab, setPeopleTab] = useState(0);
  const [studentForm, setStudentForm] = useState(emptyStudent);
  const [teacherForm, setTeacherForm] = useState(emptyTeacher);

  useEffect(() => {
    if (!isLibraryAdmin(userRole)) navigate("/library", { replace: true });
  }, [userRole, navigate]);

  const loadAll = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [booksRes, issuesRes, categoriesRes, studentsRes, teachersRes] = await Promise.all([
        axios.get(`${ADMIN}/books`),
        axios.get(`${ADMIN}/issues`),
        axios.get(`${ADMIN}/categories`),
        axios.get(`${ADMIN}/students`),
        axios.get(`${ADMIN}/teachers`),
      ]);
      setBooks(booksRes.data || []);
      setIssues(issuesRes.data || []);
      setCategories(categoriesRes.data || []);
      setStudents(studentsRes.data || []);
      setTeachers(teachersRes.data || []);
    } catch (err) {
      console.error(err);
      setErrorMsg("Could not load library admin data.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if (isLibraryAdmin(userRole)) loadAll();
  // }, [userRole]);

  const activeIssues = useMemo(() => issues.filter((i) => !i.returned), [issues]);
  const filteredBooks = books.filter((b) =>
    b.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = useMemo(() => {
    const totalCopies = books.reduce((sum, b) => sum + (Number(b.copies) || 0), 0);
    return {
      totalCopies,
      issued: activeIssues.length,
      available: Math.max(totalCopies - activeIssues.length, 0),
      overdue: activeIssues.filter((i) => i.dueDate && new Date(i.dueDate) < new Date()).length,
    };
  }, [books, activeIssues]);

  const saveBook = async () => {
    const { data } = await axios.post(`${ADMIN}/books`, {
      ...newBook,
      copies: Number(newBook.copies) || 1,
    });
    setBooks((prev) => [...prev, data]);
    setBookDialog(false);
    setNewBook(emptyBook);
  };

  const issueBook = async () => {
    try {
      const { data } = await axios.post(`${ADMIN}/issues`, issueForm);
      setIssues((prev) => [...prev, data]);
      setIssueDialog(false);
      setIssueForm(emptyIssue);
    } catch (err) {
      alert(err.response?.data?.message || "Issue failed");
    }
  };

  const returnBook = async () => {
    const { data } = await axios.post(`${ADMIN}/issues/${selectedIssueId}/return`);
    setIssues((prev) => prev.map((i) => (i.id === Number(selectedIssueId) ? data.issue : i)));
    setReturnDialog(false);
    setSelectedIssueId("");
    if (data.fine > 0) alert(`Fine due: ₹${data.fine}`);
  };

  if (!isLibraryAdmin(userRole)) return null;

  return (
    <div style={styles.page} className="lib-page">
      <style>{`
        @media (max-width: 900px) {
          .lib-main { margin-left: 0 !important; }
          .lib-page {
            background: ${tokens.paper} !important;
          }
        }
      `}</style>

      <Navbar />
      <Sidebar />

      <main className="lib-main" style={styles.main}>
        <div style={styles.container}>
          {/* Header */}
          <div>
            <h1 style={styles.headerTitle}>{access.title}</h1>
            <p style={styles.headerSubtitle}>{access.subtitle}</p>
          </div>

          <div style={styles.alert}>
            ⚠️ Admin only: manage inventory and transactions. Students/teachers use the user Library page.
          </div>

          {errorMsg && <div style={styles.errorAlert}>{errorMsg}</div>}

          {/* Stats */}
          <div style={styles.statsGrid}>
            {[
              ["Total Copies", stats.totalCopies],
              ["Issued", stats.issued],
              ["Available", stats.available],
              ["Overdue", stats.overdue],
            ].map(([label, value]) => (
              <div key={label} style={styles.statCard}>
                <p style={styles.statValue}>{value}</p>
                <p style={styles.statLabel}>{label}</p>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={styles.actionsRow}>
            <button style={styles.btnPrimary} onClick={() => setBookDialog(true)}>
              + Add Book
            </button>
            <button style={styles.btnOutline} onClick={() => setIssueDialog(true)}>
              Issue Book
            </button>
            <button style={styles.btnOutline} onClick={() => setReturnDialog(true)}>
              Return Book
            </button>
            <button style={styles.btnOutline} onClick={() => setCategoryDialog(true)}>
              Categories
            </button>
            <button style={styles.btnOutline} onClick={() => setPeopleDialog(true)}>
              Students & Teachers
            </button>
            <button style={styles.btnOutline} onClick={() => setReportsDialog(true)}>
              Reports
            </button>
            <button style={styles.btnOutline} onClick={loadAll}>
              ↻ Refresh
            </button>
          </div>

          {/* Search */}
          <input
            style={styles.searchInput}
            placeholder="Search inventory by title…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Books Table */}
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Author</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Copies</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td style={styles.td}>{book.title}</td>
                    <td style={styles.td}>{book.author}</td>
                    <td style={styles.td}>{book.category}</td>
                    <td style={styles.td}>{book.copies}</td>
                  </tr>
                ))}
                {!loading && filteredBooks.length === 0 && (
                  <tr>
                    <td style={styles.td} colSpan={4}>
                      No books found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* ========== ADD BOOK DIALOG ========== */}
      {bookDialog && (
        <div style={styles.overlay} onClick={() => setBookDialog(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>Add Book</div>
            <div style={styles.modalBody}>
              <div style={styles.formStack}>
                {["title", "author", "category", "publisher", "isbn", "copies"].map((field) => (
                  <div key={field}>
                    <label style={styles.label}>{field}</label>
                    <input
                      style={styles.input}
                      value={newBook[field]}
                      onChange={(e) => setNewBook((p) => ({ ...p, [field]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.btnText} onClick={() => setBookDialog(false)}>
                Cancel
              </button>
              <button style={styles.btnPrimary} onClick={saveBook}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== ISSUE BOOK DIALOG ========== */}
      {issueDialog && (
        <div style={styles.overlay} onClick={() => setIssueDialog(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>Issue Book</div>
            <div style={styles.modalBody}>
              <div style={styles.formStack}>
                <div>
                  <label style={styles.label}>Book Title</label>
                  <input
                    style={styles.input}
                    value={issueForm.bookTitle}
                    onChange={(e) => setIssueForm((p) => ({ ...p, bookTitle: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={styles.label}>Person Name</label>
                  <input
                    style={styles.input}
                    value={issueForm.personName}
                    onChange={(e) => setIssueForm((p) => ({ ...p, personName: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={styles.label}>Person Type</label>
                  <select
                    style={styles.select}
                    value={issueForm.personType}
                    onChange={(e) => setIssueForm((p) => ({ ...p, personType: e.target.value }))}
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                </div>
                <div style={styles.formRow}>
                  <div>
                    <label style={styles.label}>Issue Date</label>
                    <input
                      type="date"
                      style={styles.input}
                      value={issueForm.issueDate}
                      onChange={(e) => setIssueForm((p) => ({ ...p, issueDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={styles.label}>Due Date</label>
                    <input
                      type="date"
                      style={styles.input}
                      value={issueForm.dueDate}
                      onChange={(e) => setIssueForm((p) => ({ ...p, dueDate: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.btnText} onClick={() => setIssueDialog(false)}>
                Cancel
              </button>
              <button style={styles.btnPrimary} onClick={issueBook}>
                Issue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== RETURN BOOK DIALOG ========== */}
      {returnDialog && (
        <div style={styles.overlay} onClick={() => setReturnDialog(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>Return Book</div>
            <div style={styles.modalBody}>
              <label style={styles.label}>Issued Book</label>
              <select
                style={styles.select}
                value={selectedIssueId}
                onChange={(e) => setSelectedIssueId(e.target.value)}
              >
                <option value="">Select</option>
                {activeIssues.map((issue) => (
                  <option key={issue.id} value={issue.id}>
                    {issue.bookTitle} — {issue.personName}
                  </option>
                ))}
              </select>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.btnText} onClick={() => setReturnDialog(false)}>
                Cancel
              </button>
              <button
                style={{
                  ...styles.btnPrimary,
                  opacity: selectedIssueId ? 1 : 0.5,
                  cursor: selectedIssueId ? "pointer" : "not-allowed",
                }}
                disabled={!selectedIssueId}
                onClick={returnBook}
              >
                Mark Returned
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== CATEGORIES DIALOG ========== */}
      {categoryDialog && (
        <div style={styles.overlay} onClick={() => setCategoryDialog(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>Categories</div>
            <div style={styles.modalBody}>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <input
                  style={{ ...styles.input, flex: 1 }}
                  placeholder="New category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                  style={styles.btnPrimary}
                  onClick={async () => {
                    const { data } = await axios.post(`${ADMIN}/categories`, { name: newCategory });
                    setCategories((prev) => [...prev, data]);
                    setNewCategory("");
                  }}
                >
                  Add
                </button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {categories.map((c) => (
                  <span key={c.id} style={styles.chip}>
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.btnText} onClick={() => setCategoryDialog(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== PEOPLE DIALOG ========== */}
      {peopleDialog && (
        <div style={styles.overlay} onClick={() => setPeopleDialog(false)}>
          <div style={{ ...styles.modal, ...styles.modalWide }} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>Students & Teachers</div>
            <div style={styles.modalBody}>
              <div style={styles.tabs}>
                {["Students", "Teachers"].map((label, i) => (
                  <button
                    key={label}
                    style={{
                      ...styles.tab,
                      ...(peopleTab === i ? styles.tabActive : {}),
                    }}
                    onClick={() => setPeopleTab(i)}
                  >
                    {label}
                    {peopleTab === i && <div style={styles.tabIndicator} />}
                  </button>
                ))}
              </div>

              {peopleTab === 0 ? (
                <div style={styles.formStack}>
                  <div style={styles.formRow}>
                    {Object.keys(emptyStudent).map((key) => (
                      <div key={key}>
                        <label style={styles.label}>{key}</label>
                        <input
                          style={styles.input}
                          value={studentForm[key]}
                          onChange={(e) =>
                            setStudentForm((p) => ({ ...p, [key]: e.target.value }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    style={styles.btnPrimary}
                    onClick={async () => {
                      const { data } = await axios.post(`${ADMIN}/students`, studentForm);
                      setStudents((prev) => [...prev, data]);
                      setStudentForm(emptyStudent);
                    }}
                  >
                    Add Student
                  </button>
                </div>
              ) : (
                <div style={styles.formStack}>
                  <div style={styles.formRow}>
                    {Object.keys(emptyTeacher).map((key) => (
                      <div key={key}>
                        <label style={styles.label}>{key}</label>
                        <input
                          style={styles.input}
                          value={teacherForm[key]}
                          onChange={(e) =>
                            setTeacherForm((p) => ({ ...p, [key]: e.target.value }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    style={styles.btnPrimary}
                    onClick={async () => {
                      const { data } = await axios.post(`${ADMIN}/teachers`, teacherForm);
                      setTeachers((prev) => [...prev, data]);
                      setTeacherForm(emptyTeacher);
                    }}
                  >
                    Add Teacher
                  </button>
                </div>
              )}
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.btnText} onClick={() => setPeopleDialog(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== REPORTS DIALOG ========== */}
      {reportsDialog && (
        <div style={styles.overlay} onClick={() => setReportsDialog(false)}>
          <div style={{ ...styles.modal, ...styles.modalWide }} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>Issued Books Report</div>
            <div style={styles.modalBody}>
              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Book</th>
                      <th style={styles.th}>Issued To</th>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeIssues.map((issue) => (
                      <tr key={issue.id}>
                        <td style={styles.td}>{issue.bookTitle}</td>
                        <td style={styles.td}>{issue.personName}</td>
                        <td style={styles.td}>{issue.personType}</td>
                        <td style={styles.td}>{issue.dueDate || "-"}</td>
                      </tr>
                    ))}
                    {activeIssues.length === 0 && (
                      <tr>
                        <td style={styles.td} colSpan={4}>
                          No active issues.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.btnText} onClick={() => setReportsDialog(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}