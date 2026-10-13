# ByteForge

Tienda de computadoras construida con React y Vite. La navegación entre `/` y `/catalogo` usa History API y conserva Atrás/Adelante. Las rutas directas y la vista 404 se preparan para GitHub Pages.

## Desarrollo

```sh
npm install
npm run dev
```

## Verificación y compilación

```sh
npm run lint
npm run build
npm run preview
```

El build se genera en `dist/`. `npm run build` añade las entradas necesarias para las rutas directas de GitHub Pages. El workflow `.github/workflows/deploy.yml` publica el sitio automáticamente en GitHub Pages al actualizar `main`; el repositorio debe tener Pages configurado para desplegar mediante GitHub Actions. La URL tendrá la forma `https://<usuario>.github.io/<repositorio>/`.
