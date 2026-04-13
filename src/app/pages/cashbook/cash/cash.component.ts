import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

interface CashEntry {
  id: number;
  date: string;
  time: string;
  vendor: string;
  paymentMode: 'UPI' | 'NetBanking';
  category: 'Cash In' | 'Cash Out';
  amount: number;
}

@Component({
  selector: 'app-cash',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './cash.component.html',
  styleUrls: ['./cash.component.css'],
})
export class CashComponent implements OnInit {
  allEntries: CashEntry[] = [
    {
      id: 1,
      date: '01-01-2021',
      time: '12:00 AM',
      vendor: 'Vendor 1',
      paymentMode: 'UPI',
      category: 'Cash In',
      amount: 100,
    },
    {
      id: 2,
      date: '02-01-2021',
      time: '10:00 AM',
      vendor: 'Vendor 2',
      paymentMode: 'NetBanking',
      category: 'Cash Out',
      amount: 250,
    },
    {
      id: 3,
      date: '03-01-2021',
      time: '02:00 PM',
      vendor: 'Vendor 1',
      paymentMode: 'UPI',
      category: 'Cash In',
      amount: 500,
    },
    {
      id: 4,
      date: '04-01-2021',
      time: '09:00 AM',
      vendor: 'Vendor 3',
      paymentMode: 'NetBanking',
      category: 'Cash Out',
      amount: 180,
    },
    {
      id: 5,
      date: '05-01-2021',
      time: '04:00 PM',
      vendor: 'Vendor 2',
      paymentMode: 'UPI',
      category: 'Cash In',
      amount: 700,
    },
    {
      id: 6,
      date: '06-01-2021',
      time: '11:00 AM',
      vendor: 'Vendor 4',
      paymentMode: 'NetBanking',
      category: 'Cash Out',
      amount: 90,
    },
  ];

  // Search
  searchQuery: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;

  newEntry = {
    date: '',
    time: '',
    vendor: '',
    paymentMode: 'UPI' as 'UPI' | 'NetBanking',
    category: 'Cash In' as 'Cash In' | 'Cash Out',
    amount: null as number | null,
  };

  constructor(
    private toastr: ToastrService,
    private location: Location,
  ) {}

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }

  get balance(): number {
    return this.allEntries.reduce(
      (sum, e) => (e.category === 'Cash In' ? sum + e.amount : sum - e.amount),
      0,
    );
  }

  get filteredEntries(): CashEntry[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.allEntries;
    return this.allEntries.filter(
      (e) =>
        e.vendor.toLowerCase().includes(q) ||
        e.paymentMode.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.amount.toString().includes(q) ||
        e.date.includes(q),
    );
  }

  get paginatedEntries(): CashEntry[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredEntries.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEntries.length / this.pageSize) || 1;
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

  addEntry(): void {
    if (!this.newEntry.amount || this.newEntry.amount <= 0) {
      this.toastr.error('Please enter a valid amount');
      return;
    }
    const newId = Math.max(...this.allEntries.map((e) => e.id), 0) + 1;
    this.allEntries.push({
      id: newId,
      date: this.newEntry.date,
      time: this.newEntry.time,
      vendor: this.newEntry.vendor || '-',
      paymentMode: this.newEntry.paymentMode,
      category: this.newEntry.category,
      amount: this.newEntry.amount,
    });
    const addedCategory = this.newEntry.category;
    this.toastr.success(`${addedCategory} added successfully`);
  }

  deleteEntry(id: number): void {
    this.allEntries = this.allEntries.filter((e) => e.id !== id);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.toastr.success('Entry deleted successfully');
  }

  openModal(category: 'Cash In' | 'Cash Out'): void {
    const now = new Date();
    this.newEntry = {
      date: this.formatDate(now),
      time: this.formatTime(now),
      amount: null,
      vendor: '',
      paymentMode: 'UPI',
      category: category,
    };
  }

  private formatDate(d: Date): string {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  private formatTime(d: Date): string {
    let hours = d.getHours();
    const mins = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, '0')}:${mins} ${ampm}`;
  }
}
