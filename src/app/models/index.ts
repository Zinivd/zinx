// =============================================================
// src/app/core/models/index.ts
// All shared TypeScript interfaces matching the backend responses.
// =============================================================

// ── Generic API Response ─────────────────────────────────────
export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  status: boolean;
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  // optional extra totals (cash books, etc.)
  total_cash_in?: number;
  total_cash_out?: number;
  total_balance?: number;
  cash_in?: number;
  cash_out?: number;
  balance?: number;
}

// ── Auth ─────────────────────────────────────────────────────
export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  designation: string | null;
  profile_image: string | null;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}

export interface JwtPayload {
  user_id: number;
  name: string;
  email: string;
  phone: string | null;
  iat: number;
  exp: number;
}

// ── Employee ─────────────────────────────────────────────────
export interface Employee {
  id: number;
  name: string;
  designation: string;
  email: string;
  contact: string;
  address: string;
  pay_type: 'Monthly' | 'Weekly' | 'Daily' | 'Hourly';
  salary: number;
  aadhar_card: string | null;
  profile_image: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface EmployeePayload {
  name: string;
  designation: string;
  email: string;
  contact: string;
  address: string;
  pay_type?: string;
  salary?: number | string;
  aadhar_card?: string;
  profile_image?: File | null;
}

export interface EmployeeDropdown {
  id: number;
  name: string;
  designation?: string;
}

// ── Project ──────────────────────────────────────────────────
export interface Project {
  id: number;
  name: string;
  client_name: string;
  email: string | null;
  contact: string | null;
  address: string | null;
  gst_no: string | null;
  quotation: number;
  type: 'Fixed' | 'Hourly' | 'Monthly';
  deadline: string | null;
  is_active: boolean;
  created_at?: string;
}

export interface ProjectPayload {
  name: string;
  client_name: string;
  email?: string;
  contact?: string;
  address?: string;
  gst_no?: string;
  quotation?: number | string;
  type?: string;
  deadline?: string;
}

export interface ProjectDropdown {
  id: number;
  name: string;
  client_name: string;
}

// ── Task ─────────────────────────────────────────────────────
export type TaskStatus = 'Opened' | 'In Progress' | 'Completed' | 'Closed';

export interface Task {
  id: number;
  name: string;
  project_id: number;
  project: { id: number; name: string } | null;
  employees: { id: number; name: string; profile_image: string | null }[];
  employee_ids: number[];
  start_date: string | null;
  end_date: string | null;
  status: TaskStatus;
  description: string | null;
  created_at?: string;
}

export interface TaskPayload {
  name: string;
  project_id: number | string;
  employees: number[];
  start_date?: string;
  end_date?: string;
  status?: string;
  description?: string;
}

// ── Cash Book ────────────────────────────────────────────────
export interface CashBook {
  id: number;
  name: string;
  description: string | null;
  cash_in: number;
  cash_out: number;
  balance: number;
  created_at?: string;
}

export interface CashBookPayload {
  name: string;
  description?: string;
}

// ── Cash Entry ───────────────────────────────────────────────
export type PaymentMode = 'UPI' | 'NetBanking' | 'Cash' | 'Cheque';
export type CashCategory = 'Cash In' | 'Cash Out';

export interface CashEntry {
  id: number;
  cash_book_id: number;
  date: string;
  time: string;
  vendor: string | null;
  payment_mode: PaymentMode;
  category: CashCategory;
  amount: number;
  note: string | null;
  created_at?: string;
}

export interface CashEntryPayload {
  date: string;
  time: string;
  vendor?: string;
  payment_mode: PaymentMode;
  category: CashCategory;
  amount: number;
  note?: string;
}

// ── Invoice ──────────────────────────────────────────────────
export type InvoiceStatus = 'Paid' | 'Pending' | 'Cancelled';

export interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  id: number;
  invoice_id: string;
  receipt_no: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  customer_gst: string | null;
  invoice_date: string;
  due_date: string | null;
  sub_total: number;
  tax_percent: number;
  tax_amount: number;
  discount: number;
  total_amount: number;
  status: InvoiceStatus;
  notes: string | null;
  project_id: number | null;
  items: InvoiceItem[];
  created_at?: string;
}

export interface InvoicePayload {
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  customer_gst?: string;
  invoice_date: string;
  due_date?: string;
  tax_percent?: number;
  discount?: number;
  status?: InvoiceStatus;
  notes?: string;
  project_id?: number;
  items: Omit<InvoiceItem, 'id' | 'amount'>[];
}

// ── Profile ──────────────────────────────────────────────────
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  designation: string | null;
  address: string | null;
  profile_image: string | null;
}

export interface ProfileUpdatePayload {
  name?: string;
  phone?: string;
  designation?: string;
  address?: string;
  profile_image?: File | null;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

// ── Dashboard ────────────────────────────────────────────────
export interface DashboardData {
  employees: { total: number };
  projects:  { total: number };
  tasks: {
    total: number;
    open: number;
    in_progress: number;
    completed: number;
  };
  invoices: {
    total: number;
    paid: number;
    pending: number;
    revenue: number;
  };
  finance: { cash_balance: number };
  recent_projects: any[];
  recent_tasks: any[];
}
