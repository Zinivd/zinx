import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

interface Invoice {
  id: number;
  invoiceId: string;
  date: string;
  amount: number;
  receiptNo: string;
  customer: string;
  status: 'Paid' | 'Pending' | 'Cancelled';
}

@Component({
  selector: 'app-invoice',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceListComponent implements OnInit {
  allInvoices: Invoice[] = [
    {
      id: 1,
      invoiceId: 'INV-001',
      date: '01-01-2024',
      amount: 1500,
      receiptNo: 'RCP-101',
      customer: 'John Doe',
      status: 'Paid',
    },
    {
      id: 2,
      invoiceId: 'INV-002',
      date: '05-01-2024',
      amount: 2300,
      receiptNo: 'RCP-102',
      customer: 'Jane Smith',
      status: 'Pending',
    },
    {
      id: 3,
      invoiceId: 'INV-003',
      date: '10-01-2024',
      amount: 800,
      receiptNo: 'RCP-103',
      customer: 'Raj Kumar',
      status: 'Paid',
    },
    {
      id: 4,
      invoiceId: 'INV-004',
      date: '15-01-2024',
      amount: 4200,
      receiptNo: 'RCP-104',
      customer: 'Alice Brown',
      status: 'Cancelled',
    },
    {
      id: 5,
      invoiceId: 'INV-005',
      date: '20-01-2024',
      amount: 950,
      receiptNo: 'RCP-105',
      customer: 'Bob Wilson',
      status: 'Pending',
    },
    {
      id: 6,
      invoiceId: 'INV-006',
      date: '25-01-2024',
      amount: 3100,
      receiptNo: 'RCP-106',
      customer: 'Sara Lee',
      status: 'Paid',
    },
  ];

  // Search
  searchQuery: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;

  constructor(
    private toastr: ToastrService,
    private location: Location,
  ) {}

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }

  // Filtering
  get filteredInvoices(): Invoice[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.allInvoices;
    return this.allInvoices.filter(
      (inv) =>
        inv.invoiceId.toLowerCase().includes(q) ||
        inv.customer.toLowerCase().includes(q) ||
        inv.status.toLowerCase().includes(q) ||
        inv.receiptNo.toLowerCase().includes(q) ||
        inv.date.includes(q),
    );
  }

  get paginatedInvoices(): Invoice[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredInvoices.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredInvoices.length / this.pageSize) || 1;
  }

  // Actions
  onSearchChange(): void {
    this.currentPage = 1;
  }

  goToPrev(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  goToNext(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  deleteInvoice(id: number): void {
    this.allInvoices = this.allInvoices.filter((inv) => inv.id !== id);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.toastr.success('Invoice deleted successfully');
  }
}
