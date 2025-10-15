import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approve-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approve-products.component.html',
  styleUrls: ['./approve-products.component.css']
})
export class ApproveProductsComponent implements OnInit {
  pendingProducts: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPendingProducts();
  }

  loadPendingProducts() {
    this.productService.getPendingProducts().subscribe({
      next: (res: any) => {
        this.pendingProducts = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading pending products:', err);
        this.error = 'Erreur lors du chargement des produits en attente.';
        this.isLoading = false;
      }
    });
  }

  approveProduct(id: string) {
    this.productService.approveProduct(id).subscribe({
      next: (res: any) => {
        console.log('Product approved:', res);
        this.loadPendingProducts(); // Refresh list
        alert('Produit approuvé avec succès!');
      },
      error: (err) => {
        console.error('Error approving product:', err);
        alert('Erreur lors de l\'approbation du produit.');
      }
    });
  }


  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
