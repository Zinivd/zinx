
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-create',
  imports: [FormsModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class ProjectCreateComponent implements OnInit {
  isEditMode   = false;
  projectId: number | null = null;
  isSubmitting = false;

  project: any = {
    name: '', client_name: '', email: '', contact: '',
    address: '', gst_no: '', quotation: '', type: '', deadline: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private location: Location,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) { this.isEditMode = true; this.projectId = +id; this.loadProject(+id); }
  }

  loadProject(id: number): void {
    this.projectService.getById(id).subscribe({
      next: (res) => {
        if (res.status && res.data) {
          const p = res.data;
          this.project = {
            name: p.name, client_name: p.client_name, email: p.email ?? '',
            contact: p.contact ?? '', address: p.address ?? '',
            gst_no: p.gst_no ?? '', quotation: p.quotation,
            type: p.type, deadline: p.deadline ?? '',
          };
        }
      },
      error: () => { this.toastr.error('Failed to load project'); this.router.navigate(['/project-list']); },
    });
  }

  onSubmit(): void {
    this.isSubmitting = true;
    const action = this.isEditMode
      ? this.projectService.update(this.projectId!, this.project)
      : this.projectService.create(this.project);

    action.subscribe({
      next: (res) => {
        this.isSubmitting = false;
        if (res.status) {
          this.toastr.success(this.isEditMode ? 'Project updated!' : 'Project created!');
          this.router.navigate(['/project-list']);
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        const errors = err?.error?.errors;
        if (errors) Object.values(errors).forEach((m: any) => this.toastr.error(m[0]));
        else this.toastr.error(err?.error?.message || 'Something went wrong');
      },
    });
  }

  validateContact(e: any): void {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
  }
  validateGST(e: any): void {
    e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 15);
  }

  goBack(): void { this.location.back(); }
}
