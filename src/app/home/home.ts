// import { Component, OnInit } from '@angular/core';
// import { ProductService } from '../services/product.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router, ActivatedRoute } from '@angular/router';

// @Component({
//   selector: 'app-home',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './home.html',
//   styleUrl: './home.css',
// })
// export class Home implements OnInit {
//   products: any[] = [];
//   categories: any[] = [];
//   currentPage: number = 1;
//   pageSize: number = 6;
//   totalPages: number = 1;
//   totalItems: number = 0;

//   // Search and filter properties
//   searchQuery: string = '';
//   selectedCategory: string = '';
//   searchTimeout: any;

//   // Carrousel : index et timer par produit
//   carouselIndexes: { [productId: string]: number } = {};
//   carouselTimers: { [productId: string]: any } = {};
//   carouselFade: { [productId: string]: boolean } = {};

//   constructor(
//     private productService: ProductService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit() {
//     this.loadCategories();
//     this.route.queryParams.subscribe((params) => {
//       const page = parseInt(params['page'], 10) || 1;
//       const limit = parseInt(params['limit'], 10) || 6;
//       this.pageSize = limit;
//       this.loadProducts(page);
//     });
//   }

//   ngOnDestroy() {
//     this.clearAllCarousels();
//   }

//   loadCategories() {
//     this.productService.getCategories().subscribe((response: any) => {
//       this.categories = response.data || response || [];
//     });
//   }

//   loadProducts(page: number) {
//     let params: any = { page, limit: this.pageSize };

//     if (this.searchQuery.trim()) {
//       params.search = this.searchQuery.trim();
//     }

//     // Note: Category filtering would need backend support
//     // For now, we'll filter client-side if category is selected
//     this.productService.getProductsPaginated(page, this.pageSize, params.search).subscribe((response: any) => {
//       let products = (response.data || []).filter((product: any) => product.status === 'VALIDE');

//       // Client-side category filtering if backend doesn't support it
//       if (this.selectedCategory) {
//         products = products.filter((product: any) => product.categoryId === this.selectedCategory);
//       }

//       this.products = products;
//       this.totalItems = response.count || response.totalItems || response.total || 0;
//       this.totalPages = Math.ceil(this.totalItems / this.pageSize);
//       this.currentPage = page;
//       this.initCarousels();
//     });
//   }

//   nextPage() {
//     if (this.currentPage < this.totalPages) {
//       this.router.navigate([], {
//         queryParams: { page: this.currentPage + 1, limit: this.pageSize },
//         queryParamsHandling: 'merge',
//       });
//     }
//   }

//   prevPage() {
//     if (this.currentPage > 1) {
//       this.router.navigate([], {
//         queryParams: { page: this.currentPage - 1, limit: this.pageSize },
//         queryParamsHandling: 'merge',
//       });
//     }
//   }

//   // Carrousel : initialisation et gestion
//   initCarousels() {
//     this.clearAllCarousels();
//     this.products.forEach((product) => {
//       this.carouselIndexes[product.id] = 0;
//       this.carouselFade[product.id] = false;
//       if (product.images && product.images.length > 1) {
//         this.carouselTimers[product.id] = setInterval(() => {
//           this.fadeToNextImage(product);
//         }, 20000);
//       }
//     });
//   }

//   clearAllCarousels() {
//     Object.values(this.carouselTimers).forEach((timer) => clearInterval(timer));
//     this.carouselTimers = {};
//     this.carouselIndexes = {};
//     this.carouselFade = {};
//   }

//   carouselIndex(product: any): number {
//     return this.carouselIndexes[product.id] || 0;
//   }

//   nextImage(product: any) {
//     if (product.images && product.images.length > 1) {
//       this.fadeToImage(product, (this.carouselIndex(product) + 1) % product.images.length);
//     }
//   }

//   prevImage(product: any) {
//     if (product.images && product.images.length > 1) {
//       const idx = this.carouselIndex(product) - 1;
//       this.fadeToImage(product, idx < 0 ? product.images.length - 1 : idx);
//     }
//   }

//   fadeToNextImage(product: any) {
//     this.nextImage(product);
//   }

