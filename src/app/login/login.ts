// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { animations } from './animations';
// import { SignupComponent } from '../signup/signup';
// import { UtilisateurService } from '../services/utilisateur';
// import { HttpErrorResponse } from '@angular/common/http';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule, SignupComponent],
//   templateUrl: './login.html',
//   styleUrls: ['./login.css'],
//   animations: animations,
// })
// export class LoginComponent {
//   email = '';
//   password = '';
//   rememberMe = false;
//   showPassword = false;
//   isCardHovered = false;
//   isFocusedEmail = false;
//   isFocusedPassword = false;
//   isEmailHovered = false;
//   isPasswordHovered = false;
//   isSubmitHovered = false;
//   isSubmitting = false;
//   showSignup = false;

//   items: number[] = [1, 2, 3, 4, 5, 6, 7];
//   particles: Array<{ left: string; top: string; delay: string }> = [];

//   constructor(private utilisateurService: UtilisateurService) {
//     // Génération des particules pour l'animation
//     for (let i = 0; i < 20; i++) {
//       this.particles.push({
//         left: `${Math.random() * 100}%`,
//         top: `${Math.random() * 100}%`,
//         delay: `${Math.random() * 2}s`,
//       });
//     }
//   }

//   // 🔑 Méthode principale pour le login
//   onSubmit(): void {
//     this.errors = {};
//     if (!this.email) {
//       this.errors.email = 'Veuillez entrer votre email.';
//     }
//     if (!this.password) {
//       this.errors.password = 'Veuillez entrer votre mot de passe.';
//     }
//     if (this.errors.email || this.errors.password) {
//       return;
//     }

//     this.isSubmitting = true;

//     const credentials = { login: this.email, password: this.password };

//     this.utilisateurService.login(credentials).subscribe({
//       next: (res) => {
//         // Le token est déjà dans le cookie httpOnly, sécurisé
//         console.log('Connexion réussie:', res.user);
//         // Message de succès (optionnel)
//         this.isSubmitting = false; // arrêter le spinner
//       },
//       error: (err: HttpErrorResponse) => {
//         console.error('Erreur login:', err);
//         if (err.status === 401) {
//           // On suppose que l'API ne précise pas si c'est le login ou le mot de passe
//           this.errors.email = 'Email ou mot de passe incorrect.';
//           this.errors.password = 'Email ou mot de passe incorrect.';
//         } else {
//           this.errors.general = 'Échec de la connexion. Vérifiez votre serveur ou votre réseau.';
//         }
//         this.isSubmitting = false; // arrêter le spinner même en erreur
//       },
//     });
//   }

//   // Toggle pour afficher / masquer le mot de passe
//   togglePassword(): void {
//     this.showPassword = !this.showPassword;
//   }

//   errors: { email?: string; password?: string; general?: string } = {};
//   // Connexion sociale (simulée)
//   loginWithGoogle(): void {
//     alert('Connexion avec Google');
//   }

//   loginWithGithub(): void {
//     alert('Connexion avec GitHub');
//   }

//   // Switch vers le formulaire Signup
//   showSignupForm(): void {
//     this.showSignup = true;
//   }

//   showLoginForm(): void {
//     this.showSignup = false;
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { SignupComponent } from '../signup/signup';
import { UtilisateurService } from '../services/utilisateur';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, SignupComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  animations: [
    // 🌟 Animation d’apparition du bloc principal
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),

    // 🌟 Animation en cascade (stagger) pour les éléments internes
    trigger('staggerItems', [
      transition(':enter', [
        query(':self', [
          style({ opacity: 0, transform: 'translateY(15px)' }),
          stagger(100, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
          ]),
        ]),
      ]),
    ]),
  ],
})
export class LoginComponent {
  // ✉️ Données utilisateur
  email: string = '';
  password: string = '';
  emailMessage: string = 'Champ email prêt à recevoir votre adresse.';
  passwordMessage: string = 'Champ mot de passe prêt à recevoir votre mot de passe.';

  // 🧠 États visuels et interactions
  showPassword: boolean = false;
  rememberMe: boolean = false;
  showSignup: boolean = false;
  isCardHovered: boolean = false;
  isEmailHovered: boolean = false;
  isPasswordHovered: boolean = false;
  isSubmitHovered: boolean = false;
  isFocusedEmail: boolean = false;
  isFocusedPassword: boolean = false;
  isSubmitting: boolean = false;
  showPasswordMessage: string = 'Afficher ou masquer le mot de passe.';
  rememberMeMessage: string = 'Gardez votre session active.';
  submitMessage: string = 'Cliquez pour vous connecter.';

  // ⚙️ Correction de l’erreur : propriété `items` utilisée pour l’animation
  items: number[] = [1, 2, 3, 4, 5, 6, 7];
  itemsMessage: string = 'Animation des éléments du formulaire.';

  // 🌌 Particules de fond animées
  particles: Array<{ left: string; top: string; delay: string }> = Array.from({ length: 20 }).map(
    () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
    })
  );
  particlesMessage: string = 'Effet visuel décoratif.';

  constructor(private utilisateurService: UtilisateurService) {}

  // � Gestion des erreurs
  errors: { email?: string; password?: string; general?: string } = {};
  errorsMessage: string = 'Affichage des messages d’erreur.';

  // � Afficher / masquer le mot de passe
  togglePassword() {
    this.showPassword = !this.showPassword;
    this.showPasswordMessage = this.showPassword ? 'Mot de passe visible.' : 'Mot de passe masqué.';
  }

  // 🚀 Soumission du formulaire
  onSubmit() {
    this.isSubmitting = true;
    this.errors = {};

    // Exemple de validation simple
    if (!this.email) {
      this.errors.email = 'Veuillez entrer un email';
      this.emailMessage = 'Erreur : email manquant.';
    } else {
      this.emailMessage = 'Email saisi.';
    }
    if (!this.password) {
      this.errors.password = 'Veuillez entrer un mot de passe';
      this.passwordMessage = 'Erreur : mot de passe manquant.';
    } else {
      this.passwordMessage = 'Mot de passe saisi.';
    }

    if (Object.keys(this.errors).length > 0) {
      this.isSubmitting = false;
      this.submitMessage = 'Veuillez corriger les erreurs.';
      return;
    }

    // Appel réel au backend
    const credentials = { login: this.email, password: this.password };
    this.utilisateurService.login(credentials).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.submitMessage = 'Connexion réussie !';
        console.log('✅ Connexion réussie :', res.user);
      },
      error: (err: any) => {
        this.isSubmitting = false;
        // Si le backend retourne des erreurs précises
        if (err.error && err.error.errors) {
          if (err.error.errors.login) {
            this.errors.email = err.error.errors.login;
          }
          if (err.error.errors.password) {
            this.errors.password = err.error.errors.password;
          }
          this.submitMessage = 'Erreur d’identification.';
        } else if (err.status === 401) {
          this.errors.email = 'Email ou mot de passe incorrect.';
          this.errors.password = 'Email ou mot de passe incorrect.';
          this.submitMessage = 'Erreur d’identification.';
        } else {
          this.errors.general = 'Échec de la connexion. Vérifiez votre serveur ou votre réseau.';
          this.submitMessage = 'Erreur serveur ou réseau.';
        }
        console.error('Erreur login :', err);
      },
    });
  }

  // 🔄 Bascule entre connexion et inscription
  showSignupForm() {
    this.showSignup = true;
    this.itemsMessage = 'Formulaire d’inscription affiché.';
  }

  showLoginForm() {
    this.showSignup = false;
    this.itemsMessage = 'Formulaire de connexion affiché.';
  }
}
