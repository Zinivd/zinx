import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create',
  imports: [FormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class InvoiceCreateComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private location: Location,
  ) {}

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }
}
