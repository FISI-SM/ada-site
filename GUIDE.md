# Guía para mantener el sitio

Esta guía es para quien tenga que actualizar el sitio sin pelearse con el código. El sitio está hecho con **Jekyll** + el tema **just-the-docs**, y se publica solo en GitHub Pages cada vez que haces push.

## Verlo en tu máquina

```bash
bundle install        # solo la primera vez
bundle exec jekyll serve
```

Abre `http://localhost:4000/`. Se recarga solo al guardar.

## Dónde está cada cosa

| Quieres cambiar… | Edita |
|---|---|
| Texto del Home | `README.md` |
| About (descripción, late policy) | `sobre.md` |
| Un anuncio | crea/edita un archivo en `_announcements/` |
| Datos de las tarjetas (Assignments, Resources, prerequisitos, quick-links) | `_data/*.yml` |
| El cronograma | `calendario.md` |
| Instructores | `_staffers/*.md` |
| Logo, callouts, enlaces de marca | `_config.yml` |
| Colores, tipografía, estilos | `_sass/custom/custom.scss` y `_sass/color_schemes/` |

## Las tarjetas viven en YAML (no toques HTML)

Las grillas de tarjetas (cursos, libros, assignments, etc.) no se escriben a mano en cada página: el contenido vive en `_data/` como una lista simple. Por ejemplo, agregar un libro en `_data/resources.yml`:

```yaml
- title: Nombre del libro
  source: Autor; Editorial, año
  url: https://...
  external: true
```

Guardas y la tarjeta aparece sola. La plantilla que las dibuja es `_includes/cards.html` (esa casi nunca la tocas) y los iconos están en `_includes/icon.html`.

### ¿Por qué así y no Markdown plano?

Markdown plano es más cómodo de editar, pero **no permite el diseño de tarjetas/grillas** (GitHub Pages no deja instalar plugins para inventar sintaxis propia). La salida fue separar el **contenido** (YAML, fácil de tocar) de la **presentación** (la plantilla, escrita una sola vez). Así ganamos una UI más legible y ordenada sin tener que escribir HTML cada vez que cambia un dato.

Las páginas que son texto corrido (About, anuncios) siguen siendo Markdown normal, que para eso es lo más práctico.

## Anuncios

Cada anuncio es un archivo en `_announcements/`. Copia uno existente y cambia lo de arriba y el cuerpo:

```markdown
---
title: Week 11
week: 11
date: 2026-06-28
---

- Tu anuncio aquí, en Markdown normal.
```

Aparece automáticamente en Announcements y en el Home.
