# Creator Founder — Diagnóstico Personalizado

Landing + lead magnet (quiz que dice tu perfil y tu fase del camino).
Sitio estático, sin build.

## Arrancar en local
    cd /home/s4sf/creator-founder
    python3 -m http.server 4321
Abrir http://localhost:4321

## Estructura
- index.html   → landing (nav, hero, modelo, perfiles, camino, CTA, footer + overlay del quiz)
- styles.css   → sistema de diseño (dark premium)
- data.js      → contenido: perfiles, fases/caminos, preguntas y lógica del quiz
- app.js       → render + motor del diagnóstico + captura de lead
- assets/logo.svg → LOGO PLACEHOLDER (sustituir por el definitivo, mismo nombre)

## Cambiar el logo
Reemplaza `assets/logo.svg` por el logo final (mismo nombre y ~ratio 4:1).
