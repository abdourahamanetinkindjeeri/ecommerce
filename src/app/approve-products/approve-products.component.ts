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
    this.productService.getProductsByStatus('VALIDE').subscribe({
      next: (res: any) => {
        this.pendingProducts = res.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading approved products:', err);
        this.error = 'Erreur lors du chargement des produits approuvés.';
        this.isLoading = false;
      }
    });
  }



  toggleVip(id: string) {
    this.productService.toggleVip(id).subscribe({
      next: (res: any) => {
        console.log('VIP toggled:', res);
        this.loadPendingProducts(); // Refresh list
        this.toastr.success(res.message);
      },
      error: (err) => {
        console.error('Error toggling VIP:', err);
        this.toastr.error('Erreur lors du changement du statut VIP.');
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
