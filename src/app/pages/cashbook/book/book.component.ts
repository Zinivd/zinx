import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

interface Book {
  id: number;
  name: string;
  date: string;
  cashIn: number;
  cashOut: number;
  balance: number;
}

@Component({
  selector: 'app-book',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css'],
})
export class BookComponent implements OnInit {
  allBooks: Book[] = [
    { id: 1, name: 'Personal', date: '2021-01-01', cashIn: 1000, cashOut: 500, balance: 500 },
    { id: 2, name: 'Business', date: '2021-02-15', cashIn: 5000, cashOut: 2000, balance: 3000 },
    { id: 3, name: 'Savings', date: '2021-03-10', cashIn: 2000, cashOut: 200, balance: 1800 },
    { id: 4, name: 'Travel', date: '2021-04-05', cashIn: 800, cashOut: 750, balance: 50 },
    { id: 5, name: 'Education', date: '2021-05-20', cashIn: 3000, cashOut: 1500, balance: 1500 },
    { id: 6, name: 'Grocery', date: '2021-06-01', cashIn: 600, cashOut: 580, balance: 20 },
  ];

  // Search
  searchQuery: string = '';

  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;

  // Add Book Modal
  newBook = { bookname: '', description: '' };

  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {}

  // Filtering
  get filteredBooks(): Book[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.allBooks;
    return this.allBooks.filter((b) => b.name.toLowerCase().includes(q) || b.date.includes(q));
  }

  get paginatedBooks(): Book[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredBooks.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredBooks.length / this.pageSize) || 1;
  }

  get totalAmount(): number {
    return this.allBooks.reduce((s, b) => s + b.balance, 0);
  }
  get totalCashIn(): number {
    return this.allBooks.reduce((s, b) => s + b.cashIn, 0);
  }
  get totalCashOut(): number {
    return this.allBooks.reduce((s, b) => s + b.cashOut, 0);
  }
  get totalTransactions(): number {
    return this.allBooks.length;
  }

  // Search
  onSearchChange(): void {
    this.currentPage = 1;
  }

  goToPrev(): void {
    if (this.currentPage > 1) this.currentPage--;
  }

  goToNext(): void {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  deleteBook(id: number): void {
    this.allBooks = this.allBooks.filter((b) => b.id !== id);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    this.toastr.success('Book deleted successfully');
  }

  addBook(): void {
    if (!this.newBook.bookname.trim()) {
      this.toastr.error('Book name is required');
      return;
    }
    const newId = Math.max(...this.allBooks.map((b) => b.id), 0) + 1;
    this.allBooks.push({
      id: newId,
      name: this.newBook.bookname,
      date: new Date().toISOString().split('T')[0],
      cashIn: 0,
      cashOut: 0,
      balance: 0,
    });
    this.newBook = { bookname: '', description: '' };
    this.toastr.success('Book added successfully');
  }
}
