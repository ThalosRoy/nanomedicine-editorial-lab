# Reglas del Proyecto — Nanomedicine Editorial Lab

Este documento establece las reglas operativas, técnicas, de seguridad y de rigor científico obligatorias para todo desarrollo en este repositorio.

---

## 1. Reglas de Aislamiento y Seguridad del Repositorio

1. **Directorio exclusivo de trabajo:** Todo desarrollo se realiza exclusivamente dentro de la raíz del proyecto.
2. **Protección de repositorios de referencia:** Cualquier aplicación o repositorio previo utilizado como referencia conceptual se trata estrictamente en modo solo lectura.
3. **Independencia de Git y dependencias:** Este proyecto mantiene su propio repositorio Git independiente y su propio árbol de dependencias en `web-app/`.
4. **Cero filtración de información sensible:**
   * No incluir rutas absolutas del equipo local, correos personales, tokens, llaves API ni archivos de configuración de herramientas locales en el historial de Git.
   * Mantener los archivos binarios `.blend` fuera del control de versiones cuando incrusten rutas locales, versionando en su lugar el generador reproducible `scripts/build_blender_assets.py` y las exportaciones limpias `.glb`.

---

## 2. Reglas de Blender y Pipeline 3D

1. **Preservación de archivos maestros (`.blend`):**
   * Los modelos originales editables viven localmente en `Blender/scenes/` y `Blender/models/`.
   * **Nunca** sobrescribir un archivo `.blend` base durante procesos automatizados de exportación.
2. **Cohesión visual unificada:**
   * Todos los sets (`Set 00` – `Set 08`) deben respetar la guía de estilo única definida en `documentation/architecture/VISUAL_STYLE_SYNTHESIS.md` (iluminación de estudio, cortes 3/4, acabados PBR satinados/translúcidos y paleta editorial).
3. **Organización de escena y nomenclatura:**
   * Nombrar objetos, mallas y materiales de forma descriptiva y consistente (`AgNP_Core`, `Rosemary_Corona_Cutaway`, `Nanocellulose_Matrix`, etc.).
   * Separar geometrías por componente funcional.
4. **Exportación desacoplada (`GLB / GLTF`):**
   * Las exportaciones limpias para WebGL se depositan en `exports/glb/` y se sincronizan en `web-app/public/models/`.

---

## 3. Reglas de Rigor Científico

1. **Exclusión de la etapa de síntesis:**
   * No incluir módulos de síntesis de AgNPs, preparación de extractos ni reacciones de reducción química. La narrativa comienza con los materiales ya sintetizados.
2. **Fidelidad estructural por componente:**
   * **Matriz polimérica:** Representar la **nanocelulosa** como una red fibrosa tridimensional continua de filamentos entrelazados y cavidades porosas hidratadas, manteniendo la funcionalización con ligandos como variante superficial parametrizable.
   * **Diferenciación estricta:** Distinguir visual y estructuralmente:
     1. La matriz polimérica de nanocelulosa.
     2. El núcleo metálico de plata (`Ag⁰`) y los iones liberados (`Ag⁺`).
     3. La corona fitoquímica de *Rosmarinus officinalis*.
     4. La funcionalización superficial con ligandos (`+Folato`).
3. **Tratamiento del mecanismo oncológico intracelular:**
   * La cascada biológica `endocitosis → endosoma (pH ácido) → escape endosómico → estrés oxidativo mitocondrial (bloqueo de GSH / aumento de ROS) → apoptosis (Citocromo c / Caspasas 9 → 3)` debe presentarse y etiquetarse siempre como **mecanismo propuesto / simulación conceptual**.
   * No presentar parámetros normalizados de simulación como datos experimentales confirmados.
