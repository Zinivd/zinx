// =============================================================
// src/app/pages/cashbook/book/book.component.ts  — UPDATED
// =============================================================

import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CashBookService } from '../../../core/services/cashbook.service';
import { CashBook } from '../../../models';

@Component({
  selector: 'app-book',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  allBooks: CashBook[] = [];
  isLoading = false;

  searchQuery  = '';
  currentPage  = 1;
  pageSize     = 5;
  totalItems   = 0;
  lastPage     = 1;

  // Totals from meta
  totalCashIn  = 0;
  totalCashOut = 0;
  totalAmount  = 0;

  newBook = { name: '', description: '' };

  constructor(
    private cashBookService: CashBookService,
    private toastr: ToastrService,
    private router: Router,
  ) {}

  ngOnInit(): void { this.loadBooks(); }

  loadBooks(): void {
    this.isLoading = true;
    this.cashBookService.getAll({ search: this.searchQuery || undefined, page: this.currentPage, per_page: this.pageSize }).subscribe({
      next: (res) => {
        this.isLoading   = false;
        this.allBooks    = res.data;
        this.totalItems  = res.meta.total;
        this.lastPage    = res.meta.last_page;
        this.totalCashIn  = res.meta.total_cash_in  ?? 0;
        this.totalCashOut = res.meta.total_cash_out ?? 0;
        this.totalAmount  = res.meta.total_balance  ?? 0;
      },
      error: () => { this.isLoading = false; this.toastr.error('Failed to load cash books'); },
    });
  }

  get totalTransactions(): number { return this.totalItems; }

  onSearchChange(): void { this.currentPage = 1; this.loadBooks(); }
  goToPrev(): void { if (this.currentPage > 1) { this.currentPage--; this.loadBooks(); } }
  goToNext(): void { if (this.currentPage < this.lastPage) { this.currentPage++; this.loadBooks(); } }

  deleteBook(id: number): void {
    if (!confirm('Delete this cash book? All entries will also be deleted.')) return;
    this.cashBookService.delete(id).subscribe({
      next: () => { this.toastr.success('Cash book deleted'); this.loadBooks(); },
      error: () => this.toastr.error('Failed to delete cash book'),
    });
  }

  addBook(): void {
    if (!this.newBook.name.trim()) { this.toastr.error('Book name is required'); return; }
    this.cashBookService.create(this.newBook).subscribe({
      next: (res) => {
        if (res.status) {
          this.toastr.success('Cash book created');
          this.newBook = { name: '', description: '' };
          this.loadBooks();
        }
      },
      error: (err) => this.toastr.error(err?.error?.message || 'Failed to create book'),
    });
  }

  openBook(bookId: number): void {
    this.router.navigate(['/finance-cash-list'], { queryParams: { book_id: bookId } });
  }
}
