import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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
    private router: Router,
    private toastr: ToastrService
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
        this.toastr.success('Produit approuvé avec succès!');
      },
      error: (err) => {
        console.error('Error approving product:', err);
        this.toastr.error('Erreur lors de l\'approbation du produit.');
      }
    });
  }

  rejectProduct(id: string) {
    this.productService.rejectProduct(id).subscribe({
      next: (res: any) => {
        console.log('Product rejected:', res);
        this.loadPendingProducts(); // Refresh list
        this.toastr.success('Produit rejeté avec succès!');
      },
      error: (err) => {
        console.error('Error rejecting product:', err);
        this.toastr.error('Erreur lors du rejet du produit.');
      }
    });
  }


  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
