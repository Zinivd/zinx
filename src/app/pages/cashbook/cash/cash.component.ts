
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CashBookService } from '../../../core/services/cashbook.service';
import { CashBook, CashEntry } from '../../../models/index';
// import { CashEntry, CashBook

@Component({
  selector: 'app-cash',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css'],
})
export class CashComponent implements OnInit {
  bookId: number | null = null;
  currentBook: CashBook | null = null;

  allEntries: CashEntry[] = [];
  isLoading = false;

  searchQuery  = '';
  currentPage  = 1;
  pageSize     = 5;
  totalItems   = 0;
  lastPage     = 1;

  // Summary from meta
  cashIn  = 0;
  cashOut = 0;
  balance = 0;

  newEntry = {
    date: '', time: '', vendor: '',
    payment_mode: 'UPI' as 'UPI' | 'NetBanking' | 'Cash' | 'Cheque',
    category: 'Cash In' as 'Cash In' | 'Cash Out',
    amount: null as number | null,
    note: '',
  };

  constructor(
    private cashBookService: CashBookService,
    private toastr: ToastrService,
    private location: Location,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.bookId = params['book_id'] ? +params['book_id'] : null;
      if (this.bookId) {
        this.loadBook();
        this.loadEntries();
      }
    });
  }

  loadBook(): void {
    if (!this.bookId) return;
    this.cashBookService.getById(this.bookId).subscribe({
      next: (res) => { if (res.status) this.currentBook = res.data ?? null; },
    });
  }

  loadEntries(): void {
    if (!this.bookId) return;
    this.isLoading = true;
    this.cashBookService.getEntries(this.bookId, {
      search: this.searchQuery || undefined,
      page: this.currentPage,
      per_page: this.pageSize,
    }).subscribe({
      next: (res) => {
        this.isLoading  = false;
        this.allEntries = res.data;
        this.totalItems = res.meta.total;
        this.lastPage   = res.meta.last_page;
        this.cashIn  = res.meta.cash_in  ?? 0;
        this.cashOut = res.meta.cash_out ?? 0;
        this.balance = res.meta.balance  ?? 0;
      },
      error: () => { this.isLoading = false; this.toastr.error('Failed to load entries'); },
    });
  }

  onSearchChange(): void { this.currentPage = 1; this.loadEntries(); }
  goToPrev(): void { if (this.currentPage > 1) { this.currentPage--; this.loadEntries(); } }
  goToNext(): void { if (this.currentPage < this.lastPage) { this.currentPage++; this.loadEntries(); } }

  openModal(category: 'Cash In' | 'Cash Out'): void {
    const now = new Date();
    this.newEntry = {
      date: now.toISOString().split('T')[0],
      time: this.formatTime(now),
      amount: null, vendor: '', payment_mode: 'UPI', category, note: '',
    };
  }

  addEntry(): void {
    if (!this.bookId) return;
    if (!this.newEntry.amount || this.newEntry.amount <= 0) { this.toastr.error('Please enter a valid amount'); return; }

    this.cashBookService.addEntry(this.bookId, {
      date: this.newEntry.date,
      time: this.newEntry.time,
      vendor: this.newEntry.vendor || undefined,
      payment_mode: this.newEntry.payment_mode,
      category: this.newEntry.category,
      amount: this.newEntry.amount,
      note: this.newEntry.note || undefined,
    }).subscribe({
      next: (res) => {
        if (res.status) {
          this.toastr.success(`${this.newEntry.category} added successfully`);
          this.loadEntries();
          this.loadBook(); // refresh balance
        }
      },
      error: (err) => this.toastr.error(err?.error?.message || 'Failed to add entry'),
    });
  }

  deleteEntry(id: number): void {
    if (!this.bookId) return;
    if (!confirm('Delete this entry?')) return;
    this.cashBookService.deleteEntry(this.bookId, id).subscribe({
      next: () => { this.toastr.success('Entry deleted'); this.loadEntries(); this.loadBook(); },
      error: () => this.toastr.error('Failed to delete entry'),
    });
  }

  private formatTime(d: Date): string {
    let h = d.getHours(); const m = String(d.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    return `${String(h).padStart(2,'0')}:${m} ${ampm}`;
  }

  goBack(): void { this.location.back(); }
}
