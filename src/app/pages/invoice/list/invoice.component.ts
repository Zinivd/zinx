// =============================================================
// src/app/pages/invoice/list/invoice.component.ts  — UPDATED
// =============================================================

import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from '../../../core/services/invoice.service';
import { Invoice, InvoiceStatus } from '../../../models/index';

@Component({
  selector: 'app-invoice',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css'],
})
export class InvoiceListComponent implements OnInit {
  allInvoices: Invoice[]          = [];
  selectedInvoice: Invoice | null = null;
  isLoading = false;

  searchQuery  = '';
  currentPage  = 1;
  pageSize     = 5;
  totalItems   = 0;
  lastPage     = 1;

  constructor(
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    private location: Location,
  ) {}

  ngOnInit(): void { this.loadInvoices(); }

  loadInvoices(): void {
    this.isLoading = true;
    this.invoiceService.getAll({
      search: this.searchQuery || undefined,
      page: this.currentPage,
      per_page: this.pageSize,
    }).subscribe({
      next: (res) => {
        this.isLoading    = false;
        this.allInvoices  = res.data;
        this.totalItems   = res.meta.total;
        this.lastPage     = res.meta.last_page;
      },
      error: () => { this.isLoading = false; this.toastr.error('Failed to load invoices'); },
    });
  }

  onSearchChange(): void { this.currentPage = 1; this.loadInvoices(); }
  goToPrev(): void { if (this.currentPage > 1) { this.currentPage--; this.loadInvoices(); } }
  goToNext(): void { if (this.currentPage < this.lastPage) { this.currentPage++; this.loadInvoices(); } }

  viewInvoice(inv: Invoice): void { this.selectedInvoice = inv; }

  updateStatus(id: number, status: InvoiceStatus): void {
    this.invoiceService.updateStatus(id, status).subscribe({
      next: (res) => {
        if (res.status) {
          this.toastr.success('Invoice status updated');
          this.loadInvoices();
        }
      },
      error: () => this.toastr.error('Failed to update status'),
    });
  }

  deleteInvoice(id: number): void {
    if (!confirm('Delete this invoice?')) return;
    this.invoiceService.delete(id).subscribe({
      next: () => { this.toastr.success('Invoice deleted'); this.loadInvoices(); },
      error: () => this.toastr.error('Failed to delete invoice'),
    });
  }

  goBack(): void { this.location.back(); }
}

