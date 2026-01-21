import { enableProdMode, LOCALE_ID } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

// 1. IMPORTACIONES PARA IDIOMA
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en'; // Importamos inglés también
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// 2. Registramos los formatos de fecha
registerLocaleData(localeEs);
registerLocaleData(localeEn);

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(),

    // 4. CONFIGURACIÓN DE TRADUCCIÓN (Standalone)
    provideTranslateService({
      defaultLanguage: 'es'
    }),
    provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json'
    })
    
    // Quitamos el LOCALE_ID fijo para poder cambiarlo dinámicamente en el componente
    // { provide: LOCALE_ID, useValue: 'es-ES' } <--- LO BORRAMOS O COMENTAMOS
  ],
});