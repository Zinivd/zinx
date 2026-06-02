// =============================================================
// src/app/core/constants/api-endpoints.ts
// Single source of truth for ALL backend API endpoints.
// Import this wherever you need an endpoint URL.
// =============================================================

import { environment } from "./environment";

const BASE = environment.apiUrl;

export const API_ENDPOINTS = {

  // ── Auth ─────────────────────────────────────────────────
  AUTH: {
    LOGIN:    `${BASE}/auth/login`,
    LOGOUT:   `${BASE}/auth/logout`,
    ME:       `${BASE}/auth/me`,
    REFRESH:  `${BASE}/auth/refresh`,
  },

  // ── Dashboard ────────────────────────────────────────────
  DASHBOARD: {
    INDEX: `${BASE}/dashboard`,
  },

  // ── Employees ────────────────────────────────────────────
  EMPLOYEES: {
    INDEX:         `${BASE}/employees`,          // GET (list + search)
    ALL:           `${BASE}/employees/all`,       // GET (dropdown, no pagination)
    CREATE:        `${BASE}/employees`,           // POST
    SHOW:      (id: number | string) => `${BASE}/employees/${id}`,   // GET
    UPDATE:    (id: number | string) => `${BASE}/employees/${id}`,   // POST (multipart)
    DELETE:    (id: number | string) => `${BASE}/employees/${id}`,   // DELETE
    TOGGLE:    (id: number | string) => `${BASE}/employees/${id}/toggle-status`, // PATCH
  },

  // ── Projects ─────────────────────────────────────────────
  PROJECTS: {
    INDEX:         `${BASE}/projects`,
    ALL:           `${BASE}/projects/all`,        // for task dropdown
    CREATE:        `${BASE}/projects`,
    SHOW:      (id: number | string) => `${BASE}/projects/${id}`,
    UPDATE:    (id: number | string) => `${BASE}/projects/${id}`,
    DELETE:    (id: number | string) => `${BASE}/projects/${id}`,
    TOGGLE:    (id: number | string) => `${BASE}/projects/${id}/toggle-status`,
  },

  // ── Tasks ────────────────────────────────────────────────
  TASKS: {
    INDEX:         `${BASE}/tasks`,
    CREATE:        `${BASE}/tasks`,
    SHOW:      (id: number | string) => `${BASE}/tasks/${id}`,
    UPDATE:    (id: number | string) => `${BASE}/tasks/${id}`,
    DELETE:    (id: number | string) => `${BASE}/tasks/${id}`,
  },

  // ── Cash Books ───────────────────────────────────────────
  CASH_BOOKS: {
    INDEX:         `${BASE}/cash-books`,
    CREATE:        `${BASE}/cash-books`,
    SHOW:      (id: number | string) => `${BASE}/cash-books/${id}`,
    DELETE:    (id: number | string) => `${BASE}/cash-books/${id}`,
    // Entries (nested under a book)
    ENTRIES:   (bookId: number | string) => `${BASE}/cash-books/${bookId}/entries`,
    ADD_ENTRY: (bookId: number | string) => `${BASE}/cash-books/${bookId}/entries`,
    DEL_ENTRY: (bookId: number | string, entryId: number | string) =>
                  `${BASE}/cash-books/${bookId}/entries/${entryId}`,
  },

  // ── Invoices ─────────────────────────────────────────────
  INVOICES: {
    INDEX:         `${BASE}/invoices`,
    CREATE:        `${BASE}/invoices`,
    SHOW:      (id: number | string) => `${BASE}/invoices/${id}`,
    UPDATE_STATUS: (id: number | string) => `${BASE}/invoices/${id}/status`,
    DELETE:    (id: number | string) => `${BASE}/invoices/${id}`,
  },

  // ── Profile ──────────────────────────────────────────────
  PROFILE: {
    SHOW:            `${BASE}/profile`,
    UPDATE:          `${BASE}/profile`,
    CHANGE_PASSWORD: `${BASE}/profile/change-password`,
  },
};
