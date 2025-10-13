import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  products: any[] = [];
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;
  totalItems: number = 0;

  // Carrousel : index et timer par produit
  carouselIndexes: { [productId: string]: number } = {};
  carouselTimers: { [productId: string]: any } = {};
  carouselFade: { [productId: string]: boolean } = {};

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const page = parseInt(params['page'], 10) || 1;
      const limit = parseInt(params['limit'], 10) || 6;
      this.pageSize = limit;
      this.loadProducts(page);
    });
  }

  ngOnDestroy() {
    this.clearAllCarousels();
  }

  loadProducts(page: number) {
    this.productService.getProductsPaginated(page, this.pageSize).subscribe((response) => {
      this.products = response.data || [];
      this.totalItems = response.count || response.totalItems || response.total || 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
      this.currentPage = page;
      this.initCarousels();
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.router.navigate([], {
        queryParams: { page: this.currentPage + 1, limit: this.pageSize },
        queryParamsHandling: 'merge'
      });
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.router.navigate([], {
        queryParams: { page: this.currentPage - 1, limit: this.pageSize },
        queryParamsHandling: 'merge'
      });
    }
  }

  // Carrousel : initialisation et gestion
  initCarousels() {
    this.clearAllCarousels();
    this.products.forEach(product => {
      this.carouselIndexes[product.id] = 0;
      this.carouselFade[product.id] = false;
      if (product.images && product.images.length > 1) {
        this.carouselTimers[product.id] = setInterval(() => {
          this.fadeToNextImage(product);
        }, 20000);
      }
    });
  }

  clearAllCarousels() {
    Object.values(this.carouselTimers).forEach(timer => clearInterval(timer));
    this.carouselTimers = {};
    this.carouselIndexes = {};
    this.carouselFade = {};
  }

  carouselIndex(product: any): number {
    return this.carouselIndexes[product.id] || 0;
  }

  nextImage(product: any) {
    if (product.images && product.images.length > 1) {
      this.fadeToImage(product, (this.carouselIndex(product) + 1) % product.images.length);
    }
  }

  prevImage(product: any) {
    if (product.images && product.images.length > 1) {
      const idx = this.carouselIndex(product) - 1;
      this.fadeToImage(product, idx < 0 ? product.images.length - 1 : idx);
    }
  }

  fadeToNextImage(product: any) {
    this.nextImage(product);
  }

  fadeToImage(product: any, index: number) {
    this.carouselFade[product.id] = true;
    setTimeout(() => {
      this.carouselIndexes[product.id] = index;
      this.carouselFade[product.id] = false;
    }, 400); // durée de fade
  }

  carouselFadeOut(product: any): boolean {
    return this.carouselFade[product.id] || false;
  }
}
