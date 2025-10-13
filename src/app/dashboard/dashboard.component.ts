import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UtilisateurService } from '../services/utilisateur';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  userRole: string | null = null;
  userName: string = '';
  userProducts: any[] = [];
  isLoadingProducts = false;

  constructor(
    private utilisateurService: UtilisateurService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    const currentUser = this.utilisateurService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.userRole = currentUser.role;
    this.userName = currentUser.name;

    if (this.userRole === 'VENDEUR') {
      this.loadUserProducts();
    }
  }

  loadUserProducts() {
    this.isLoadingProducts = true;
    // For sellers, load their own products (both valid and pending)
    this.productService.getProducts(1, 50).subscribe({
      next: (response: any) => {
        // Filter products by current user
        const currentUser = this.utilisateurService.getCurrentUser();
        this.userProducts = (response.data || []).filter((product: any) =>
          product.userId === currentUser?.id
        );
        this.isLoadingProducts = false;
      },
      error: (err) => {
        console.error('Error loading user products:', err);
        this.isLoadingProducts = false;
      }
    });
  }

  renewProduct(productId: string) {
    this.productService.renewProduct(productId).subscribe({
      next: (response: any) => {
        console.log('Product renewed:', response);
        alert('Produit renouvelé avec succès!');
        this.loadUserProducts(); // Refresh list
      },
      error: (err) => {
        console.error('Error renewing product:', err);
        alert('Erreur lors du renouvellement du produit.');
      }
    });
  }

  canRenew(product: any): boolean {
    if (!product.dateExpiration) return false;
    const expirationDate = new Date(product.dateExpiration);
    const now = new Date();
    return expirationDate > now;
  }

  logout() {
    this.utilisateurService.logout();
    this.router.navigate(['/login']);
  }

  navigateToAddProduct() {
    this.router.navigate(['/add-product']);
  }

  navigateToApproveProducts() {
    this.router.navigate(['/approve-products']);
  }

  navigateToManageCategories() {
    this.router.navigate(['/manage-categories']);
  }
}