//   fadeToImage(product: any, index: number) {
//     this.carouselFade[product.id] = true;
//     setTimeout(() => {
//       this.carouselIndexes[product.id] = index;
//       this.carouselFade[product.id] = false;
//     }, 400); // durée de fade
//   }

//   carouselFadeOut(product: any): boolean {
//     return this.carouselFade[product.id] || false;
//   }

//   selectedProduct: any = null;

//   voirPlus(product: any) {
//     this.selectedProduct = product;
//   }

//   fermerPopup() {
//     this.selectedProduct = null;
//   }

//   // Search and filter methods
//   onSearchChange() {
//     // Debounce search to avoid too many API calls
//     if (this.searchTimeout) {
//       clearTimeout(this.searchTimeout);
//     }
//     this.searchTimeout = setTimeout(() => {
//       this.currentPage = 1; // Reset to first page when searching
//       this.loadProducts(1);
//     }, 300);
//   }

//   onCategoryChange() {
//     this.currentPage = 1; // Reset to first page when filtering
//     this.loadProducts(1);
//   }
// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'], // corrigé
})
export class Home implements OnInit, OnDestroy {
  products: any[] = [];
  categories: any[] = [];
  currentPage: number = 1;
  pageSize: number = 6;
  totalPages: number = 1;
  totalItems: number = 0;

  // Search and filter properties
  searchQuery: string = '';
  selectedCategory: string = '';
  searchTimeout: any;

  // Carrousel : index et timer par produit
  carouselIndexes: { [productId: string]: number } = {};
  carouselTimers: { [productId: string]: any } = {};
  carouselFade: { [productId: string]: boolean } = {};

  // Modal
  selectedProduct: any = null;
  currentImageIndex: number = 0;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.route.queryParams.subscribe((params) => {
      const page = parseInt(params['page'], 10) || 1;
      const limit = parseInt(params['limit'], 10) || 6;
      this.pageSize = limit;
      this.loadProducts(page);
    });
  }

  ngOnDestroy() {
    this.clearAllCarousels();
  }

  loadCategories() {
    this.productService.getCategories().subscribe((response: any) => {
      this.categories = response.data || response || [];
    });
  }

  loadProducts(page: number) {
    const params: any = { page, limit: this.pageSize };
    if (this.searchQuery.trim()) params.search = this.searchQuery.trim();

    this.productService
      .getProductsPaginated(page, this.pageSize, params.search)
      .subscribe((response: any) => {
        let products = (response.data || []).filter(
          (product: any) => product.status === 'VALIDE'
        );

        if (this.selectedCategory) {
          products = products.filter(
            (product: any) => product.categoryId === this.selectedCategory
          );
        }

        this.products = products;
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
        queryParamsHandling: 'merge',
      });
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.router.navigate([], {
        queryParams: { page: this.currentPage - 1, limit: this.pageSize },
        queryParamsHandling: 'merge',
      });
    }
  }

  // Carrousel : initialisation et gestion
  initCarousels() {
    this.clearAllCarousels();
    this.products.forEach((product) => {
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
    Object.values(this.carouselTimers).forEach((timer) => clearInterval(timer));
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
    }, 400);
  }

  carouselFadeOut(product: any): boolean {
    return this.carouselFade[product.id] || false;
  }

  // Modal
  voirPlus(product: any) {
    this.productService.getProduct(product.id).subscribe({
      next: (response: any) => {
        this.selectedProduct = response.data; // Use the updated product from backend with incremented views
        this.currentImageIndex = 0; // initialiser le carrousel modal
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du produit:', err);
        // Fallback to cached product if API fails
        this.selectedProduct = product;
        this.currentImageIndex = 0;
      }
    });
  }

  fermerPopup() {
    this.selectedProduct = null;
  }

  prevModalImage() {
    if (!this.selectedProduct || !this.selectedProduct.images) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.selectedProduct.images.length) %
      this.selectedProduct.images.length;
  }

  nextModalImage() {
    if (!this.selectedProduct || !this.selectedProduct.images) return;
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.selectedProduct.images.length;
  }

  // Search and filter methods
  onSearchChange() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.loadProducts(1);
    }, 300);
  }

  onCategoryChange() {
    this.currentPage = 1;
    this.loadProducts(1);
  }
}
