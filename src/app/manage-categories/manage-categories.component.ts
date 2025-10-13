import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-categories.component.html',
  styleUrls: ['./manage-categories.component.css']
})
export class ManageCategoriesComponent implements OnInit {
  categories: any[] = [];
  isLoading = true;
  error: string | null = null;

  // Form data
  newCategory = {
    libelle: '',
    description: ''
  };
  isSubmitting = false;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Erreur lors du chargement des catégories.';
        this.isLoading = false;
      }
    });
  }

  addCategory() {
    if (!this.newCategory.libelle.trim()) {
      alert('Le nom de la catégorie est requis.');
      return;
    }

    this.isSubmitting = true;
    this.productService.createCategory(this.newCategory).subscribe({
      next: (res: any) => {
        console.log('Category created:', res);
        this.newCategory = { libelle: '', description: '' };
        this.loadCategories(); // Refresh list
        alert('Catégorie ajoutée avec succès!');
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Error creating category:', err);
        alert('Erreur lors de l\'ajout de la catégorie.');
        this.isSubmitting = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
