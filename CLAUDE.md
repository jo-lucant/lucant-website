# LUCANT Website — Instrucciones para Claude Code

## Objetivo
Publicar el sitio web estático de LUCANT en GitHub Pages.
El archivo fuente ya existe: `lucant-website.html`.

---

## Paso 1 — Crear la estructura del proyecto

Crea la siguiente estructura de carpetas en el directorio de trabajo:

```
lucant-website/
├── index.html        ← renombrar lucant-website.html a index.html
└── .github/
    └── workflows/
        └── deploy.yml
```

Copia el contenido de `lucant-website.html` dentro de `index.html`.
No modificar el contenido HTML, solo renombrar.

---

## Paso 2 — Crear el workflow de GitHub Actions

Crea el archivo `.github/workflows/deploy.yml` con este contenido exacto:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## Paso 3 — Inicializar Git y subir a GitHub

Ejecuta los siguientes comandos en orden dentro de `lucant-website/`:

```bash
git init
git add .
git commit -m "feat: sitio web LUCANT v1"
```

Luego crea un repositorio público en GitHub llamado `lucant-website`
y conecta el remoto:

```bash
git remote add origin https://github.com/jo-lucant/lucant-website.git
git branch -M main
git push -u origin main
```

> Si el repositorio aún no existe, usa la CLI de GitHub:
> ```bash
> gh repo create jo-lucant/lucant-website --public --source=. --remote=origin --push
> ```

---

## Paso 4 — Activar GitHub Pages

Después del primer push, activa GitHub Pages desde la configuración del repo:

```
GitHub repo → Settings → Pages → Source: GitHub Actions
```

O con la CLI:

```bash
gh api repos/jo-lucant/lucant-website/pages \
  --method POST \
  -f build_type=workflow \
  -f source.branch=main
```

---

## Paso 5 — Verificar el despliegue

Espera 1-2 minutos y verifica que el sitio esté en vivo:

```bash
gh browse
```

La URL pública será:
```
https://jo-lucant.github.io/lucant-website/
```

---

## Notas importantes

- Es un sitio **100% estático** — no necesita servidor, base de datos ni build step.
- Cualquier cambio al HTML se publica automáticamente con solo hacer `git push`.
- El workflow de GitHub Actions se dispara solo en cada push a `main`.
- Si se quiere dominio propio (ej. `lucant.co`), agregar un archivo `CNAME`
  con el dominio y configurar el DNS en el proveedor de dominio.

---

## Estructura final esperada

```
lucant-website/
├── index.html
├── CNAME              ← opcional, solo si hay dominio propio
└── .github/
    └── workflows/
        └── deploy.yml
```

Cuando todo esté listo, confirmar con:

```bash
gh run list --repo jo-lucant/lucant-website
```

El status debe mostrar `completed` / `success`.
