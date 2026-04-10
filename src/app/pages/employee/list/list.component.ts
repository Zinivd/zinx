import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  imports: [RouterModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class EmployeeListComponent implements OnInit {

  constructor(
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

}
