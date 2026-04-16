import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CaseFormComponent } from '../case-form/case-form.component';

@Component({
  selector: 'app-case-create',
  standalone: true,
  imports: [CommonModule, CaseFormComponent],
  templateUrl: './case-create.component.html',
})
export class CaseCreateComponent {
  private router = inject(Router);

  onSuccess(createdCase: any) {
    const rolePrefix = this.router.url.split('/')[1] || 'admin';
    this.router.navigate([`/${rolePrefix}/cases`]);
  }

  onCancel() {
    const rolePrefix = this.router.url.split('/')[1] || 'admin';
    this.router.navigate([`/${rolePrefix}/cases`]);
  }
}
