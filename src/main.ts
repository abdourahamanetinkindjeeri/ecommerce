import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations'; // ✅ ajoute ceci
import { appConfig } from './app/app.config';
import { App } from './app/app';

// ✅ On injecte provideAnimations() dans la configuration globale
bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideAnimations(), // ✅ active le moteur d’animations Angular
  ],
}).catch((err) => console.error(err));
