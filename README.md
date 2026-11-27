# Nanomedicine Editorial Lab

**3D Scientific Visualization Environment**

Plataforma independiente de visualización científica interactiva para representar **nanogeles de nanocelulosa funcionalizados con nanopartículas de plata (AgNPs) y corona fitoquímica de romero (*Rosmarinus officinalis*)**, su variante de direccionamiento con ligandos, y el **mecanismo propuesto** de interacción celular oncológica (`endocitosis → escape endosómico → estrés oxidativo mitocondrial / ROS → apoptosis`).

* **Demo interactivo gratuito (GitHub Pages):** [https://thalosroy.github.io/nanomedicine-editorial-lab/](https://thalosroy.github.io/nanomedicine-editorial-lab/)

---

## Dirección Artística y Diseño

* **Escenas 3D (Blender & WebGL):** *Scientific Editorial Biomolecular* — síntesis visual unificada en los 9 sets con materiales PBR físicamente plausibles, cortes transversales 3/4 e iluminación de estudio de alto contraste.
* **Interfaz Web (`web-app/`):** Adaptación del sistema **Obsidian Molecular HUD** (fondo oscuro `#07090e`, paneles *glassmorphism* `#0d1117`, tipografía `Inter` + `JetBrains Mono`, telemetría bioquímica y modal **QR Salón** sin conexión para interacción móvil en vivo durante exposiciones).

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
| :--- | :--- | :--- |
| **Modelado 3D y Exportación** | Blender + Script Python (`bpy`) | `5.3.0` |
| **Aplicación Web Interactiva** | React + TypeScript + Vite | React `19.3` · TS `6.0` · Vite `8.4` |
| **Motor de Renderizado Web 3D** | Three.js + React Three Fiber + Drei | Three `0.187` · R3F `9.8` · Drei `10.7` |
| **Formato de Intercambio 3D** | glTF 2.0 Binario (`.glb`) | Exportado en `exports/glb/` y `web-app/public/models/` |

---

## Ejecución Local y Regeneración de Modelos

```bash
# 1. Instalar dependencias e iniciar servidor de desarrollo web
cd web-app
npm install
npm run dev
```

```bash
# 2. (Opcional) Regenerar archivos .blend locales y .glb con Blender 5.3
blender --background --factory-startup --python scripts/build_blender_assets.py
```

---

## Estructura del Proyecto

```text
NanoRender0.1/
├── .github/workflows/   # Despliegue automático gratuito a GitHub Pages
├── Blender/
│   ├── scenes/          # Escenas maestras .blend (locales)
│   ├── models/          # Modelos .blend generados por componente (locales)
│   ├── materials/       # Biblioteca común de materiales editoriales
│   ├── animations/      # Acciones y cachés de animación
│   └── references/      # Referencias de modelado para Blender
├── web-app/             # Aplicación interactiva React + TypeScript + R3F
├── assets/
│   ├── textures/        # Texturas y mapas compartidos
│   └── references/      # Activos de referencia procesados
├── exports/
│   ├── glb/             # Modelos GLB exportados desde Blender
│   └── renders/         # Renders de validación editorial
├── documentation/
│   ├── architecture/    # Arquitectura técnica, síntesis visual y manifiesto de los 9 sets
│   ├── scientific/      # Fundamento científico, rigor y mecanismo propuesto
│   └── technical/       # Notas técnicas y convenciones GLB/R3F
├── prompts/             # Documentación de control de escenas
├── scripts/             # Generador procedural headless en Blender (build_blender_assets.py)
├── README.md
└── PROJECT_RULES.md
```

---

## Resumen de los 9 Sets (`Set 00` – `Set 08`)

> **Nota de alcance:** Queda excluido cualquier módulo de síntesis de AgNPs, preparación de extractos o reacción química de reducción. El laboratorio parte del sistema ya sintetizado.

1. **Set 00 — Scientific Editorial Environment:** Iluminación de estudio, cámara, escala y exhibición calibrada de las 5 familias de materiales unificadas.
2. **Set 01 — Polymer Matrix Architecture:** Matriz porosa de **Nanocelulosa** (red fibrilar continua entrelazada con envoltura de hidrogel en corte 3/4) y **variante parametrizable de funcionalización con ligandos**.
3. **Set 02 — Silver Nanoparticles (AgNPs):** Núcleos metálicos de plata (`Ag⁰`) micro-facetados con acabado satinado editorial y diferenciación frente a iones `Ag⁺`.
4. **Set 03 — Rosemary Phytochemical Corona:** Recubrimiento molecular fitoquímico (*Rosmarinus officinalis*) en cepillo con puntas activas y corte 3/4.
5. **Set 04 — Embedded Nanogel System *(Modelo Protagonista)*:** AgNPs con corona fitoquímica embebidas en las cavidades porosas del nanogel de nanocelulosa (Base vs. `+Folato`).
6. **Set 05 — Tumor Tissue Microenvironment:** Esferoide tumoral heterogéneo con vasculatura angiogénica, matriz extracelular y acidez tumoral (Efecto Warburg, pH 6.2–6.8 vs. tejido sano pH 7.4).
7. **Set 06 — Nanogel–Tissue Interaction & Ligand Targeting *(Mecanismo Propuesto)*:** Depósito local en intersticio tumoral y comparativa de acoplamiento en bicapa lipídica hacia receptores triméricos **FR-α** (Base vs. `+Folato`).
8. **Set 07 — Endocytosis & Endosomal Escape *(Mecanismo Propuesto)*:** Endocitosis mediada por **Clatrina (CME)** y **Dinamina**; acidificación por bombas **V-ATPasa** (pH ~4.5), desprendimiento de la corona, disolución oxidativa (`Ag⁰ → Ag⁺`), peroxidación lipídica y escape al citosol.
9. **Set 08 — Mitochondrial Oxidative Stress & Apoptosis *(Mecanismo Propuesto)*:** Bloqueo de **Glutatión (GSH)** por `Ag⁺`, ráfaga de **ROS**, caída de `ΔΨm` en mitocondria con crestas y ADNmt, liberación de **Citocromo c** y activación de **Caspasa 9 → Caspasa 3**.

---

## Documentación Detallada

* [PROJECT_RULES.md](PROJECT_RULES.md)
* [VISUAL_STYLE_SYNTHESIS.md](documentation/architecture/VISUAL_STYLE_SYNTHESIS.md)
* [INITIAL_ARCHITECTURE.md](documentation/architecture/INITIAL_ARCHITECTURE.md)
* [SETS_MANIFEST.md](documentation/architecture/SETS_MANIFEST.md)
* [SCIENTIFIC_GUIDELINES.md](documentation/scientific/SCIENTIFIC_GUIDELINES.md)
