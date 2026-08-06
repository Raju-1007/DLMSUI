import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useMessage } from "../context/MessageContext";
import { role } from "../lib/auth";
import { getLibraryAccess, isLibraryAdmin } from "../lib/libraryRoles";

const API = import.meta.env.VITE_API_BASE_URL;
const LIBRARY = `${API}/content/library`;

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
const tokens = {
  navy: "#0F2C4C",
  navyDeep: "#0A2138",
  brass: "#B8862E",
  brassLight: "#E7C989",
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
const NAVBAR_HEIGHT = -400;

const SPINE_PALETTE = [tokens.navy, tokens.brass, tokens.sage, tokens.terracotta, "#6B4C9A", "#2E7D8C"];

function spineColor(category) {
  const str = category || "General";
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return SPINE_PALETTE[Math.abs(hash) % SPINE_PALETTE.length];
}

function callNumber(category, id) {
  const prefix = (category || "GEN").replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase() || "GEN";
  return `${prefix}·${String(id ?? 0).padStart(3, "0")}`;
}

/* ============================================================
   INLINE STYLES (manual CSS)
   ============================================================ */
const styles = {
  page: {
    backgroundColor: tokens.paper,
    minHeight: "100vh",
    overflowX: "hidden",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  main: {
    marginLeft: SIDEBAR_WIDTH,
    marginTop: NAVBAR_HEIGHT,
    minHeight: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
    overflow: "visible",
  },
  container: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "32px 24px",
  },
  headerTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 700,
    fontSize: 34,
    color: tokens.ink,
    margin: 0,
  },
  headerSubtitle: {
    color: tokens.inkSoft,
    marginTop: 6,
    fontSize: 15,
  },
  alert: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#EFF4FA",
    color: tokens.navy,
    border: `1px solid ${tokens.line}`,
    borderRadius: 10,
    padding: "12px 16px",
    fontSize: 14,
    marginTop: 16,
  },
  searchWrap: {
    position: "relative",
    marginTop: 20,
  },
  searchInput: {
    width: "100%",
    padding: "14px 16px 14px 44px",
    fontSize: 15,
    borderRadius: 12,
    border: `1px solid ${tokens.line}`,
    backgroundColor: tokens.paperCard,
    color: tokens.ink,
    outline: "none",
    boxSizing: "border-box",
  },
  searchIcon: {
    position: "absolute",
    left: 14,
    top: "50%",
    transform: "translateY(-50%)",
    color: tokens.inkSoft,
    fontSize: 18,
    pointerEvents: "none",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
    margin: "28px 0",
  },
  statCard: {
    position: "relative",
    backgroundColor: tokens.paperCard,
    border: `1px solid ${tokens.line}`,
    borderRadius: 14,
    padding: "20px 20px 20px 28px",
    overflow: "hidden",
  },
  statAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  statValue: {
    fontFamily: "'Lora', Georgia, serif",
    fontSize: 34,
    fontWeight: 600,
    color: tokens.ink,
    lineHeight: 1,
    margin: 0,
  },
  statLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: tokens.inkSoft,
  },
  tabs: {
    display: "flex",
    gap: 4,
    borderBottom: `1px solid ${tokens.line}`,
    marginBottom: 24,
  },
  tab: {
    padding: "12px 18px",
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
  categoryRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    padding: "6px 14px",
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 8,
    border: `1px solid ${tokens.line}`,
    backgroundColor: tokens.paperCard,
    color: tokens.ink,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  chipActive: {
    backgroundColor: tokens.navy,
    color: "#fff",
    borderColor: tokens.navy,
  },
  booksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 20,
  },
  bookCard: {
    display: "flex",
    backgroundColor: tokens.paperCard,
    border: `1px solid ${tokens.line}`,
    borderRadius: 14,
    overflow: "hidden",
    transition: "transform 0.18s ease, box-shadow 0.18s ease",
    height: "100%",
  },
  bookSpine: {
    width: 8,
    flexShrink: 0,
  },
  bookBody: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: "16px 16px 12px",
  },
  bookTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  callNumber: {
    fontFamily: "monospace",
    fontSize: 11,
    letterSpacing: "0.04em",
    color: tokens.inkSoft,
    backgroundColor: tokens.paper,
    padding: "2px 6px",
    borderRadius: 4,
  },
  bookTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 600,
    fontSize: 17,
    lineHeight: 1.3,
    color: tokens.ink,
    margin: "0 0 4px",
  },
  bookAuthor: {
    fontSize: 13.5,
    color: tokens.inkSoft,
    marginBottom: 10,
  },
  bookCategory: {
    display: "inline-block",
    fontSize: 11.5,
    fontWeight: 600,
    padding: "3px 8px",
    borderRadius: 6,
    marginBottom: 10,
  },
  bookCopies: {
    fontSize: 12.5,
    fontWeight: 600,
    marginBottom: 12,
  },
  bookActions: {
    marginTop: "auto",
    paddingTop: 4,
  },
  btnPrimary: {
    width: "100%",
    padding: "9px 12px",
    fontSize: 13.5,
    fontWeight: 600,
    borderRadius: 8,
    border: "none",
    backgroundColor: tokens.navy,
    color: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnPrimaryDisabled: {
    backgroundColor: tokens.line,
    color: tokens.inkSoft,
    cursor: "not-allowed",
  },
  btnOutline: {
    width: "100%",
    padding: "9px 12px",
    fontSize: 13.5,
    fontWeight: 600,
    borderRadius: 8,
    border: `1.5px solid ${tokens.brass}`,
    backgroundColor: "transparent",
    color: tokens.brass,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  emptyState: {
    textAlign: "center",
    padding: "64px 24px",
    borderRadius: 14,
    border: `1px dashed ${tokens.line}`,
    backgroundColor: tokens.paperCard,
  },
  emptyTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 600,
    fontSize: 18,
    color: tokens.ink,
    margin: "12px 0 4px",
  },
  emptySubtitle: {
    color: tokens.inkSoft,
    fontSize: 14,
  },
  myBookCard: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: tokens.paperCard,
    border: `1px solid ${tokens.line}`,
    borderRadius: 14,
    padding: "16px 20px",
    marginBottom: 12,
    gap: 12,
  },
  myBookTitle: {
    fontFamily: "'Lora', Georgia, serif",
    fontWeight: 600,
    fontSize: 17,
    color: tokens.ink,
    margin: 0,
  },
  myBookMeta: {
    fontSize: 13.5,
    color: tokens.inkSoft,
    marginTop: 4,
  },
  myBookActions: {
    display: "flex",
    gap: 8,
  },
  btnText: {
    padding: "8px 14px",
    fontSize: 13.5,
    fontWeight: 600,
    border: "none",
    background: "none",
    color: tokens.navy,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  btnSoft: {
    padding: "8px 14px",
    fontSize: 13.5,
    fontWeight: 600,
    borderRadius: 8,
    border: `1px solid ${tokens.line}`,
    backgroundColor: "transparent",
    color: tokens.ink,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  fineCard: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 14,
    padding: "16px 20px",
    marginBottom: 12,
    gap: 12,
  },
  fineAmount: {
    fontWeight: 700,
    fontSize: 18,
    marginTop: 6,
  },
  btnDanger: {
    padding: "9px 18px",
    fontSize: 13.5,
    fontWeight: 600,
    borderRadius: 8,
    border: "none",
    backgroundColor: tokens.terracotta,
    color: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
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
    maxWidth: 480,
    boxShadow: "0 20px 40px rgba(15,44,76,0.25)",
    overflow: "hidden",
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
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 15,
    borderRadius: 10,
    border: `1px solid ${tokens.line}`,
    outline: "none",
    boxSizing: "border-box",
    marginTop: 8,
  },
  helper: {
    fontSize: 12.5,
    color: tokens.inkSoft,
    marginTop: 6,
  },
  loading: {
    display: "flex",
    justifyContent: "center",
    padding: "64px 0",
  },
  spinner: {
    width: 40,
    height: 40,
    border: `3px solid ${tokens.line}`,
    borderTopColor: tokens.brass,
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
};

/* ============================================================
   SMALL COMPONENTS
   ============================================================ */
function StatCard({ label, value, accent }) {
  return (
    <div style={styles.statCard}>
      <div style={{ ...styles.statAccent, backgroundColor: accent }} />
      <p style={styles.statValue}>{value}</p>
      <p style={styles.statLabel}>{label}</p>
    </div>
  );
}

function BookCard({ book, canBorrowMore, onBorrow, onReserve }) {
  const accent = spineColor(book.categoryName);
  const isAvailable = book.canBorrow;

  return (
    <div
      style={styles.bookCard}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 12px 24px -12px rgba(15,44,76,0.28)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={{ ...styles.bookSpine, backgroundColor: accent }} />
      <div style={styles.bookBody}>
        <div style={styles.bookTop}>
          <span style={{ color: accent, fontSize: 18 }}>📖</span>
          <span style={styles.callNumber}>{callNumber(book.categoryName, book.id)}</span>
        </div>

        <h3 style={styles.bookTitle}>{book.title}</h3>
        <p style={styles.bookAuthor}>{book.authorName}</p>

        <span
          style={{
            ...styles.bookCategory,
            backgroundColor: `${accent}1A`,
            color: accent,
          }}
        >
          {book.categoryName}
        </span>

        <p
          style={{
            ...styles.bookCopies,
            color: isAvailable ? tokens.sage : tokens.inkSoft,
          }}
        >
          {book.availableCopies}/{book.totalCopies} on shelf
        </p>

        <div style={styles.bookActions}>
          {isAvailable ? (
            <button
              style={{
                ...styles.btnPrimary,
                ...(canBorrowMore ? {} : styles.btnPrimaryDisabled),
              }}
              disabled={!canBorrowMore}
              onClick={() => onBorrow(book)}
            >
              Borrow
            </button>
          ) : (
            <button style={styles.btnOutline} onClick={() => onReserve(book)}>
              Reserve
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={styles.emptyState}>
      <div style={{ fontSize: 40, color: tokens.inkSoft }}>{icon}</div>
      <p style={styles.emptyTitle}>{title}</p>
      <p style={styles.emptySubtitle}>{subtitle}</p>
    </div>
  );
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function Library() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useMessage();
  const login = useSelector((state) => state.auth.user);

  const userRole = role();
  const access = getLibraryAccess(userRole);

  const userId = login?.loginId || login?.userDetails?.loginid;
  const userName = login?.userDetails?.fullName || login?.fullName || "User";
  const userEmail = login?.userDetails?.email || login?.email || "";

  const [tab, setTab] = useState(0);
  const [books, setBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [fines, setFines] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState(["All"]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(false);
  const [borrowModal, setBorrowModal] = useState(null);
  const [durationDays, setDurationDays] = useState(7);
  const [readModal, setReadModal] = useState(null);

  useEffect(() => {
    if (isLibraryAdmin(userRole)) navigate("/libraryAdmins", { replace: true });
  }, [userRole, navigate]);

  const fetchBooks = useCallback(async () => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (selectedCategory !== "All") params.category = selectedCategory;
    const { data } = await axios.get(`${LIBRARY}/books`, { params });
    setBooks(data || []);
  }, [search, selectedCategory]);

  const refreshAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const [booksRes, statsRes, myRes, finesRes, resRes, catRes] = await Promise.all([
        axios.get(`${LIBRARY}/books`, {
          params: {
            ...(search.trim() ? { search: search.trim() } : {}),
            ...(selectedCategory !== "All" ? { category: selectedCategory } : {}),
          },
        }),
        axios.get(`${LIBRARY}/stats/${userId}`),
        axios.get(`${LIBRARY}/my-books/${userId}`),
        axios.get(`${LIBRARY}/fines/${userId}`),
        axios.get(`${LIBRARY}/reservations/${userId}`),
        axios.get(`${LIBRARY}/categories`),
      ]);
      setBooks(booksRes.data || []);
      setStats(statsRes.data);
      setMyBooks(myRes.data || []);
      setFines(finesRes.data || []);
      setReservations(resRes.data || []);
      setCategories(["All", ...(catRes.data || [])]);
    } catch (err) {
      console.error(err);
      showError("Failed to load library data.");
    } finally {
      setLoading(false);
    }
  }, [userId, search, selectedCategory, showError]);

  useEffect(() => {
    refreshAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeBorrowed = useMemo(() => myBooks.filter((b) => b.status === "ISSUED"), [myBooks]);
  const unpaidFines = useMemo(() => fines.filter((f) => !f.paid), [fines]);
  const canBorrowMore = activeBorrowed.length < access.maxBooks;

  const handleBorrow = async () => {
    if (!userId || !borrowModal) return;
    if (!canBorrowMore) return showError(`Max ${access.maxBooks} books allowed.`);
    try {
      await axios.post(`${LIBRARY}/borrow`, {
        studentId: Number(userId),
        studentName: userName,
        studentEmail: userEmail,
        userRole,
        bookId: borrowModal.id,
        durationDays: Number(durationDays),
      });
      showSuccess(`"${borrowModal.title}" borrowed.`);
      setBorrowModal(null);
      refreshAll();
    } catch (err) {
      showError(err.response?.data?.message || err.response?.data || "Borrow failed.");
    }
  };

  const handleReserve = async (book) => {
    try {
      await axios.post(`${LIBRARY}/reserve`, {
        studentId: Number(userId),
        studentName: userName,
        studentEmail: userEmail,
        userRole,
        bookId: book.id,
      });
      showSuccess(`"${book.title}" reserved.`);
      refreshAll();
    } catch (err) {
      showError(err.response?.data?.message || err.response?.data || "Reserve failed.");
    }
  };

  const handleReturn = async (issue) => {
    try {
      await axios.post(`${LIBRARY}/return`, {
        issueId: issue.issueId,
        studentId: Number(userId),
      });
      showSuccess("Book returned.");
      refreshAll();
    } catch (err) {
      showError(err.response?.data?.message || "Return failed.");
    }
  };

  const handlePayFine = async (fine) => {
    try {
      await axios.post(`${LIBRARY}/pay-fine`, {
        fineId: fine.fineId,
        studentId: Number(userId),
      });
      showSuccess("Fine paid.");
      refreshAll();
    } catch (err) {
      showError(err.response?.data?.message || "Payment failed.");
    }
  };

  const handleRead = async (bookId) => {
    try {
      const { data } = await axios.get(`${LIBRARY}/read/${userId}/${bookId}`);
      setReadModal(data);
    } catch (err) {
      showError(err.response?.data?.message || "Cannot open book.");
    }
  };

  if (isLibraryAdmin(userRole)) return null;

  return (
    <div style={styles.page}>
      {/* keyframes for spinner */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) {
          .lib-main { margin-left: 0 !important; }
        }
      `}</style>

      <Navbar />
      <Sidebar />

      <main className="lib-main" style={styles.main}>
        <div style={styles.container}>
          {/* Header */}
          <div>
            <h1 style={styles.headerTitle}>Library</h1>
            <p style={styles.headerSubtitle}>{access.subtitle}</p>
          </div>

          {/* Access Alert */}
          <div style={styles.alert}>
            <span style={{ color: tokens.brass, fontSize: 18 }}>📚</span>
            <span>
              <strong>{userRole}</strong> access — borrow up to{" "}
              <strong>{access.maxBooks}</strong> books for{" "}
              <strong>{access.maxBorrowDays}</strong> days.
            </span>
          </div>

          {/* Search */}
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search by title, author, or category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchBooks()}
            />
          </div>

          {/* Stats */}
          <div style={styles.statsGrid}>
            <StatCard
              label="Borrowed"
              value={stats?.borrowedCount ?? activeBorrowed.length}
              accent={tokens.navy}
            />
            <StatCard
              label="Available"
              value={stats?.availableBooks ?? 0}
              accent={tokens.sage}
            />
            <StatCard
              label="Reserved"
              value={stats?.reservedCount ?? reservations.length}
              accent={tokens.brass}
            />
            <StatCard
              label="Due Today"
              value={stats?.dueTodayCount ?? 0}
              accent={tokens.terracotta}
            />
          </div>

          {/* Tabs */}
          <div style={styles.tabs}>
            {["Browse", `My Books (${activeBorrowed.length})`, `Fines (${unpaidFines.length})`].map(
              (label, i) => (
                <button
                  key={label}
                  style={{
                    ...styles.tab,
                    ...(tab === i ? styles.tabActive : {}),
                  }}
                  onClick={() => setTab(i)}
                >
                  {label}
                  {tab === i && <div style={styles.tabIndicator} />}
                </button>
              )
            )}
          </div>

          {loading ? (
            <div style={styles.loading}>
              <div style={styles.spinner} />
            </div>
          ) : (
            <>
              {/* ===== Browse Tab ===== */}
              {tab === 0 && (
                <div>
                  <div style={styles.categoryRow}>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        style={{
                          ...styles.chip,
                          ...(selectedCategory === cat ? styles.chipActive : {}),
                        }}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {books.length === 0 ? (
                    <EmptyState
                      icon="📖"
                      title="No books match that search"
                      subtitle="Try a different title, author, or category."
                    />
                  ) : (
                    <div style={styles.booksGrid}>
                      {books.map((book) => (
                        <BookCard
                          key={book.id}
                          book={book}
                          canBorrowMore={canBorrowMore}
                          onBorrow={setBorrowModal}
                          onReserve={handleReserve}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ===== My Books Tab ===== */}
              {tab === 1 && (
                <div>
                  {activeBorrowed.length === 0 ? (
                    <EmptyState
                      icon="📚"
                      title="Nothing checked out yet"
                      subtitle="Books you borrow from the Browse tab will show up here."
                    />
                  ) : (
                    activeBorrowed.map((issue) => (
                      <div key={issue.issueId} style={styles.myBookCard}>
                        <div>
                          <h3 style={styles.myBookTitle}>{issue.title}</h3>
                          <p style={styles.myBookMeta}>
                            Due {issue.dueDate} · {issue.daysRemaining} day(s) left
                          </p>
                        </div>
                        <div style={styles.myBookActions}>
                          <button style={styles.btnText} onClick={() => handleRead(issue.bookId)}>
                            Read
                          </button>
                          <button style={styles.btnSoft} onClick={() => handleReturn(issue)}>
                            ↩ Return
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ===== Fines Tab ===== */}
              {tab === 2 && (
                <div>
                  {fines.length === 0 ? (
                    <EmptyState
                      icon="💰"
                      title="No fines on your account"
                      subtitle="Return books on time to keep it that way."
                    />
                  ) : (
                    fines.map((fine) => (
                      <div
                        key={fine.fineId}
                        style={{
                          ...styles.fineCard,
                          backgroundColor: fine.paid ? tokens.paperCard : tokens.terracottaBg,
                          border: `1px solid ${fine.paid ? tokens.line : tokens.terracotta + "55"}`,
                        }}
                      >
                        <div>
                          <h3 style={styles.myBookTitle}>{fine.bookTitle}</h3>
                          <p style={styles.myBookMeta}>{fine.reason}</p>
                          <p
                            style={{
                              ...styles.fineAmount,
                              color: fine.paid ? tokens.sage : tokens.terracotta,
                            }}
                          >
                            ₹{fine.amount?.toFixed(2)}
                          </p>
                        </div>
                        {!fine.paid && (
                          <button style={styles.btnDanger} onClick={() => handlePayFine(fine)}>
                            Pay Fine
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* ===== Borrow Dialog ===== */}
      {borrowModal && (
        <div style={styles.overlay} onClick={() => setBorrowModal(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>Borrow “{borrowModal.title}”</div>
            <div style={styles.modalBody}>
              <label style={{ fontSize: 14, fontWeight: 600, color: tokens.ink }}>
                Duration (days)
              </label>
              <input
                type="number"
                style={styles.input}
                value={durationDays}
                min={1}
                max={access.maxBorrowDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
              />
              <p style={styles.helper}>Up to {access.maxBorrowDays} days for your role</p>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.btnText} onClick={() => setBorrowModal(null)}>
                Cancel
              </button>
              <button style={styles.btnPrimary} onClick={handleBorrow}>
                Confirm Borrow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Read Dialog ===== */}
      {readModal && (
        <div style={styles.overlay} onClick={() => setReadModal(null)}>
          <div
            style={{ ...styles.modal, ...styles.modalWide }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={styles.modalHeader}>{readModal.title}</div>
            <div style={styles.modalBody}>
              {readModal.pdfUrl ? (
                <iframe
                  src={readModal.pdfUrl}
                  title={readModal.title}
                  style={{
                    width: "100%",
                    height: 480,
                    border: `1px solid ${tokens.line}`,
                    borderRadius: 10,
                  }}
                />
              ) : (
                <p style={{ color: tokens.inkSoft }}>
                  {readModal.description || "No digital copy available."}
                </p>
              )}
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.btnText} onClick={() => setReadModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}