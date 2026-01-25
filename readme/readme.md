# Weather Sweet 4v

Weather Sweet 4v es una aplicación móvil híbrida desarrollada con **Ionic** y **Angular** que permite consultar el clima actual y el pronóstico meteorológico de cualquier ciudad del mundo o mediante geolocalización GPS.

El proyecto destaca por su diseño moderno estilo **Glassmorphism**, su robustez en el manejo de errores y su soporte multi-idioma (Español/Inglés).

---

## Características Principales

* **Buscador de Ciudades:** Consulta el clima por nombre de ciudad.
* **Geolocalización (GPS):** Obtiene el clima de tu ubicación actual usando Capacitor Geolocation.
* **Diseño Glassmorphism:** Interfaz moderna con fondos degradados, transparencias y desenfoques.
* **Pronóstico 24 Horas:** Carrusel con scroll horizontal para ver la evolución inmediata.
* **Pronóstico 5 Días:** Lista agrupada por días para la previsión a largo plazo.
* **Detalle en Modal (Pop-up):** Al hacer clic en cualquier hora o día, se abre una tarjeta flotante centrada con detalles extra (Viento, Humedad, Sensación Térmica, Lluvia).
* **Manejo de Errores (UX):**
    * Notificaciones tipo **Toast** para feedback rápido.
    * Pantalla de "Sin Resultados" con ilustración (Nube Triste) cuando no se encuentra una ciudad.
* **Multi-idioma (i18n):** Soporte completo para Español (ES) e Inglés (EN) con cambio dinámico mediante banderas.

---

## Stack Tecnológico

* **Framework:** [Ionic 7+](https://ionicframework.com/) / [Angular](https://angular.io/) (Standalone Components).
* **Lenguaje:** TypeScript.
* **Estilos:** SCSS (Sass) con variables CSS personalizadas.
* **API:** [OpenWeatherMap API](https://openweathermap.org/api) (Endpoints: Weather, Forecast, Geocoding).
* **Librerías Adicionales:**
    * `@capacitor/geolocation`: Para acceso al GPS nativo.
    * `@ngx-translate/core`: Para la internacionalización (i18n).
    * `ionicons`: Iconografía.

---

## Estructura del Proyecto

El proyecto sigue una arquitectura modular y limpia:

```text
src/
├── app/
│   ├── core/               # Servicios e Interfaces (Lógica de negocio)
│   │   ├── services/       # weather.service.ts (Llamadas API)
│   │   └── interfaces/     # weather-data.ts (Modelos de datos)
│   ├── shared/             # Componentes reutilizables (Atomic Design)
│   │   ├── molecules/      # search-bar
│   │   └── organisms/      # current-weather, forecast-list
│   └── home/               # Página principal (Lógica de vista y gestión de estado)
├── assets/
│   └── i18n/               # Archivos de traducción (es.json, en.json)
└── environments/           # Configuración de API Keys (Dev y Prod)


Instalación y Configuración
Sigue estos pasos para clonar y ejecutar el proyecto en tu máquina local.

1. Prerrequisitos
Asegúrate de tener instalado:

Node.js (versión LTS recomendada).

Ionic CLI: npm install -g @ionic/cli

2. Instalación de dependencias
Bash
npm install
3. Configuración de la API Key
El proyecto necesita una API Key de OpenWeatherMap.

Obtén tu clave gratuita en openweathermap.org.

Configura los archivos de entorno:

src/environments/environment.ts (Desarrollo) y src/environments/environment.prod.ts (Producción):

TypeScript
export const environment = {
  production: false, // (o true en prod)
  weatherApiKey: 'TU_API_KEY_AQUI',
  weatherApiUrl: '[https://api.openweathermap.org/data/2.5](https://api.openweathermap.org/data/2.5)'
};
Nota: Es crucial que ambos archivos tengan las mismas claves para evitar errores al compilar (ionic build).

4. Ejecutar en el navegador
Para ver la app en modo desarrollo:

Bash
ionic serve


Compilación para Móvil (Android)
Para generar el ejecutable nativo o probar en un emulador:

Construir el proyecto web:

Bash
ionic build
Sincronizar con Capacitor:

Bash
npx cap sync
Abrir en Android Studio:

Bash
npx cap open android
Nota sobre estilos en Android: Se ha forzado el fondo en ion-content para evitar que el fondo blanco por defecto del sistema oculte el texto blanco de la aplicación:

SCSS
ion-content {
  --background: var(--sweet-gradient);
}


Internacionalización (i18n)
La aplicación utiliza ngx-translate. Los archivos de traducción se encuentran en:

src/assets/i18n/es.json

src/assets/i18n/en.json

El cambio de idioma recarga las llamadas a la API para asegurar que la descripción del clima (ej: "Nubes dispersas" vs "Scattered clouds") venga traducida desde el servidor.

Autor
David Martín