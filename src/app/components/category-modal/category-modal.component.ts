import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category-modal.component.html',
  styleUrls: ['./category-modal.component.css'],
})
export class CategoryModalComponent implements OnInit, OnChanges {
  @Input() categories: any[] = [];
  @Input() showModal: boolean = false;
  @Output() categorySelected = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<void>();

  filteredCategories: any[] = [];
  searchQuery: string = '';

  ngOnInit() {
    this.filteredCategories = [...this.categories];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categories'] && this.categories) {
      this.filteredCategories = [...this.categories];
      this.filterCategories();
    }
  }

  filterCategories() {
    if (!this.searchQuery.trim()) {
      this.filteredCategories = [...this.categories];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredCategories = this.categories.filter(
        (cat) =>
          cat.libelle.toLowerCase().includes(query) ||
          (cat.description && cat.description.toLowerCase().includes(query))
      );
    }
  }

  selectCategory(category: any) {
    this.categorySelected.emit(category);
    this.closeModal();
  }

  closeModal() {
    this.showModal = false;
    this.searchQuery = '';
    this.modalClosed.emit();
  }

  onBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
