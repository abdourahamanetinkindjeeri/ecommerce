import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, style, transition, animate, query, stagger } from '@angular/animations';
import { UtilisateurService } from '../services/utilisateur';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate(
          '600ms cubic-bezier(0.6, -0.05, 0.01, 0.99)',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('staggerItems', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(100, [
              animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
})
export class SignupComponent {
  @Output() connectRequested = new EventEmitter<void>();
  onConnectRequested() {
    this.connectRequested.emit();
  }

  // Champs formulaire
  name = '';
  email = '';
  password = '';
  telephone = '';
  adresse = '';
  acceptTerms = false;

  // UI States
  showPassword = false;
  isSubmitting = false;
  isCardHovered = false;

  // Focus States
  isFocusedName = false;
  isFocusedEmail = false;
  isFocusedPassword = false;
  isFocusedTelephone = false;
  isFocusedAdresse = false;

  // Hover States
  isNameHovered = false;
  isEmailHovered = false;
  isPasswordHovered = false;
  isTelephoneHovered = false;
  isAdresseHovered = false;
  isSubmitHovered = false;

  // Particles
  particles: Array<{ left: string; top: string; delay: string }> = [];

  // Stagger items
  items: any[] = Array(6).fill(0);

  // Gestion des erreurs
  errors: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    telephone?: string;
    adresse?: string;
  } = {};

  constructor(private utilisateurService: UtilisateurService, private toastr: ToastrService) {
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 2}s`,
      });
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  confirmPassword = '';

  async onSubmit(): Promise<void> {
    this.errors = {};
    let hasError = false;
    if (!this.name) {
      this.errors.name = 'Le nom est obligatoire.';
      hasError = true;
    }
    if (!this.email) {
      this.errors.email = "L'email est obligatoire.";
      hasError = true;
    } else if (!/^\S+@\S+\.\S+$/.test(this.email)) {
      this.errors.email = "L'email n'est pas valide.";
      hasError = true;
    }
    if (!this.telephone) {
      this.errors.telephone = 'Le téléphone est obligatoire.';
      hasError = true;
    } else if (!/^\+?[0-9]{9,15}$/.test(this.telephone)) {
      this.errors.telephone = "Le numéro de téléphone n'est pas valide.";
      hasError = true;
    }
    if (!this.adresse) {
      this.errors.adresse = "L'adresse est obligatoire.";
      hasError = true;
    }
    if (!this.password) {
      this.errors.password = 'Le mot de passe est obligatoire.';
      hasError = true;
    } else if (this.password.length < 8) {
      this.errors.password = 'Le mot de passe doit contenir au moins 8 caractères.';
      hasError = true;
    }
    if (!this.confirmPassword) {
      this.errors.confirmPassword = 'La confirmation du mot de passe est obligatoire.';
      hasError = true;
    } else if (this.password !== this.confirmPassword) {
      this.errors.confirmPassword = 'Les mots de passe ne correspondent pas.';
      hasError = true;
    }
    if (!this.acceptTerms) {
      this.toastr.error("Veuillez accepter les conditions d'utilisation");
      return;
    }
    if (hasError) {
      return;
    }
    this.isSubmitting = true;
    this.utilisateurService
      .register({
        name: this.name,
        email: this.email,
        password: this.password,
        telephone: this.telephone,
        adresse: this.adresse,
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.toastr.success('Compte créé avec succès !');
          // Reset form
          this.name = '';
          this.email = '';
          this.password = '';
          this.confirmPassword = '';
          this.telephone = '';
          this.adresse = '';
          this.acceptTerms = false;
          this.errors = {};
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toastr.error(err?.error?.message || "Erreur lors de l'inscription.");
        },
      });
  }

  signupWithGoogle() {
    this.toastr.info('Connexion via Google en cours...');
  }
  signupWithGithub() {
    this.toastr.info('Connexion via GitHub en cours...');
  }
}
