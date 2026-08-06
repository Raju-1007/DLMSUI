export const LIBRARY_ACCESS = {
  ADMIN: {
    route: "/libraryAdmin",
    title: "Library Management",
    subtitle: "Manage inventory, issue/return books, categories, members & reports",
    canAccessAdmin: true,
    canAccessUser: false,
    maxBooks: null,
    maxBorrowDays: null,
    permissions: [
      "Add new books & copies",
      "Manage categories",
      "Register students & teachers",
      "Issue books manually",
      "Accept returns & calculate fines",
      "View all issued books & reports",
    ],
  },
  SUPER_ADMIN: {
    route: "/libraryAdmin",
    title: "Library Management",
    subtitle: "Manage inventory, issue/return books, categories, members & reports",
    canAccessAdmin: true,
    canAccessUser: false,
    maxBooks: null,
    maxBorrowDays: null,
    permissions: [
      "Add new books & copies",
      "Manage categories",
      "Register students & teachers",
      "Issue books manually",
      "Accept returns & calculate fines",
      "View all issued books & reports",
    ],
  },
  STUDENT: {
    route: "/librarey",
    title: "Library",
    subtitle: "Browse catalog, borrow, read, return & pay fines",
    canAccessAdmin: false,
    canAccessUser: true,
    maxBooks: 3,
    maxBorrowDays: 14,
    permissions: [
      "Browse & search books",
      "Borrow up to 3 books",
      "Reserve unavailable books",
      "Read borrowed books online",
      "Return books",
      "Pay overdue fines",
    ],
  },
  TEACHER: {
    route: "/librarey",
    title: "Library",
    subtitle: "Browse catalog, borrow, read, return & pay fines",
    canAccessAdmin: false,
    canAccessUser: true,
    maxBooks: 5,
    maxBorrowDays: 14,
    permissions: [
      "Browse & search books",
      "Borrow up to 5 books",
      "Reserve unavailable books",
      "Read borrowed books online",
      "Return books",
      "Pay overdue fines",
    ],
  },
};

export function getLibraryAccess(role) {
  return LIBRARY_ACCESS[role] || LIBRARY_ACCESS.STUDENT;
}

export function isLibraryAdmin(role) {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

export function isLibraryUser(role) {
  return role === "STUDENT" || role === "TEACHER";
}
