import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  openMenu: { [key: string]: boolean } = {
    dashboard: false,
    users: false,
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initial load
    this.setActiveMenu(this.router.url);

    // On route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveMenu(event.urlAfterRedirects);
      }
    });
  }

  toggleMenu(menu: string): void {
    // If the menu is already open, close it
    if (this.openMenu[menu]) {
      this.openMenu[menu] = false;
    } else {
      // Otherwise, close others and open this one
      Object.keys(this.openMenu).forEach(key => {
        this.openMenu[key] = false;
      });
      this.openMenu[menu] = true;
    }
  }

  private setActiveMenu(url: string): void {
    this.openMenu = {
      dashboard: url.startsWith('/admin/dashboard'),
      users: url.startsWith('/admin/users/'),
    };
  }
}
