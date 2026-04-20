import { CommonModule, DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

export type EntityTableColumnType = 'text' | 'date' | 'status';

export interface EntityTableColumn {
  name: string;
  prop: string;
  type?: EntityTableColumnType;
  width?: number;
  minWidth?: number;
}

@Component({
  selector: 'app-entity-table',
  standalone: true,
  imports: [CommonModule, NgxDatatableModule, DatePipe],
  templateUrl: './entity-table.component.html',
  styleUrl: './entity-table.component.css',
})
export class EntityTableComponent implements OnInit {
  @Input({ required: true }) columns: EntityTableColumn[] = [];
  @Input({ required: true }) rows: any[] = [];
  @Input() loading = false;
  @Input() totalCount = 0;
  @Input() pageSize = 10;
  @Input() pageOffset = 0;
  @Input() showUpdateAction = true;
  @Input() showDeleteAction = true;

  isCompactView = false;

  get totalPages(): number {
    return Math.ceil(this.totalCount / this.pageSize);
  }

  get currentPage(): number {
    return this.pageOffset + 1;
  }

  protected readonly Math = Math;

  @Output() rowSelected = new EventEmitter<any>();
  @Output() updateRequested = new EventEmitter<any>();
  @Output() deleteRequested = new EventEmitter<any>();
  @Output() pageChanged = new EventEmitter<{ offset: number; limit: number }>();

  ngOnInit(): void {
    this.updateViewportMode();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateViewportMode();
  }

  get columnMode(): 'standard' | 'force' {
    return this.isCompactView ? 'force' : 'standard';
  }

  get rowHeight(): number {
    return this.isCompactView ? 56 : 64;
  }

  get headerHeight(): number {
    return this.isCompactView ? 52 : 56;
  }

  get footerHeight(): number {
    return this.isCompactView ? 78 : 56;
  }

  resolveMinWidth(col: EntityTableColumn): number {
    const baseMinWidth = col.minWidth ?? 140;
    return this.isCompactView ? Math.min(baseMinWidth, 120) : baseMinWidth;
  }

  resolveWidth(col: EntityTableColumn): number {
    if (this.isCompactView) {
      return Math.min(col.width ?? 180, 150);
    }

    return col.width ?? 180;
  }

  onRowActivate(event: { type: string; row: any }): void {
    if (event.type !== 'click') {
      return;
    }

    this.rowSelected.emit(event.row);
  }

  onUpdate(event: MouseEvent, row: any): void {
    event.stopPropagation();
    this.updateRequested.emit(row);
  }

  onDelete(event: MouseEvent, row: any): void {
    event.stopPropagation();
    this.deleteRequested.emit(row);
  }

  onPage(event: { offset: number; limit?: number }): void {
    this.pageChanged.emit({
      offset: event.offset,
      limit: event.limit ?? this.pageSize,
    });
  }

  statusBadgeClass(value: unknown): string {
    const normalized = String(value ?? '').toLowerCase();

    if (normalized === 'active') return 'status-chip-active';
    if (normalized === 'inactive') return 'status-chip-inactive';
    if (normalized === 'transferred') return 'status-chip-transferred';
    if (normalized === 'deceased') return 'status-chip-deceased';

    return 'status-chip-default';
  }

  private updateViewportMode(): void {
    this.isCompactView = window.innerWidth <= 1200;
  }
}
