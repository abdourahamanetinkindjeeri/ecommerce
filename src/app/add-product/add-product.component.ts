import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { UtilisateurService } from '../services/utilisateur';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css'],
})
export class AddProductComponent implements OnInit, OnDestroy {
  // Champs du formulaire
  title = '';
  description = '';
  price = 0;
  categoryId = '';
  userId = '';

  // Gestion images
  capturedImages: string[] = [];
  capturedFiles: File[] = [];
  isFormDisabled = true;

    // Catégories
  categories: any[] = [];
  filteredCategories: any[] = [];
  categorySearch = '';
  showCategoryDropdown = false;

  // États UI
  isSubmitting = false;
  errors: any = {};
  isLoadingUser = true;
  isEditMode = false;
  editProductId = '';

  // Caméra
  @ViewChild('camera', { static: false }) camera!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  isCameraActive = false;
  isCameraReady = false;
  private stream?: MediaStream;

  constructor(
    private productService: ProductService,
    private utilisateurService: UtilisateurService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['edit']) {
        this.isEditMode = true;
        this.editProductId = params['edit'];
        this.loadProductForEdit();
      }
    });
    this.loadUser();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  /** =============================
   * 🔹 Gestion caméra
   * ============================= */
  async startCamera() {
    try {
      this.isCameraActive = true;
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = this.camera.nativeElement;
      video.srcObject = this.stream;
      video.onloadedmetadata = () => {
        this.isCameraReady = true;
        video.play();
      };
    } catch (error) {
      console.error('Erreur accès caméra:', error);
      this.isCameraActive = false;
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.isCameraActive = false;
      this.isCameraReady = false;
    }
  }

  capturePhoto() {
    if (!this.isCameraReady) return;
    const video = this.camera.nativeElement;
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photo = canvas.toDataURL('image/png');
    this.capturedImages.push(photo);

    // Convertir base64 → Blob → File pour upload
    const blob = this.dataURLtoFile(photo, `capture-${Date.now()}.png`);
    this.capturedFiles.push(blob);
    this.isFormDisabled = false;
  }

  private dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  }

  /** =============================
   * 🔹 Gestion utilisateur & catégories
   * ============================= */
  loadUser() {
    const currentUser = this.utilisateurService.getCurrentUser();
    if (currentUser) {
      this.userId = currentUser.id;
      this.isLoadingUser = false;
      this.loadCategories();
      return;
    }

    this.utilisateurService.getMe().subscribe({
      next: (res: any) => {
        this.userId = res.user.id;
        this.utilisateurService.setCurrentUser(res.user);
        this.isLoadingUser = false;
        this.loadCategories();
      },
      error: (err) => {
        console.error('Erreur utilisateur:', err);
        this.router.navigate(['/login']);
        this.isLoadingUser = false;
      },
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (res: any) => {
        this.categories = res.data || [];
        this.filteredCategories = [...this.categories];
      },
      error: (err) => {
        console.error('Erreur catégories:', err);
      },
    });
  }

  loadProductForEdit() {
    this.productService.getProduct(this.editProductId).subscribe({
      next: (res: any) => {
        const product = res.data;
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.categoryId = product.categoryId;
        this.categorySearch = product.category?.libelle || '';
        // Load existing images
        if (product.images && product.images.length > 0) {
          this.capturedImages = product.images.map((img: any) => img.url);
          this.isFormDisabled = false;
        }
      },
      error: (err) => {
        console.error('Erreur chargement produit:', err);
        this.toastr.error('Erreur lors du chargement du produit à modifier.');
        this.router.navigate(['/dashboard']);
      },
    });
  }

  filterCategories() {
    const search = this.categorySearch.trim().toLowerCase();
    this.filteredCategories = search
      ? this.categories.filter((cat) => cat.libelle.toLowerCase().includes(search))
      : [...this.categories];

    this.showCategoryDropdown = this.filteredCategories.length > 0 && !!search;
  }

  selectCategory(category: any) {
    this.categoryId = category.id;
    this.categorySearch = category.libelle;
    this.showCategoryDropdown = false;
  }

  /** =============================
   * 🔹 Gestion fichiers
     * ============================= */
  onFileSelected(event: any) {
    const files = event.target.files;
    if (!files?.length) return;

    Array.from(files).forEach((file: any) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.capturedImages.push(e.target.result as string);
          this.capturedFiles.push(file);
          this.isFormDisabled = false;
        };
        reader.readAsDataURL(file);
      }
    });
    event.target.value = ''; // reset input
  }

  removeImage(index: number) {
    this.capturedImages.splice(index, 1);
    this.capturedFiles.splice(index, 1);
    this.isFormDisabled = this.capturedImages.length === 0;
  }

  addAnotherPhoto() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }

  /** =============================
   * 🔹 Soumission du formulaire
   * ============================= */
  onSubmit() {
    this.errors = {};
    if (!this.title.trim()) this.errors.title = 'Titre requis';
    if (!this.description.trim()) this.errors.description = 'Description requise';
    if (this.price <= 0) this.errors.price = 'Prix invalide';
    if (!this.categoryId) this.errors.category = 'Catégorie requise';
    if (this.capturedImages.length === 0) this.errors.images = 'Au moins une image requise';
    if (Object.keys(this.errors).length > 0) return;

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('price', this.price.toString());
    formData.append('categoryId', this.categoryId);
    if (!this.isEditMode) {
      formData.append('userId', this.userId);
    }

    this.capturedFiles.forEach((file, i) => {
      formData.append('images', file, `image${i + 1}.png`);
    });

    const serviceCall = this.isEditMode
      ? this.productService.updateProduct(this.editProductId, formData)
      : this.productService.createProduct(formData);

    serviceCall.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.toastr.success(`Produit ${this.isEditMode ? 'modifié' : 'ajouté'} avec succès !`);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Erreur soumission produit:', err);
        this.isSubmitting = false;
        this.errors.general = `Erreur lors de ${this.isEditMode ? 'la modification' : 'l\'ajout'} du produit.`;
      },
    });
  }
}
