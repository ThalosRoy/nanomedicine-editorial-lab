# Manifiesto de Escenarios (9 Sets) — Nanomedicine Editorial Lab

Este manifiesto define la estructura conceptual, visual y funcional de los **9 sets (`Set 00` a `Set 08`)** que conforman el recorrido completo desde la arquitectura del material hasta la apoptosis celular propuesta, manteniendo una **única estética unificada** (*Scientific Editorial Biomolecular*).

> **Alcance:** No se incluye ningún módulo de síntesis de AgNPs ni preparación de extractos. Los sets de interacción tisular e intracelular (`Set 06` a `Set 08`) representan explícitamente el **mecanismo de acción propuesto**.

---

## Resumen General de Sets

| ID | Nombre del Set | Escala / Contexto | Clasificación Científica | Activos GLB Principales |
| :--- | :--- | :--- | :--- | :--- |
| **Set 00** | Scientific Editorial Environment | Estudio / Calibración | Infraestructura visual | Todos los shaders maestros |
| **Set 01** | Polymer Matrix Architecture | Nanométrica (Red porosa) | Arquitectura de material | `nanocellulose_matrix.glb` |
| **Set 02** | Rosemary Phytochemical Corona | Nanométrica (`Ag⁰` + Corona) | Arquitectura de material | `agnp_core.glb`, `rosemary_corona.glb`, `folate_ligands.glb` |
| **Set 03** | Embedded Nanogel System *(Protagonista)* | Meso/Nanométrica | Sistema compuesto (+ variante AgNP) | `nanocellulose_matrix.glb`, `agnp_core.glb`, `rosemary_corona.glb`, `folate_ligands.glb` |
| **Set 04** | Local Injection & Tumor Microenvironment | Celular / Intersticial | Administración y microambiente | `syringe_injector.glb`, `tumor_microenv.glb`, `nanocellulose_matrix.glb` |
| **Set 05** | Nanogel–Tissue Interaction & Targeting | Extracelular → Membrana | **Mecanismo propuesto** (Base vs. `+Folato`) | `agnp_core.glb`, `rosemary_corona.glb`, `folate_ligands.glb`, `receptor_fra.glb` |
| **Set 06** | Endocytosis & Endosomal Escape | Membrana → Endosoma → Citosol | **Mecanismo intracelular propuesto** | `clathrin_cage.glb`, `agnp_core.glb`, `rosemary_corona.glb` |
| **Set 07** | Intracristal Mitochondrial Stress & GSH Sequestration | Matriz y Crestas Mitocondriales | **Mecanismo intracelular propuesto** | `mitochondrion_editorial.glb` |
| **Set 08** | Mitochondrial Collapse & Apoptosis | Mitocondria → Citosol celular | **Mecanismo intracelular propuesto** | `mitochondrion_editorial.glb`, `apoptosome_cell.glb` |

---

## Detalle por Set

### Set 00 — Scientific Editorial Environment
* **Objetivo:** Calibrar la iluminación de estudio científico, escala relativa y las 5 familias maestras de materiales (*Nanocelulosa*, *Plata `Ag⁰`*, *Corona de Romero + Folato*, *Biomembrana*, *Complejo Proteico*).

### Set 01 — Polymer Matrix Architecture
* **Objetivo:** Representar la matriz porosa tridimensional de **Nanocelulosa** como red continua de fibrillas entrelazadas con cavidades y envoltura hidratada (conmutador de corte 3/4; sin ácido fólico en el exterior del nanogel).

### Set 02 — Rosemary Phytochemical Corona
* **Objetivo:** Mostrar el núcleo metálico satinado de plata (`Ag⁰`) recubierto por la corona densa en cepillo de fitoquímicos de *Rosmarinus officinalis* (`–OH` y `–COOH`), con corte 3/4 para inspeccionar la interfaz núcleo–recubrimiento y variante opcional de funcionalización con **Ácido Fólico** sobre la nanopartícula.

### Set 03 — Embedded Nanogel System *(Modelo Protagonista)*
* **Objetivo:** Integrar múltiples AgNPs funcionalizadas dentro de los poros de la matriz de nanocelulosa, alternando entre corte 3/4 e inspección completa, así como entre formulación Base y variante `+Folato` (aplicada únicamente a las AgNPs internas, no al exterior del nanogel).

### Set 04 — Local Injection & Tumor Microenvironment
* **Objetivo:** Representar la jeringa de administración intratumoral con flujo pseudoplástico del nanogel y depósito *in situ*, contrastando el tejido sano ordenado (`pH 7.4`) frente al esferoide tumoral heterogéneo irrigado por vasculatura angiogénica bajo **Efecto Warburg** (`pH 6.2–6.8`).

### Set 05 — Nanogel–Tissue Interaction & Ligand Targeting *(Mecanismo Propuesto)*
* **Objetivo:** Mostrar la comparativa dinámica sobre una bicapa fosfolipídica explícita con receptores triméricos **FR-α** entre la partícula Base y la variante funcionalizada con **Ácido Fólico**.

### Set 06 — Endocytosis & Endosomal Escape *(Mecanismo Propuesto)*
* **Objetivo:** Visualizar la invaginación de la bicapa mediante canasta poliédrica de **Clatrina (CME)** y estrangulamiento horizontal por **Dinamina** en el plano de membrana; acidificación por bombas **V-ATPasa** (`pH ~4.5`) con apertura de la corona fitoquímica; y disolución oxidativa (`Ag⁰ → Ag⁺`) con peroxidación lipídica y escape citosólico.

### Set 07 — Intracristal Mitochondrial Stress & GSH Sequestration *(Mecanismo Propuesto)*
* **Objetivo:** Mostrar explícitamente el interior mitocondrial: entrada de iones `Ag⁺`, secuestro directo de los grupos tiol (`–SH`) del tripéptido **Glutatión (GSH)** formando complejos inactivos `Ag–SG`, fuga electrónica en complejos **ETC** con ráfaga de **ROS**, peroxidación de fosfolípidos en las crestas y daño al ADNmt.

### Set 08 — Mitochondrial Collapse & Apoptosis *(Mecanismo Propuesto)*
* **Objetivo:** Representar la caída de `ΔΨm`, la liberación de **Citocromo c** vía poro mPTP y la activación de complejos heptaméricos **Caspasa 9 → Caspasa 3** con formación de cuerpos apoptóticos sellados.
