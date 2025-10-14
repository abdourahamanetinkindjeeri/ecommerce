import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="product">
      <h2>{{ product.title }}</h2>
      <p>{{ product.description }}</p>
      <div>Vues : {{ product.views }}</div>

      <!-- Affichage des images -->
      <div *ngIf="product.images?.length > 0" class="product-images">
        <img
          *ngFor="let img of product.images"
          [src]="img.url"
          [alt]="product.title"
          class="product-image"
        />
      </div>
    </div>
  `,
  styles: [`
    .product-images {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 10px;
    }
    .product-image {
      width: 150px;
      height: 150px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid #ccc;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: any;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProduct(id).subscribe((res: any) => {
        this.product = res.data;
      });
    }
  }
}
